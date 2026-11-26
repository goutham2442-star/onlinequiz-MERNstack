const Question = require('../models/Question');

// @desc    Get all questions (with optional category & difficulty filtering)
// @route   GET /api/questions
// @access  Private (Admins see correctAnswer, students only see question and options)
const getQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    let query = Question.find(filter).sort({ createdAt: -1 });

    // If logged in user is student, strip correct answers and explanation
    if (req.user && req.user.role === 'student') {
      query = query.select('-correctAnswer -explanation');
    }

    const questions = await query;
    res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
const getQuestionById = async (req, res) => {
  try {
    let query = Question.findById(req.params.id);
    if (req.user && req.user.role === 'student') {
      query = query.select('-correctAnswer -explanation');
    }
    const question = await query;
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, category, difficulty, explanation } = req.body;

    if (!questionText || !options || !correctAnswer || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide questionText, 4 options, correctAnswer, and category',
      });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 4 options are required',
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: 'The correct answer must be one of the 4 provided options',
      });
    }

    const question = await Question.create({
      questionText,
      options,
      correctAnswer,
      category,
      difficulty: difficulty || 'Medium',
      explanation: explanation || '',
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, category, difficulty, explanation } = req.body;

    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (options && (!Array.isArray(options) || options.length !== 4)) {
      return res.status(400).json({ success: false, message: 'Exactly 4 options are required' });
    }

    const effectiveOptions = options || question.options;
    const effectiveCorrect = correctAnswer || question.correctAnswer;

    if (!effectiveOptions.includes(effectiveCorrect)) {
      return res.status(400).json({
        success: false,
        message: 'The correct answer must match one of the 4 options',
      });
    }

    question.questionText = questionText || question.questionText;
    question.options = effectiveOptions;
    question.correctAnswer = effectiveCorrect;
    question.category = category || question.category;
    question.difficulty = difficulty || question.difficulty;
    if (explanation !== undefined) question.explanation = explanation;

    await question.save();

    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    await question.deleteOne();
    res.json({ success: true, message: 'Question removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
