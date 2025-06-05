const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


const AI_SERVER_URL = 'http://127.0.0.1:5050'; // URL AI-сервера

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

router.post('/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileStream = fs.createReadStream(filePath);
        const question = req.body.question;

        const form = new FormData();
        form.append('file', fileStream, req.file.originalname);
        form.append('question', question);

        const response = await axios.post(`${AI_SERVER_URL}/answer_by_file`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath);

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/generate-syllabus', async (req, res) => {
    try {
        const { subject } = req.body;

        if (!subject) {
            return res.status(400).json({ error: 'Subject is required' });
        }

        const response = await axios.post(`${AI_SERVER_URL}/generate_syllabus`, { subject });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
