import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth.js";

import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./server/routes/auth.routes.js";
import sectorRoutes    from "./server/routes/sectors.routes.js";
import categoryRoutes  from "./server//routes/categories.routes.js";
import productRoutes   from "./server/routes/products.routes.js";
import publicRoutes   from "./server/routes/public.routes.js";
import uploadRoutes    from "./server/routes/upload.routes.js";
import featuredRoutes    from "./server/routes/featured.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.raw({ limit: "100mb" }));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

// public
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);

// protected
app.use("/api/sectors",    auth, sectorRoutes);
app.use("/api/categories", auth, categoryRoutes);
app.use("/api/products",   auth, productRoutes);

app.use("/api/upload",     auth, uploadRoutes);
app.use("/api/featured",     auth, featuredRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0" , () => console.log(`Server running on port ${PORT}`));