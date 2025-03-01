const express = require("express");

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");

const checkRole = require("../middleware/checkRole");
const verifyToken = require("../middleware/verifyToken");
const { checkAuth } = require("../middleware/checkAuth");
const router = express.Router();

// Маршрут реєстрації
router.post("/register", registerUser);

// Маршрут входу
router.post("/login", loginUser);

// Маршрут для отримання профілю
router.get("/profile", getUserProfile);

// Маршрути для різних ролей
router.get("/admin-dashboard", verifyToken, checkRole("admin"), (req, res) => {
  // Якщо роль користувача admin
  const role = req.user.role; // отримаємо роль з токену
  if (role === "admin") {
    // Відправити на функціонал адміністратора
    return res.json({ message: "Admin dashboard content" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});

router.get(
  "/student-dashboard",
  verifyToken,
  checkRole("student"),
  (req, res) => {
    const role = req.user.role;
    if (role === "student") {
      return res.json({ message: "Student dashboard content" });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  }
);

router.get(
  "/lecturer-dashboard",
  verifyToken,
  checkRole("lecturer"),
  (req, res) => {
    const role = req.user.role;
    if (role === "lecturer") {
      return res.json({ message: "Lecturer dashboard content" });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  }
);

//

module.exports = router;
