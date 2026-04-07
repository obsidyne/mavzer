import express from "express";
import prisma from "../../database.js";

const router = express.Router();

// GET /api/banners
router.get("/", async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
    return res.json(banners);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch banners" });
  }
});

// POST /api/banners
router.post("/", async (req, res) => {
  try {
    const { image, title, order, isActive } = req.body;
    if (!image) return res.status(400).json({ message: "Image is required" });
    const banner = await prisma.banner.create({
      data: { image, title: title || null, order: order ?? 0, isActive: isActive ?? true },
    });
    return res.status(201).json(banner);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create banner" });
  }
});

// PUT /api/banners/:id
router.put("/:id", async (req, res) => {
  try {
    const { image, title, order, isActive } = req.body;
    const banner = await prisma.banner.update({
      where: { id: req.params.id },
      data: { image, title: title || null, order: order ?? 0, isActive: isActive ?? true },
    });
    return res.json(banner);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update banner" });
  }
});

// DELETE /api/banners/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.banner.delete({ where: { id: req.params.id } });
    return res.json({ message: "Banner deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete banner" });
  }
});

export default router;