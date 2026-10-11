require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { level, subject, resourceType } = body || {};
  if (!level || !subject || !resourceType) {
    return res.status(400).json({ error: 'Please provide level, subject, and resource type.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    const msg = "## Error: API Key Missing\n\nThe GEMINI_API_KEY environment variable is not set in Vercel. Please add it in your Vercel Project Settings > Environment Variables.";
    return res.json({ content: msg, markdown: msg });
  }

  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert academic professor. The user has requested a "${resourceType}" for the subject "${subject}" at the level "${level}". Provide a comprehensive, high-quality response. Use markdown formatting with '## ' for main headers, '### ' for subheaders, and '**' for bold. Do not use JSON, just return the raw markdown string text.`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.status(200).json({ content: response.text, markdown: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Failed to generate academic content: " + (err.message || err) });
  }
};
