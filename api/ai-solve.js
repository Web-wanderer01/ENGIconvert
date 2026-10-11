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

  // Support both pre-parsed body and raw string
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { query } = body || {};
  if (!query) {
    return res.status(400).json({ error: 'Please provide a problem to solve.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      answer: "Wait! Gemini API Key is missing.",
      steps: [
        "The Universal AI Solver frontend is connected to the backend!",
        "However, the GEMINI_API_KEY environment variable is not set in Vercel.",
        "Add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables."
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

    return res.status(200).json(data);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Failed to solve problem: " + (err.message || err) });
  }
};
