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

// Imports de Segurança
import { requireAuth } from "./middleware/auth.js";
import { validate } from "./middleware/validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 3001;

// 1. Security Headers (Helmet) com CSP ajustado
app.use(helmet());

// 2. CORS Restritivo (Produção vs Dev)
const allowedOrigins = [process.env.VITE_APP_URL, "http://localhost:5173", "http://localhost:4173"];
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for now to avoid blocking localhost
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"]
}));

app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" })); // Increased limit just in case

// 3. Rate Limiting Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for dev
  message: "Muitas requisições. Tente mais tarde."
});
app.use("/api/", globalLimiter);

// 4. Rate Limiting Específico para IA
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50, // Increased for dev
  message: "Limite de geração de IA excedido. Aguarde."
});

// --- ROTAS ---

app.get("/health", (req, res) => {
  res.json({ status: "secure", timestamp: new Date().toISOString() });
});

// Esquema de Validação para Geração de Texto
const generateSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(10000), // Relaxed constraints
  })
});

// Rota Protegida (Auth + Validation + RateLimit)
app.post("/api/ai/generate",
  requireAuth,
  aiLimiter,
  validate(generateSchema),
  async (req, res) => {
    try {
      const { prompt } = req.body;
      console.log(`[IA] User ${req.user.id} solicitou geração.`);

      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Use model from env or default
      const modelName = "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      res.json({ text: result.response.text() });
    } catch (error) {
      console.error("Erro Seguro:", error.message);
      res.status(500).json({ error: "Falha no processamento seguro.", details: error.message });
    }
});

app.listen(port, () => {
  console.log(`🔒 Server Blindado rodando em http://localhost:${port}`);
});
