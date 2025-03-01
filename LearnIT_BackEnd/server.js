const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes'); // Підключаємо маршрути для користувачів

app.use(express.json()); // Для обробки JSON в тілі запитів

// Підключаємо маршрути
app.use('/api/users', userRoutes);

// Визначаємо порт
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
