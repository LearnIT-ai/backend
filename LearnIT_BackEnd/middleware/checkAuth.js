const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer токен

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Пряме використання
        req.user = decoded; // Додаємо інформацію про користувача до запиту

        console.log(req.user);  // Перевірте, що тут міститься правильна роль

        if (decoded.role !== 'admin') { // Перевірка на роль без окремої змінної
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
