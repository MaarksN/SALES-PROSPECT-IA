import express from "express";
const router = express.Router();

// Healthcheck endpoint
router.get("/health", (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
  res.json(health);
});

export default router;
