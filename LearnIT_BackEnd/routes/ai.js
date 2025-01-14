const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_SERVER_URL = 'http://localhost:5000'; // URL AI-сервера

router.post('/ai', async (req, res) => {
    try {
        console.log('Sending request to AI server:', req.body);
        const aiResponse = await axios.post(`${AI_SERVER_URL}/ask`, {
            query_text: req.body.query_text,
        });
        console.log('AI server response:', aiResponse.data);

        res.status(200).json({
            response: aiResponse.data.response,
            sources: aiResponse.data.sources
        });
    } catch (error) {
        console.error('Error communicating with AI server:', error.message);
        res.status(500).json({ error: 'Error communicating with AI server' });
    }

});

module.exports = router;
