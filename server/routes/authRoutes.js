const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllStudents,
} = require('../controllers/authController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/students', protect, authorizeAdmin, getAllStudents);

module.exports = router;
