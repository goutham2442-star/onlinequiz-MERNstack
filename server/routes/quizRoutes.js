const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, authorizeAdmin, createQuiz);

router.route('/:id')
  .get(protect, getQuizById)
  .put(protect, authorizeAdmin, updateQuiz)
  .delete(protect, authorizeAdmin, deleteQuiz);

module.exports = router;
