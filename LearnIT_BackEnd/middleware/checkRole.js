const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Middleware для перевірки ролі
const checkRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role; // отримуємо роль з токену
        if (userRole === role) {
            next(); // якщо роль співпадає, пропускаємо далі
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    };
};

module.exports = checkRole;
