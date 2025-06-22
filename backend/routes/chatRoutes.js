// routes/chat.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
       model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a productivity coach that helps organize tasks into an Eisenhower Matrix.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ error: 'Something went wrong with the AI response.' });
  }
});

module.exports = router;
