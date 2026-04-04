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

export default router;