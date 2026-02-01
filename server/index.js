import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";

// Middlewares
import { requireAuth } from "./middleware/auth.js";
import { validate } from "./middleware/validation.js";
import { proxyMiddleware, handleHubSpotProxy } from "./middleware/proxy.js";

// Routes
import webhooksRouter from "./routes/webhooks.js";
import healthRouter from "./routes/health.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 3001;

// 1. Hardening
app.use(helmet());
app.use(compression()); // Gzip response
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));

// 2. CORS
const allowedOrigins = [process.env.VITE_APP_URL, "http://localhost:5173", "http://localhost:4173"];
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev permissive
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"]
}));

// 3. Rate Limiters
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
const aiLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 50 });

app.use("/api/", globalLimiter);

// 4. Routes Mounting
app.use("/api/webhooks", webhooksRouter);
app.use("/", healthRouter); // Root healthcheck

// AI Endpoint
const generateSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(10000),
    systemInstruction: z.string().optional(),
    config: z.object({
        temperature: z.number().optional()
    }).optional()
  })
});

app.post("/api/ai/generate", requireAuth, aiLimiter, validate(generateSchema), async (req, res) => {
    try {
      const { prompt, systemInstruction, config } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: systemInstruction
      });

      const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: config
      });

      res.json({ text: result.response.text() });
    } catch (error) {
      console.error("AI Error:", error.message);
      res.status(500).json({ error: "AI Processing Failed" });
    }
});

// CRM Proxy
app.post("/api/crm/hubspot/contact", requireAuth, handleHubSpotProxy);

app.listen(port, () => {
  console.log(`🔒 Secure Server running on http://localhost:${port}`);
});
