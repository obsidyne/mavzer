import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

// GET /api/categories?sectorId=x
router.get("/", async (req, res) => {
  try {
    const { sectorId } = req.query;
    if (!sectorId) return res.status(400).json({ message: "sectorId is required" });

    const categories = await prisma.category.findMany({
      // where: { sectorId },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    console.log(categories)
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// GET /api/categories/:id
router.get("/:id", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        sector: true,
        _count: { select: { products: true } },
      },
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.json(category);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch category" });
  }
});

// POST /api/categories
router.post("/", async (req, res) => {
  try {
    const { name, description, image, isActive, sectorId } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!sectorId) return res.status(400).json({ message: "sectorId is required" });

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const category = await prisma.category.create({
      data: { name, slug, description, image, isActive: isActive ?? true, sectorId },
      include: { _count: { select: { products: true } } },
    });
    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create category" });
  }
});

// PUT /api/categories/:id

// PUT /api/categories/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, description, image, isActive, order, sectorId } = req.body; // ← added sectorId
    console.log("[update caetgory]" , sectorId)
    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (isActive !== undefined) data.isActive = isActive;
    if (order !== undefined) data.order = order;
    if (sectorId !== undefined) data.sectorId = sectorId; // ← added

    console.log(data)

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
      include: { _count: { select: { products: true } } },
    });
    return res.json(category);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Category not found" });
    return res.status(500).json({ message: "Failed to update category" });
  }
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    return res.json({ message: "Category deleted" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Category not found" });
    return res.status(500).json({ message: "Failed to delete category" });
  }
});

export default router;