const express = require('express');
const router = express.Router();
const {
  submitQuiz,
  getMyResults,
  getAllResults,
  getResultById,
} = require('../controllers/resultController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.post('/submit', protect, submitQuiz);
router.get('/my-results', protect, getMyResults);
router.get('/', protect, authorizeAdmin, getAllResults);
router.get('/:id', protect, getResultById);

module.exports = router;
