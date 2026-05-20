import express from "express";
import dotenv from "dotenv";
import recommendationRoutes from "./routes/recommendation";
import { initializeDatabase } from "./database/init";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", recommendationRoutes);

app.get("/", (req, res) => {
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

async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
