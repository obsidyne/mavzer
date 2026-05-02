import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

// GET /api/product-sectors/sectors
router.get("/sectors", async (req, res) => {
  try {
    const sectors = await prisma.sector.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return res.json(sectors);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch sectors" });
  }
});

// GET /api/product-sectors/products?sectorId=x  — ordered by ProductSector.order
router.get("/products", async (req, res) => {
  try {
    const { sectorId } = req.query;
    if (!sectorId) return res.status(400).json({ message: "sectorId is required" });

    const rows = await prisma.productSector.findMany({
      where: { sectorId },
      orderBy: { order: "asc" },
      include: {
        product: {
          include: {
            _count: { select: { subProducts: true } },
            sectors: { include: { sector: { select: { id: true, name: true } } } },
          },
        },
      },
    });

    const products = rows
      .map((r) => ({ ...r.product, sectorOrder: r.order }))
      .filter((p) => p && p.depth === 0);

    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products for sector" });
  }
});

// GET /api/product-sectors/all-products
router.get("/all-products", async (req, res) => {
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
        sectors: { include: { sector: { select: { id: true, name: true } } } },
      },
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch all products" });
  }
});

// POST /api/product-sectors/link
// Body: { productId, sectorId }
// Sets order to max+1 so new products go to bottom
router.post("/link", async (req, res) => {
  try {
    const { productId, sectorId } = req.body;
    if (!productId || !sectorId) return res.status(400).json({ message: "productId and sectorId are required" });

    const maxRow = await prisma.productSector.findFirst({
      where: { sectorId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (maxRow?.order ?? -1) + 1;

    await prisma.productSector.upsert({
      where: { productId_sectorId: { productId, sectorId } },
      create: { productId, sectorId, order: nextOrder },
      update: {},
    });

    return res.json({ message: "Linked" });
  } catch (err) {
    // P2002 = unique constraint — already linked, treat as success
    if (err.code === "P2002") return res.json({ message: "Already linked" });
    console.error(err);
    return res.status(500).json({ message: "Failed to link product to sector" });
  }
});

// DELETE /api/product-sectors/unlink
router.delete("/unlink", async (req, res) => {
  try {
    const { productId, sectorId } = req.body;
    if (!productId || !sectorId) return res.status(400).json({ message: "productId and sectorId are required" });

    await prisma.productSector.delete({
      where: { productId_sectorId: { productId, sectorId } },
    });

    return res.json({ message: "Unlinked" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Link not found" });
    console.error(err);
    return res.status(500).json({ message: "Failed to unlink product from sector" });
  }
});

// POST /api/product-sectors/reorder
// Body: { sectorId, productIds: [...] }  — ordered array of productIds
// Updates order field for each row
router.post("/reorder", async (req, res) => {
  try {
    const { sectorId, productIds } = req.body;
    if (!sectorId || !Array.isArray(productIds)) {
      return res.status(400).json({ message: "sectorId and productIds[] are required" });
    }

    await prisma.$transaction(
      productIds.map((productId, index) =>
        prisma.productSector.upsert({
          where: { productId_sectorId: { productId, sectorId } },
          update: { order: index },
          create: { productId, sectorId, order: index },
        })
      )
    );

    return res.json({ message: "Reordered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to reorder" });
  }
});

export default router;