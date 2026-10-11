require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { GoogleGenAI } = require('@google/genai');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve the frontend static files when running locally
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '..')));
}

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));

function convertUnit(from, to, value) {
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

router.post('/convert', (req, res) => {
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

router.get('/history', (req, res) => {
  const rows = db.prepare('SELECT id, from_unit, to_unit, input_value, output_value, timestamp FROM history ORDER BY id DESC LIMIT 50').all();
  res.json(rows);
});

router.delete('/history', (req, res) => {
  db.prepare('DELETE FROM history').run();
  res.json({ ok: true });
});

router.post('/ai-solve', async (req, res) => {
  const { query } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'Please provide a problem to solve.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      answer: "Wait! Gemini API Key is missing.",
      steps: [
        "The Universal AI Solver frontend is connected to the backend!",
        "However, the GEMINI_API_KEY environment variable is not set.",
        "Add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables, or in backend/.env for local development."
      ]
    });
  }

  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an engineering and physics tutor. The student asked: "${query}". Solve this problem step by step. Return a JSON object with exactly two keys: "answer" (a short string of the final answer with units) and "steps" (an array of strings, each string being one step of the calculation). Do not return markdown, only the raw JSON string.`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    let data;
    try {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch ? jsonMatch[0] : cleanedText);
    } catch (parseErr) {
      data = {
        answer: "Solution generated",
        steps: cleanedText.split('\n').filter(s => s.trim().length > 0)
      };
    }

    return res.json(data);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Failed to solve problem: " + (err.message || err) });
  }
});

router.post('/ai-academic', async (req, res) => {
  const { level, subject, resourceType } = req.body || {};
  if (!level || !subject || !resourceType) {
    return res.status(400).json({ error: 'Please provide level, subject, and resource type.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    const msg = "## Error: API Key Missing\n\nThe GEMINI_API_KEY environment variable is not set. Please add it in your Vercel Project Settings or local .env file.";
    return res.json({
      content: msg,
      markdown: msg
    });
  }

  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert academic professor. The user has requested a "${resourceType}" for the subject "${subject}" at the level "${level}". Provide a comprehensive, high-quality response. Use markdown formatting with '## ' for main headers, '### ' for subheaders, and '**' for bold. Do not use JSON, just return the raw markdown string text.`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.json({ content: response.text, markdown: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Failed to generate academic content: " + (err.message || err) });
  }
});

// Mount router on both '/api' and '/' to handle any rewrite scheme
app.use('/api', router);
app.use('/', router);

const port = process.env.PORT || 8080;
if (require.main === module && !process.env.VERCEL) {
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}

module.exports = app;
