
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

// Try loading from server directory and root directory
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Default to 3001 to avoid conflict with Vite (3000)
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// WebSocket for Collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('update_lead', (data) => {
    // Broadcast to others in the room
    socket.to(data.room).emit('lead_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Generic Generate Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { model, contents, config } = req.body;

    // Safety check
    if (!model || !contents) {
      return res.status(400).json({ error: "Missing model or contents" });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: config
    });

    res.json(response);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Stream Endpoint
app.post('/api/generate/stream', async (req, res) => {
  try {
    const { model, contents, config } = req.body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await ai.models.generateContentStream({
      model: model,
      contents: contents,
      config: config
    });

    for await (const chunk of result.stream) {
      const text = chunk.text();
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { model, history, message, config } = req.body;

    const chat = ai.chats.create({
      model: model,
      history: history,
      config: config
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`BFF Server running on http://localhost:${PORT}`);
});
