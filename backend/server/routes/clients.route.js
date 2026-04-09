import express from "express";
import prisma from "../../database.js";
import { chownSync } from "fs";

const router = express.Router();

// GET /api/clients — public
router.get("/", async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    console.log("[cliets]", clients)
    return res.json(clients);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch clients" });
  }
});

// GET /api/clients/all — admin, all clients
router.get("/all", async (req, res) => {
  try {
    const clients = await prisma.client.findMany({ orderBy: { order: "asc" } });
    return res.json(clients);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch clients" });
  }
});

// POST /api/clients
router.post("/", async (req, res) => {
  try {
    const { name, logo, order, isActive } = req.body;
    if (!name || !logo) return res.status(400).json({ message: "Name and logo are required" });
    const client = await prisma.client.create({
      data: { name, logo, order: order ?? 0, isActive: isActive ?? true },
    });
    return res.status(201).json(client);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create client" });
  }
});

// PUT /api/clients/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, logo, order, isActive } = req.body;
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { name, logo, order: order ?? 0, isActive: isActive ?? true },
    });
    return res.json(client);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update client" });
  }
});

// DELETE /api/clients/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: req.params.id } });
    return res.json({ message: "Client deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete client" });
  }
});

export default router;