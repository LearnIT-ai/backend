const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Маршрути для користувачів
const aiRoutes = require('./routes/ai'); // Маршрути для взаємодії з AI
const errorHandler = require('./middleware/errorHandler'); // Обробка помилок
const aiRoutess = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5050;
const AI_SERVER_URL = 'http://localhost:5000/ask'; // URL AI-сервера

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Маршрути
app.use('/api/users', userRoutes); // Маршрути для користувачів
app.use('/api', aiRoutes); // Маршрути для взаємодії з AI
app.use('/api/ai', aiRoutess);


// Маршрут для обробки запитів до AI-сервера
app.post('/ask', (req, res) => {
    console.log(`Received request: ${JSON.stringify(req.body)}`);
    const { query_text } = req.body;

    if (!query_text) {
        console.error('Query text is missing!');
        return res.status(400).json({ error: 'Query text is required' });
    }

    console.log(`Processing query: ${query_text}`);
    res.json({ response: `Processed query: ${query_text}` });
});


// Error Handling Middleware
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
