// Public routes — no auth required
import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

/**
 * Parse the comma-separated `image` field into { image, images }
 * image  = first URL (thumbnail / primary)
 * images = full array
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

// GET /api/public/sectors — all active sectors
router.get("/sectors", async (req, res) => {
  try {
    const sectors = await prisma.sector.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return res.json(sectors);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch sectors" });
  }
});

// GET /api/public/sector-products?sectorId=x
router.get("/sector-products", async (req, res) => {
  try {
    const { sectorId } = req.query;
    if (!sectorId) return res.status(400).json({ message: "sectorId is required" });

    const rows = await prisma.productSector.findMany({
      where: { sectorId },
      orderBy: { order: "asc" },
      include: {
        product: {
          select: {
            id: true, name: true, description: true,
            image: true, isGroup: true, isActive: true,
            depth: true, price: true,
            _count: { select: { subProducts: true } },
          },
        },
      },
    });

    const products = rows
      .map((r) => r.product)
      .filter((p) => p && p.isActive && p.depth === 0);

    return res.json(withImagesMany(products));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch sector products" });
  }
});

// GET /api/public/products?parentId=x
router.get("/products", async (req, res) => {
  try {
    const { parentId } = req.query;
    if (!parentId) return res.status(400).json({ message: "parentId is required" });

    const products = await prisma.product.findMany({
      where: { parentId, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, description: true,
        image: true, isGroup: true, price: true,
        _count: { select: { subProducts: true } },
      },
    });
    return res.json(withImagesMany(products));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/public/products/:id
router.get("/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id, isActive: true },
      include: {
        sectors: { include: { sector: true } },
      },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(withImages(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
});

// GET /api/public/products/:id/subproducts
router.get("/products/:id/subproducts", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { parentId: req.params.id, isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, description: true,
        image: true, isGroup: true, price: true,
        _count: { select: { subProducts: true } },
      },
    });
    return res.json(withImagesMany(products));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch subproducts" });
  }
});

// GET /api/public/groups
router.get("/groups", async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return res.json(groups);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch groups" });
  }
});

// GET /api/public/groups/:id
router.get("/groups/:id", async (req, res) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: req.params.id, isActive: true },
    });
    if (!group) return res.status(404).json({ message: "Group not found" });

    const rows = await prisma.productGroup.findMany({
      where: { groupId: req.params.id },
      include: {
        product: {
          select: {
            id: true, name: true, description: true,
            image: true, isGroup: true, price: true,
            isActive: true, depth: true,
            _count: { select: { subProducts: true } },
          },
        },
      },
    });

    const products = withImagesMany(
      rows.map((r) => r.product).filter((p) => p && p.isActive && p.depth === 0)
    );

    return res.json({ ...group, products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch group" });
  }
});

// GET /api/public/featured
router.get("/featured", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true, name: true, description: true,
        image: true, isGroup: true, price: true,
        _count: { select: { subProducts: true } },
        sectors: { include: { sector: true } },
      },
    });
    return res.json(withImagesMany(products));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch featured products" });
  }
});

// GET /api/public/sector-products/all
router.get("/sector-products/all", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { depth: 0, isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true, name: true, description: true,
        image: true, isGroup: true, price: true,
        _count: { select: { subProducts: true } },
      },
    });
    return res.json(withImagesMany(products));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch all products" });
  }
});

// GET /api/public/banners
router.get("/banners", async (req, res) => {
  try {
    const { device } = req.query;
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        ...(device === "mobile"
          ? { type: { in: ["MOBILE", "BOTH"] } }
          : device === "desktop"
          ? { type: { in: ["DESKTOP", "BOTH"] } }
          : {}),
      },
      orderBy: { order: "asc" },
    });
    return res.json(banners);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch banners" });
  }
});

// GET /api/public/clients
router.get("/clients", async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return res.json(clients);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch clients" });
  }
});

export default router;