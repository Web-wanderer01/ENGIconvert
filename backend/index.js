const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve the frontend (project root) so the existing static files load
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (req, res) => res.json({ ok: true }));

function convertUnit(from, to, value) {
  // Define categories and unit maps (base units: meters for length, grams for mass)
  const length = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344
  };
  const mass = {
    mg: 0.001,
    g: 1,
    kg: 1000,
    oz: 28.349523125,
    lb: 453.59237
  };

  const isLength = from in length && to in length;
  const isMass = from in mass && to in mass;
  const isTemp = ['C', 'F', 'K'].includes(from) && ['C', 'F', 'K'].includes(to);

  if (isLength) {
    const inMeters = value * length[from];
    return inMeters / length[to];
  }
  if (isMass) {
    const inGrams = value * mass[from];
    return inGrams / mass[to];
  }
  if (isTemp) {
    // Convert from -> C -> to
    let c;
    if (from === 'C') c = value;
    else if (from === 'F') c = (value - 32) * (5/9);
    else if (from === 'K') c = value - 273.15;

    if (to === 'C') return c;
    if (to === 'F') return (c * 9/5) + 32;
    if (to === 'K') return c + 273.15;
  }

  throw new Error('Unsupported or mismatched units');
}

app.post('/api/convert', (req, res) => {
  const { from, to, value } = req.body || {};
  if (typeof from !== 'string' || typeof to !== 'string' || typeof value !== 'number') {
    return res.status(400).json({ error: 'Request body must include { from: string, to: string, value: number }' });
  }

  try {
    const result = convertUnit(from, to, value);
    const stmt = db.prepare('INSERT INTO history (from_unit, to_unit, input_value, output_value, timestamp) VALUES (?,?,?,?,?)');
    stmt.run(from, to, value, result, Date.now());
    return res.json({ result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.get('/api/history', (req, res) => {
  const rows = db.prepare('SELECT id, from_unit, to_unit, input_value, output_value, timestamp FROM history ORDER BY id DESC LIMIT 50').all();
  res.json(rows);
});

app.delete('/api/history', (req, res) => {
  db.prepare('DELETE FROM history').run();
  res.json({ ok: true });
});

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

app.post('/api/ai-solve', async (req, res) => {
  const { query } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'Please provide a problem to solve.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      answer: "Wait! Gemini API Key is missing.",
      steps: [
        "The Universal AI Solver frontend is successfully connected to the backend!",
        "However, the GEMINI_API_KEY environment variable is not set.",
        "To get real answers, create a .env file in the backend folder.",
        "Add GEMINI_API_KEY=your_api_key_here to unlock real AI problem solving."
      ]
    });
  }

  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an engineering and physics tutor. The student asked: "${query}". Solve this problem step by step. Return a JSON object with exactly two keys: "answer" (a short string of the final answer with units) and "steps" (an array of strings, each string being one step of the calculation). Do not return markdown, only the raw JSON string.`;
    
    const interaction = await client.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    const text = interaction.output_text || "{}";
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(cleanedText);

    return res.json(data);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Failed to solve problem: " + err.message });
  }
});

app.post('/api/ai-academic', async (req, res) => {
  const { level, subject, resourceType } = req.body || {};
  if (!level || !subject || !resourceType) {
    return res.status(400).json({ error: 'Please provide level, subject, and resource type.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      content: "## Error: API Key Missing\n\nThe GEMINI_API_KEY environment variable is not set in the backend/.env file. Please add it to generate academic resources."
    });
  }

  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert academic professor. The user has requested a "${resourceType}" for the subject "${subject}" at the level "${level}". Provide a comprehensive, high-quality response. Use markdown formatting with '## ' for main headers, '### ' for subheaders, and '**' for bold. Do not use JSON, just return the raw markdown string text.`;
    
    const interaction = await client.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    return res.json({ content: interaction.output_text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Failed to generate academic content: " + err.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
