const jwt = require('jsonwebtoken');

// Middleware для перевірки токену
//
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; // додаємо інформацію про користувача в об'єкт req
        next();
    });
};

module.exports = verifyToken;