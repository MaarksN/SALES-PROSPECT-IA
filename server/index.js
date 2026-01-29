const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars from root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Fallback: try loading from .env.local if .env not found or key missing
if (!process.env.GEMINI_API_KEY) {
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support large payloads (images/audio)

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ CRITICAL: GEMINI_API_KEY is missing in environment variables!");
    console.error("Please ensure .env or .env.local exists in the project root with GEMINI_API_KEY defined.");
} else {
    console.log("✅ GEMINI_API_KEY loaded.");
}

const ai = new GoogleGenAI({ apiKey });

// Initialize Supabase Client (if credentials exist)
// We look for VITE_ prefixed variables as they are likely what's in the .env for frontend
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase Auth configured.");
} else {
    console.warn("⚠️ Supabase Credentials missing or placeholder. Running in DEMO MODE (No Auth enforcement).");
}

/**
 * Middleware: Authenticate User via Supabase
 */
const authenticateUser = async (req, res, next) => {
    // 1. If Supabase is not configured, we allow the request (Demo Mode)
    // In a strict production environment, you might want to block this.
    if (!supabase) {
        // Optional: Check for a "demo" header or just log
        return next();
    }

    // 2. Extract Token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Unauthorized: Missing Authorization header" });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Malformed Authorization header" });
    }

    try {
        // 3. Verify Token
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("Auth Failed:", error?.message);
            return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
        }

        // 4. Attach User to Request (for potential RLS or logging)
        req.user = user;
        next();

    } catch (err) {
        console.error("Auth Unexpected Error:", err);
        return res.status(500).json({ error: "Internal Server Authentication Error" });
    }
};

// Apply Auth Middleware to sensitive endpoints
app.post('/api/generate', authenticateUser, async (req, res) => {
    try {
        const { model, contents, config } = req.body;

        if (!contents) {
            return res.status(400).json({ error: "Missing 'contents' in request body" });
        }

        // console.log(`[BFF] Request for model: ${model || 'default'} | User: ${req.user?.email || 'Demo/Anon'}`);

        // Call Gemini API
        const response = await ai.models.generateContent({
            model: model || 'gemini-1.5-flash',
            contents: contents,
            config: config
        });

        res.json(response);

    } catch (error) {
        console.error("❌ BFF Error:", error);
        res.status(500).json({
            error: error.message || "Internal Server Error",
            details: error.toString()
        });
    }
});

// STUB: RAG Context Upload
app.post('/api/upload-context', authenticateUser, async (req, res) => {
    // In production, use multer for file handling
    console.log("[BFF] Received context document upload request");
    res.json({ success: true, documentId: `doc_${Date.now()}` });
});

// STUB: Image Generation Endpoint (Imagen)
app.post('/api/generate-image', authenticateUser, async (req, res) => {
    try {
        const { prompt, aspectRatio } = req.body;
        // In a real implementation, this would call Vertex AI 'imagen-3.0-generate-001'
        // For now, we stub it to allow the frontend to call the BFF structure.

        // Mock successful response
        console.log(`[BFF] Generating Image for: "${prompt}"`);

        // Return a placeholder or call actual API if configured
        res.json({
            images: [
                {
                    url: "https://via.placeholder.com/1024x1024.png?text=AI+Image+Generated",
                    mimeType: "image/png"
                }
            ]
        });
    } catch (error) {
         res.status(500).json({ error: "Image generation failed" });
    }
});

app.listen(port, () => {
    console.log(`🚀 BFF Server running on http://localhost:${port}`);
});
