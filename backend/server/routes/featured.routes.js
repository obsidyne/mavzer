import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

// GET /api/featured — all featured products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { updatedAt: "desc" },
      include: {
        categories: {
          include: {
            category: { include: { sector: true } },
          },
        },
        _count: { select: { subProducts: true } },
      },
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch featured products" });
  }
});

// PUT /api/featured/:id — mark product as featured
router.put("/:id", async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { isFeatured: true },
      include: {
        categories: {
          include: {
            category: { include: { sector: true } },
          },
        },
        _count: { select: { subProducts: true } },
      },
    });
    return res.json(product);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Product not found" });
    return res.status(500).json({ message: "Failed to feature product" });
  }
});

// DELETE /api/featured/:id — remove from featured
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { isFeatured: false },
    });
    return res.json({ message: "Removed from featured" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Product not found" });
    return res.status(500).json({ message: "Failed to remove from featured" });
  }
});

export default router;