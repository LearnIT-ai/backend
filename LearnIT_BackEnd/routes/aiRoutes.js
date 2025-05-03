const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const AI_SERVER_URL = 'http://127.0.0.1:5050'; // заміни на реальний URL FastAPI-сервера

// 1. Надіслати повідомлення в загальний чат
router.post('/send-message', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVER_URL}/send_message`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'AI server error', details: err.message });
    }
});

// 2. Перевірка домашки з файлу
router.post('/check-homework-file', upload.single('homework'), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('homework', req.file.buffer, req.file.originalname);

        const response = await axios.post(`${AI_SERVER_URL}/check_homework_file`, formData, {
            headers: formData.getHeaders(),
        });

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'AI server error', details: err.message });
    }
});

// 3. Перевірка домашки з тексту
router.post('/check-homework-text', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVER_URL}/check_homework_text`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'AI server error', details: err.message });
    }
});

// 4. Отримати фідбек
router.post('/get-homework-feedback', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVER_URL}/get_homework_feedback`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'AI server error', details: err.message });
    }
});

// 5. Порівняння текстів
router.post('/get-texts-similarity', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVER_URL}/get_texts_similarity`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'AI server error', details: err.message });
    }
});

// 6. Порівняння файлів
router.post('/get-files-similarity', upload.fields([
    { name: 'user_file', maxCount: 1 },
    { name: 'model_file', maxCount: 1 },
]), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('user_file', req.files['user_file'][0].buffer, req.files['user_file'][0].originalname);
        formData.append('model_file', req.files['model_file'][0].buffer, req.files['model_file'][0].originalname);

        const response = await axios.post(`${AI_SERVER_URL}/get_files_similarity`, formData, {
            headers: formData.getHeaders(),
        });

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'AI server error', details: err.message });
    }
});

// 7. Відповідь по файлу + питання
router.post('/answer-by-file', upload.single('file'), async (req, res) => {
    try {
        const question = req.query.question;
        if (!question) {
            return res.status(400).json({ error: 'Missing question query parameter' });
        }

        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);
        formData.append('question', question);

        const response = await axios.post(`${AI_SERVER_URL}/answer_by_file?question=${encodeURIComponent(question)}`, formData, {
            headers: formData.getHeaders(),
        });

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'AI server error', details: err.message });
    }
});

module.exports = router;
