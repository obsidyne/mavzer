import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

// GET /api/groups
router.get("/", async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return res.json(groups);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch groups" });
  }
});

// GET /api/groups/:id
router.get("/:id", async (req, res) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { products: true } },
      },
    });
    if (!group) return res.status(404).json({ message: "Group not found" });
    return res.json(group);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch group" });
  }
});

// POST /api/groups
router.post("/", async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const existing = await prisma.group.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ message: "A group with this name already exists" });

    const group = await prisma.group.create({
      data: { name, slug, description, image, isActive: isActive ?? true },
      include: { _count: { select: { products: true } } },
    });
    return res.status(201).json(group);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create group" });
  }
});

// PUT /api/groups/:id
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

    const group = await prisma.group.update({
      where: { id: req.params.id },
      data,
      include: { _count: { select: { products: true } } },
    });
    return res.json(group);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Group not found" });
    return res.status(500).json({ message: "Failed to update group" });
  }
});

// DELETE /api/groups/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.group.delete({ where: { id: req.params.id } });
    return res.json({ message: "Group deleted" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Group not found" });
    return res.status(500).json({ message: "Failed to delete group" });
  }
});

// POST /api/groups/link — add a product to a group
router.post("/link", async (req, res) => {
  try {
    const { productId, groupId } = req.body;
    if (!productId || !groupId) return res.status(400).json({ message: "productId and groupId are required" });

    await prisma.productGroup.create({ data: { productId, groupId } });
    return res.json({ message: "Product linked to group" });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ message: "Product already in group" });
    return res.status(500).json({ message: "Failed to link product" });
  }
});

// DELETE /api/groups/unlink — remove a product from a group
router.delete("/unlink", async (req, res) => {
  try {
    const { productId, groupId } = req.body;
    if (!productId || !groupId) return res.status(400).json({ message: "productId and groupId are required" });

    await prisma.productGroup.delete({ where: { productId_groupId: { productId, groupId } } });
    return res.json({ message: "Product unlinked from group" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Link not found" });
    return res.status(500).json({ message: "Failed to unlink product" });
  }
});

// GET /api/groups/:id/products — products in a specific group
router.get("/:id/products", async (req, res) => {
  try {
    const rows = await prisma.productGroup.findMany({
      where: { groupId: req.params.id },
      include: {
        product: {
          include: { _count: { select: { subProducts: true } } },
        },
      },
    });
    return res.json(rows.map((r) => r.product));
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch group products" });
  }
});

export default router;