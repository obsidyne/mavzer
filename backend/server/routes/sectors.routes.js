import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

// GET /api/sectors
router.get("/", async (req, res) => {
  try {
    const sectors = await prisma.sector.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { categories: true } },
      },
    });
    return res.json(sectors);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch sectors" });
  }
});

// GET /api/sectors/:id
router.get("/:id", async (req, res) => {
  try {
    const sector = await prisma.sector.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { categories: true } },
      },
    });
    if (!sector) return res.status(404).json({ message: "Sector not found" });
    return res.json(sector);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch sector" });
  }
});

// POST /api/sectors
router.post("/", async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const existing = await prisma.sector.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ message: "Sector with this name already exists" });

    const sector = await prisma.sector.create({
      data: { name, slug, description, image, isActive: isActive ?? true },
    });
    return res.status(201).json(sector);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create sector" });
  }
});

// PUT /api/sectors/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, description, image, isActive, order } = req.body;

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (isActive !== undefined) data.isActive = isActive;
    if (order !== undefined) data.order = order;

    const sector = await prisma.sector.update({
      where: { id: req.params.id },
      data,
    });
    return res.json(sector);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Sector not found" });
    return res.status(500).json({ message: "Failed to update sector" });
  }
});

// DELETE /api/sectors/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.sector.delete({ where: { id: req.params.id } });
    return res.json({ message: "Sector deleted" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Sector not found" });
    return res.status(500).json({ message: "Failed to delete sector" });
  }
});

export default router;