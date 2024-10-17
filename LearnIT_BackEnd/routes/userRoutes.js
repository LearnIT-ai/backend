const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const router = express.Router();

// Маршрут для реєстрації
router.post('/register', registerUser);

// Маршрут для входу
router.post('/login', loginUser);

// Маршрут для отримання профілю користувача (захищений)
router.get('/profile', getUserProfile);

module.exports = router;
