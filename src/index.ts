import express from "express";
import dotenv from "dotenv";
import path from "path";
import recommendationRoutes from "./routes/recommendation";
import { initializeDatabase } from "./database/init";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde carpeta public
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", recommendationRoutes);

// Ruta raíz - API info
app.get("/api", (req, res) => {
  res.json({
    message: "Fitness Band Recommendation API",
    version: "1.0.0",
    endpoints: {
      getSurvey: "GET /api/survey",
      recommend: "POST /api/recommend",
      history: "GET /api/history",
    },
  });
});

// Ruta raíz - Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}`);
      console.log(`🔌 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
