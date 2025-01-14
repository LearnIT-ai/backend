const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { email, password, full_name, city, role, phone_number } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const cityResult = await pool.query('SELECT id FROM cities WHERE name = $1', [city]);
        if (cityResult.rows.length === 0) {
            return res.status(400).json({ message: 'Місто не знайдено' });
        }

        const cityId = cityResult.rows[0].id;

        const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
        if (roleResult.rows.length === 0) {
            return res.status(400).json({ message: 'Роль не знайдена' });
        }

        const roleId = roleResult.rows[0].id;

        const newUser = await pool.query(
            'INSERT INTO users (email, password, full_name, city_id, role_id, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [email, hashedPassword, full_name, cityId, roleId, phone_number]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user: newUser.rows[0], token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: error.message });
    }
};

// Вхід користувача
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Пошук користувача за email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        // Перевірка пароля
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        // Генерація токену
        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Отримуємо роль користувача
        const roleResult = await pool.query('SELECT name FROM roles WHERE id = $1', [user.rows[0].role_id]);
        const role = roleResult.rows[0].name;

        // Повертаємо токен та роль
        res.json({ token, role });

    } catch (error) {
        res.status(500).json({ error: 'Помилка при вході' });
    }
};

// Отримання профілю користувача
const getUserProfile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const city = await pool.query('SELECT * FROM cities WHERE id = $1', [user.rows[0].city_id]);
        const role = await pool.query('SELECT * FROM roles WHERE id = $1', [user.rows[0].role_id]);

        res.json({
            id: user.rows[0].id,
            email: user.rows[0].email,
            full_name: user.rows[0].full_name,
            city: city.rows[0]?.name,
            role: role.rows[0]?.name,
            phone_number: user.rows[0]?.phone_number,
        });
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };