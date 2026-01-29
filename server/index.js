const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
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

app.post('/api/generate', async (req, res) => {
    try {
        const { model, contents, config } = req.body;

        if (!contents) {
            return res.status(400).json({ error: "Missing 'contents' in request body" });
        }

        console.log(`[BFF] Request for model: ${model || 'default'}`);

        // Call Gemini API
        // Note: The SDK's generateContent method signature:
        // ai.models.generateContent({ model: string, contents: ..., config: ... })
        const response = await ai.models.generateContent({
            model: model || 'gemini-1.5-flash',
            contents: contents,
            config: config
        });

        // The SDK response object usually contains a `text` getter or property.
        // We need to serialize the relevant data to send back to the client.
        // `JSON.stringify(response)` might verify if the getters are serialized.
        // In the @google/genai generic client, the response structure is data-centric.
        // Let's send the whole thing.
        res.json(response);

    } catch (error) {
        console.error("❌ BFF Error:", error);
        res.status(500).json({
            error: error.message || "Internal Server Error",
            details: error.toString()
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 BFF Server running on http://localhost:${port}`);
});
