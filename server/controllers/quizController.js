const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const filter = {};
    // If student, only show active quizzes
    if (req.user && req.user.role === 'student') {
      filter.status = 'active';
    }

    const quizzes = await Quiz.find(filter)
      .populate('questions', req.user && req.user.role === 'student' ? '-correctAnswer -explanation' : '')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const questionSelect = req.user && req.user.role === 'student' ? '-correctAnswer -explanation' : '';

    const quiz = await Quiz.findById(req.params.id).populate('questions', questionSelect);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const { title, description, category, questions, duration, status } = req.body;

    if (!title || !category || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, and select at least one question',
      });
    }

    const quiz = await Quiz.create({
      title,
      description: description || '',
      category,
      questions,
      duration: duration || 10,
      totalMarks: questions.length,
      status: status || 'active',
    });

    const populatedQuiz = await Quiz.findById(quiz._id).populate('questions');

    res.status(201).json({ success: true, quiz: populatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  try {
    const { title, description, category, questions, duration, status } = req.body;

    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    quiz.title = title || quiz.title;
    if (description !== undefined) quiz.description = description;
    quiz.category = category || quiz.category;
    if (questions && Array.isArray(questions)) {
      quiz.questions = questions;
      quiz.totalMarks = questions.length;
    }
    if (duration) quiz.duration = duration;
    if (status) quiz.status = status;

    await quiz.save();
    const updatedQuiz = await Quiz.findById(quiz._id).populate('questions');

    res.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    await quiz.deleteOne();
    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
