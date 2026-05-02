import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

function makeSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// GET /api/products/resolve/:id
// Resolves whether an id belongs to a Category or a Product (group)
// Returns { type: "category"|"group", data: {...} }
router.get("/resolve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { sector: true, _count: { select: { products: true } } },
    });

    if (category) {
      return res.json({ type: "category", data: category });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { subProducts: true } } },
    });

    if (product) {
      return res.json({ type: "group", data: product });
    }

    return res.status(404).json({ message: "Not found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to resolve id" });
  }
});

// GET /api/products?categoryId=x  → root products for a category
// GET /api/products?parentId=x    → sub-products of a product group
router.get("/", async (req, res) => {
  try {
    const { categoryId, parentId } = req.query;

    if (!categoryId && !parentId) {
      return res.status(400).json({ message: "categoryId or parentId is required" });
    }

    if (parentId) {
      const products = await prisma.product.findMany({
        where: { parentId },
        orderBy: { order: "asc" },
        include: { _count: { select: { subProducts: true } } },
      });
      return res.json(products);
    }

    const products = await prisma.product.findMany({
      where: {
        depth: 0,
        categories: { some: { categoryId } },
      },
      orderBy: { order: "asc" },
      include: { _count: { select: { subProducts: true } } },
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/all — all layer 3 (depth=0) products with categories and sub-product count
router.get("/all", async (req, res) => {
  try {
    const { q } = req.query;
    const products = await prisma.product.findMany({
      where: {
        depth: 0,
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { subProducts: true } },
        categories: {
          include: { category: { include: { sector: true } } },
        },
      },
    });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/search?q=x&exclude=id1,id2
// Search existing products to add to a category/group
router.get("/search", async (req, res) => {
  try {
    const { q, exclude } = req.query;
    const excludeIds = exclude ? exclude.split(",") : [];

    const products = await prisma.product.findMany({
      where: {
        depth: 0,
        name: { contains: q || "", mode: "insensitive" },
        id: { notIn: excludeIds },
      },
      take: 20,
      orderBy: { name: "asc" },
      include: {
        categories: {
          include: { category: { include: { sector: true } } },
        },
      },
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to search products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        categories: { include: { category: { include: { sector: true } } } },
        subProducts: {
          orderBy: { order: "asc" },
          include: {
            _count: { select: { subProducts: true } },
            subProducts: {
              orderBy: { order: "asc" },
              include: { _count: { select: { subProducts: true } } },
            },
          },
        },
      },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
});


// POST /api/products/standalone — create a depth-0 product or group without categoryId
// Used by the new sector-based admin flow where products are linked to sectors separately
router.post("/standalone", async (req, res) => {
  try {
    const { name, description, image, price, details, isGroup, isActive, depth } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const slug = makeSlug(name) + "-" + Date.now();
    const data = {
      name, slug,
      description: description || null,
      image: image || null,
      isGroup: isGroup ?? false,
      isActive: isActive ?? true,
      depth: depth ?? 0,
      order: 0,
    };
    if (!isGroup) {
      data.details = details ?? null;
      data.price = price ? parseFloat(price) : null;
    }

    const product = await prisma.product.create({
      data,
      include: { _count: { select: { subProducts: true } }, sectors: { include: { sector: true } } },
    });
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// POST /api/products — create new product
router.post("/", async (req, res) => {
  try {
    const {
      name, description, image, price,
      details, isGroup, isActive,
      categoryId, parentId, depth, order,
    } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!categoryId && !parentId) return res.status(400).json({ message: "categoryId or parentId is required" });
    if ((depth ?? 0) > 2) return res.status(400).json({ message: "Maximum depth is 2" });

    if (categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!cat) return res.status(400).json({ message: `Category not found: ${categoryId}` });
    }

    const slug = makeSlug(name) + "-" + Date.now();

    const data = {
      name, slug,
      description: description || null,
      image: image || null,
      isGroup: isGroup ?? false,
      isActive: isActive ?? true,
      depth: depth ?? 0,
      order: order ?? 0,
    };

    if (!isGroup) {
      data.details = details ?? null;
      data.price = price ? parseFloat(price) : null;
    }

    if (parentId) data.parentId = parentId;

    const product = await prisma.product.create({
      data,
      include: { _count: { select: { subProducts: true } } },
    });

    if (categoryId && !parentId) {
      await prisma.productCategory.create({
        data: { productId: product.id, categoryId },
      });
    }

    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product", error: err.message });
  }
});

// POST /api/products/link — link existing product to a category or parent group
router.post("/link", async (req, res) => {
  try {
    const { productId, categoryId, parentId } = req.body;

    if (!productId) return res.status(400).json({ message: "productId is required" });
    if (!categoryId && !parentId) return res.status(400).json({ message: "categoryId or parentId is required" });

    if (categoryId) {
      // check not already linked
      const existing = await prisma.productCategory.findUnique({
        where: { productId_categoryId: { productId, categoryId } },
      });
      if (existing) return res.status(400).json({ message: "Product already linked to this category" });

      await prisma.productCategory.create({
        data: { productId, categoryId },
      });
    }

    if (parentId) {
      await prisma.product.update({
        where: { id: productId },
        data: { parentId },
      });
    }

    return res.json({ message: "Product linked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to link product" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, description, image, price, details, isActive, order } = req.body;

    const data = {};
    if (name !== undefined) { data.name = name; data.slug = makeSlug(name) + "-" + Date.now(); }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (price !== undefined) data.price = price ? parseFloat(price) : null;
    if (details !== undefined) data.details = details;
    if (isActive !== undefined) data.isActive = isActive;
    if (order !== undefined) data.order = order;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { _count: { select: { subProducts: true } } },
    });
    return res.json(product);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Product not found" });
    return res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE /api/products/unlink — unlink product from category (must be before /:id)
router.delete("/unlink", async (req, res) => {
  try {
    const { productId, categoryId } = req.body;
    await prisma.productCategory.delete({
      where: { productId_categoryId: { productId, categoryId } },
    });
    return res.json({ message: "Product unlinked" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to unlink product" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.json({ message: "Product deleted" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Product not found" });
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;

// GET /api/products/featured — get all featured products
// PUT /api/products/:id/featured — toggle featured status