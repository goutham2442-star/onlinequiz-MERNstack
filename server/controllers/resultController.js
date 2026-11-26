const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Submit a quiz and calculate results securely on server
// @route   POST /api/results/submit
// @access  Private (Student)
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTakenSeconds } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({ success: false, message: 'Quiz ID and answers are required' });
    }

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Check if student has already submitted this quiz
    const existingResult = await Result.findOne({ student: req.user._id, quiz: quizId });
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this quiz. Multiple attempts are not permitted.',
      });
    }

    let correctAnswersCount = 0;
    const evaluatedAnswers = [];

    // Map through questions in quiz to safely grade against real correct answer
    for (const q of quiz.questions) {
      const studentAnswerObj = answers.find(
        (ans) => ans.questionId.toString() === q._id.toString()
      );
      const selectedOption = studentAnswerObj ? studentAnswerObj.selectedOption : '';
      const isCorrect = selectedOption.trim() === q.correctAnswer.trim();

      if (isCorrect) {
        correctAnswersCount++;
      }

      evaluatedAnswers.push({
        question: q._id,
        selectedOption,
        isCorrect,
        correctOption: q.correctAnswer, // Returned so student can review their results
      });
    }

    const totalQuestions = quiz.questions.length;
    const incorrectAnswersCount = totalQuestions - correctAnswersCount;
    const score = correctAnswersCount; // 1 mark per question
    const percentage = totalQuestions > 0 ? parseFloat(((score / totalQuestions) * 100).toFixed(2)) : 0;

    const result = await Result.create({
      student: req.user._id,
      quiz: quizId,
      selectedAnswers: evaluatedAnswers,
      score,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: incorrectAnswersCount,
      percentage,
      timeTakenSeconds: timeTakenSeconds || 0,
    });

    const populatedResult = await Result.findById(result._id)
      .populate('quiz', 'title category duration totalMarks')
      .populate('student', 'name email')
      .populate({
        path: 'selectedAnswers.question',
        select: 'questionText options explanation category difficulty',
      });

    res.status(201).json({
      success: true,
      message: 'Quiz submitted and evaluated successfully',
      result: populatedResult,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in student's results
// @route   GET /api/results/my-results
// @access  Private (Student)
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('quiz', 'title category duration totalMarks')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all results (Admin)
// @route   GET /api/results
// @access  Private/Admin
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email')
      .populate('quiz', 'title category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single result details by ID
// @route   GET /api/results/:id
// @access  Private (Owner student or Admin)
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', 'name email')
      .populate('quiz', 'title category duration totalMarks')
      .populate({
        path: 'selectedAnswers.question',
        select: 'questionText options explanation category difficulty',
      });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    // Verify authorization: Student can only view their own result, admin can view all
    if (
      req.user.role !== 'admin' &&
      result.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this result' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitQuiz,
  getMyResults,
  getAllResults,
  getResultById,
};
