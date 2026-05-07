import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

function makeSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Normalize images input → comma-separated string stored in DB.
 * Accepts:
 *   - string  "url1,url2,url3"   (already serialised)
 *   - array   ["url1","url2"]
 *   - null / undefined → null
 * First item becomes the primary thumbnail everywhere else.
 */
function serializeImages(input) {
  if (input == null) return null;
  if (Array.isArray(input)) {
    const cleaned = input.map((s) => s.trim()).filter(Boolean);
    return cleaned.length ? cleaned.join(",") : null;
  }
  if (typeof input === "string") {
    const cleaned = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return cleaned.length ? cleaned.join(",") : null;
  }
  return null;
}

/**
 * Parse the stored comma-separated string back into { image, images }.
 * image  = first URL (primary / thumbnail)
 * images = full ordered array
 */
function parseImages(raw) {
  if (!raw) return { image: null, images: [] };
  const images = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { image: images[0] ?? null, images };
}

function withImages(product) {
  if (!product) return product;
  const { image: raw, ...rest } = product;
  return { ...rest, ...parseImages(raw) };
}

function withImagesMany(products) {
  return products.map(withImages);
}

// ─── resolve ──────────────────────────────────────────────────────────────────

router.get("/resolve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { sector: true, _count: { select: { products: true } } },
    });
    if (category) return res.json({ type: "category", data: category });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { subProducts: true } } },
    });
    if (product) return res.json({ type: "group", data: withImages(product) });

    return res.status(404).json({ message: "Not found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to resolve id" });
  }
});

// ─── list / search ────────────────────────────────────────────────────────────

// GET /api/products?categoryId=x  or  ?parentId=x
router.get("/", async (req, res) => {
  try {
    const { categoryId, parentId } = req.query;
    if (!categoryId && !parentId)
      return res.status(400).json({ message: "categoryId or parentId is required" });

    if (parentId) {
      const products = await prisma.product.findMany({
        where: { parentId },
        orderBy: { order: "asc" },
        include: { _count: { select: { subProducts: true } } },
      });
      return res.json(withImagesMany(products));
    }

    const products = await prisma.product.findMany({
      where: { depth: 0, categories: { some: { categoryId } } },
      orderBy: { order: "asc" },
      include: { _count: { select: { subProducts: true } } },
    });
    return res.json(withImagesMany(products));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/all
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
        categories: { include: { category: { include: { sector: true } } } },
      },
    });
    return res.json(withImagesMany(products));
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/search?q=x&exclude=id1,id2
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
        categories: { include: { category: { include: { sector: true } } } },
      },
    });
    return res.json(withImagesMany(products));
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
    return res.json(withImages(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
});

// ─── create ───────────────────────────────────────────────────────────────────

// POST /api/products/standalone
router.post("/standalone", async (req, res) => {
  try {
    const { name, description, images, price, details, isGroup, isActive, depth } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const slug = makeSlug(name) + "-" + Date.now();
    const data = {
      name,
      slug,
      description: description || null,
      image: serializeImages(images),   // stored as comma-separated
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
      include: {
        _count: { select: { subProducts: true } },
        sectors: { include: { sector: true } },
      },
    });
    return res.status(201).json(withImages(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const {
      name, description, images, price,
      details, isGroup, isActive,
      categoryId, parentId, depth, order,
    } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!categoryId && !parentId)
      return res.status(400).json({ message: "categoryId or parentId is required" });
    if ((depth ?? 0) > 2) return res.status(400).json({ message: "Maximum depth is 2" });

    if (categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!cat) return res.status(400).json({ message: `Category not found: ${categoryId}` });
    }

    const slug = makeSlug(name) + "-" + Date.now();
    const data = {
      name,
      slug,
      description: description || null,
      image: serializeImages(images),
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

    return res.status(201).json(withImages(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product", error: err.message });
  }
});

// ─── link ─────────────────────────────────────────────────────────────────────

router.post("/link", async (req, res) => {
  try {
    const { productId, categoryId, parentId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });
    if (!categoryId && !parentId)
      return res.status(400).json({ message: "categoryId or parentId is required" });

    if (categoryId) {
      const existing = await prisma.productCategory.findUnique({
        where: { productId_categoryId: { productId, categoryId } },
      });
      if (existing)
        return res.status(400).json({ message: "Product already linked to this category" });
      await prisma.productCategory.create({ data: { productId, categoryId } });
    }

    if (parentId) {
      await prisma.product.update({ where: { id: productId }, data: { parentId } });
    }

    return res.json({ message: "Product linked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to link product" });
  }
});

// ─── update ───────────────────────────────────────────────────────────────────

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, description, images, price, details, isActive, order } = req.body;

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = makeSlug(name) + "-" + Date.now();
    }
    if (description !== undefined) data.description = description;
    if (images !== undefined) data.image = serializeImages(images);
    if (price !== undefined) data.price = price ? parseFloat(price) : null;
    if (details !== undefined) data.details = details;
    if (isActive !== undefined) data.isActive = isActive;
    if (order !== undefined) data.order = order;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { _count: { select: { subProducts: true } } },
    });
    return res.json(withImages(product));
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Product not found" });
    return res.status(500).json({ message: "Failed to update product" });
  }
});

// ─── delete / unlink ──────────────────────────────────────────────────────────

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