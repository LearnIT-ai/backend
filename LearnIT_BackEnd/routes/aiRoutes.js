const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_SERVERS = {
    compare: 'http://ai-server-compare.com/api/check', // URL першого AI
    analyze: 'http://ai-server-analyze.com/api/analyze', // URL другого AI
    checkSources: 'http://ai-server-checksources.com/api/check', // URL третього AI
};

// 1️⃣ Перевірка чи завдання співпадають
router.post('/compare', async (req, res) => {
    try {
        const { text1, text2 } = req.body;
        if (!text1 || !text2) {
            return res.status(400).json({ error: 'Both text1 and text2 are required' });
        }

        const response = await axios.post(AI_SERVERS.compare, { text1, text2 });
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with AI Compare:', error.message);
        res.status(500).json({ error: 'Failed to communicate with AI Compare' });
    }
});

// 2️⃣ Аналіз роботи
router.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const response = await axios.post(AI_SERVERS.analyze, { text });
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with AI Analyze:', error.message);
        res.status(500).json({ error: 'Failed to communicate with AI Analyze' });
    }
});

// 3️⃣ Перевірка на російські джерела
router.post('/check-sources', async (req, res) => {
    try {
        const { urls } = req.body;
        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ error: 'A list of URLs is required' });
        }

        const response = await axios.post(AI_SERVERS.checkSources, { urls });
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with AI CheckSources:', error.message);
        res.status(500).json({ error: 'Failed to communicate with AI CheckSources' });
    }
});

module.exports = router;
