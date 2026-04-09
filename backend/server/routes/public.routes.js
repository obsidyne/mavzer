// Public routes — no auth required
// Used by the frontend /products page

import { Router } from "express";
import prisma from "../../database.js";

const router = Router();

// GET /api/public/sectors — all active sectors with their categories
router.get("/sectors", async (req, res) => {
  try {
    const sectors = await prisma.sector.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: { id: true, name: true, image: true },
        },
      },
    });
    return res.json(sectors);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch sectors" });
  }
});

// GET /api/public/products?categoryId=x — root products for a category
// GET /api/public/products?parentId=x   — sub-products of a group
router.get("/products", async (req, res) => {
  try {
    const { categoryId, parentId } = req.query;

    if (!categoryId && !parentId) {
      return res.status(400).json({ message: "categoryId or parentId is required" });
    }

    if (parentId) {
      const products = await prisma.product.findMany({
        where: { parentId, isActive: true },
        orderBy: { order: "asc" },
        select: {
          id: true, name: true, description: true,
          image: true, isGroup: true, price: true,
          _count: { select: { subProducts: true } },
        },
      });
      return res.json(products);
    }

    const products = await prisma.product.findMany({
      where: {
        depth: 0,
        isActive: true,
        categories: { some: { categoryId } },
      },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, description: true,
        image: true, isGroup: true, price: true,
        _count: { select: { subProducts: true } },
      },
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/public/products/:id — single product or group details
router.get("/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id, isActive: true },
      include: {
        categories: {
          include: {
            category: {
              include: { sector: true },
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

// GET /api/public/groups — all active groups (with product count)
router.get("/groups", async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return res.json(groups);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch groups" });
  }
});

// GET /api/public/groups/:id — single group with its products
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
          where: { isActive: true, depth: 0 },
          select: {
            id: true, name: true, description: true,
            image: true, isGroup: true, price: true,
            _count: { select: { subProducts: true } },
          },
        },
      },
    });

    return res.json({
      ...group,
      products: rows.map((r) => r.product).filter(Boolean),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch group" });
  }
});

export default router;

// GET /api/public/featured — featured products for homepage
router.get("/featured", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true, name: true, description: true,
        image: true, isGroup: true, price: true,
        _count: { select: { subProducts: true } },
        categories: {
          include: { category: { include: { sector: true } } },
        },
      },
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch featured products" });
  }
});

// GET /api/public/banners
router.get("/banners", async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
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