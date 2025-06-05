const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT || 5000;
const AI_SERVER_URL = 'http://127.0.0.1:5050'; // URL FastAPI-сервера

// Імпорт маршрутів
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes'); // основні AI-рівні (що ти щойно створив)
const ai = require('./routes/ai');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Маршрути
app.use('/api/users', userRoutes); // користувачі
app.use('/api/ai', aiRoutes);      // AI-проксі FastAPI
app.use('/api/aiRoutes', ai);
app.use('/api', aiRoutes);         // (залишив, якщо використовуєш паралельно)


// Тимчасовий маршрут для /ask
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

// Error handler (якщо у тебе є окремо)
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
