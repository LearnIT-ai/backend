const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Маршрути для користувачів
const aiRoutes = require('./routes/ai'); // Маршрути для взаємодії з AI
const errorHandler = require('./middleware/errorHandler'); // Обробка помилок

const app = express();
const PORT = process.env.PORT || 5050;
const AI_SERVER_URL = 'http://localhost:5000/ask'; // URL AI-сервера

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Маршрути
app.use('/api/users', userRoutes); // Маршрути для користувачів
app.use('/api', aiRoutes); // Маршрути для взаємодії з AI

// Маршрут для обробки запитів до AI-сервера
app.post('/api/ask', async (req, res) => {
    const { user_message } = req.body;

    if (!user_message) {
        return res.status(400).json({ error: 'User message is required' });
    }

    console.log(`Received user message: ${user_message}`);

    try {
        const aiResponse = await axios.post(AI_SERVER_URL, { query_text: user_message });
        console.log('AI server response:', aiResponse.data);

        // Повертаємо відповідь клієнту
        return res.json({ response: aiResponse.data.response });
    } catch (error) {
        console.error('Error communicating with AI server:', error.message);

        return res.status(500).json({
            error: 'Failed to communicate with AI server',
            details: error.message,
        });
    }
});

// Error Handling Middleware
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
