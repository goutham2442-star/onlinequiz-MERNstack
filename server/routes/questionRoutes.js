const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.route('/')
  .get(protect, getQuestions)
  .post(protect, authorizeAdmin, createQuestion);

router.route('/:id')
  .get(protect, getQuestionById)
  .put(protect, authorizeAdmin, updateQuestion)
  .delete(protect, authorizeAdmin, deleteQuestion);

module.exports = router;
