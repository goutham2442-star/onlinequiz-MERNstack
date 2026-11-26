const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');
const Result = require('./models/Result');

dotenv.config();

const sampleQuestions = [
  // Web Development
  {
    questionText: 'Which HTML5 element is used to specify a header for a document or section?',
    options: ['<header>', '<top>', '<section-header>', '<head>'],
    correctAnswer: '<header>',
    category: 'Web Development',
    difficulty: 'Easy',
    explanation: 'The <header> element in HTML5 represents introductory content, typically a group of introductory or navigational aids.',
  },
  {
    questionText: 'What does CSS stand for?',
    options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
    correctAnswer: 'Cascading Style Sheets',
    category: 'Web Development',
    difficulty: 'Easy',
    explanation: 'CSS stands for Cascading Style Sheets and defines how HTML elements are to be displayed on screen.',
  },
  {
    questionText: 'Which React hook is used to manage side effects such as data fetching or subscriptions?',
    options: ['useEffect', 'useState', 'useReducer', 'useMemo'],
    correctAnswer: 'useEffect',
    category: 'Web Development',
    difficulty: 'Medium',
    explanation: 'useEffect lets you perform side effects in functional components like fetching data, timers, and DOM mutations.',
  },
  {
    questionText: 'In Node.js / Express, what middleware is standardly used to parse incoming JSON payloads?',
    options: ['express.json()', 'express.bodyParserXml()', 'express.static()', 'express.router()'],
    correctAnswer: 'express.json()',
    category: 'Web Development',
    difficulty: 'Easy',
    explanation: 'express.json() is a built-in middleware function in Express that parses incoming requests with JSON payloads.',
  },
  {
    questionText: 'In MongoDB, what type of database model is used?',
    options: ['Document-oriented (NoSQL)', 'Relational (RDBMS)', 'Graph only', 'Key-value flat files only'],
    correctAnswer: 'Document-oriented (NoSQL)',
    category: 'Web Development',
    difficulty: 'Easy',
    explanation: 'MongoDB stores data in flexible, JSON-like documents called BSON, making it a document-oriented NoSQL database.',
  },

  // Python & Data Structures
  {
    questionText: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?',
    options: ['O(log n)', 'O(n)', 'O(1)', 'O(n^2)'],
    correctAnswer: 'O(log n)',
    category: 'Data Structures',
    difficulty: 'Medium',
    explanation: 'In a balanced BST, each comparison halves the search space, giving an average and worst-case search complexity of O(log n).',
  },
  {
    questionText: 'Which data structure follows the LIFO (Last In First Out) principle?',
    options: ['Stack', 'Queue', 'Array', 'Linked List'],
    correctAnswer: 'Stack',
    category: 'Data Structures',
    difficulty: 'Easy',
    explanation: 'A Stack is a linear data structure following LIFO: elements are added and removed from the top.',
  },
  {
    questionText: 'Which of the following is an immutable data type in Python?',
    options: ['Tuple', 'List', 'Dictionary', 'Set'],
    correctAnswer: 'Tuple',
    category: 'Programming',
    difficulty: 'Easy',
    explanation: 'Tuples in Python cannot be modified after creation, making them immutable.',
  },
  {
    questionText: 'Which HTTP status code signifies "Unauthorized" access?',
    options: ['401', '403', '404', '500'],
    correctAnswer: '401',
    category: 'Computer Networks',
    difficulty: 'Easy',
    explanation: 'HTTP 401 Unauthorized indicates that the client request has not been completed because it lacks valid authentication credentials.',
  },
  {
    questionText: 'In SQL, which command is used to remove a table and its structure permanently?',
    options: ['DROP TABLE', 'DELETE TABLE', 'TRUNCATE TABLE', 'REMOVE TABLE'],
    correctAnswer: 'DROP TABLE',
    category: 'Database Systems',
    difficulty: 'Easy',
    explanation: 'DROP TABLE removes the entire table definition along with all rows, indexes, and triggers.',
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online_quiz_db');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing records
    await User.deleteMany();
    await Question.deleteMany();
    await Quiz.deleteMany();
    await Result.deleteMany();

    console.log('Cleared existing collections.');

    // Create Admin and Student users
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@quiz.com',
      password: 'adminpassword123',
      role: 'admin',
    });

    const studentUser = await User.create({
      name: 'Rahul Sharma',
      email: 'student@quiz.com',
      password: 'studentpassword123',
      role: 'student',
    });

    console.log(`Created users: Admin (${adminUser.email}), Student (${studentUser.email})`);

    // Insert sample questions
    const createdQuestions = await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${createdQuestions.length} sample questions.`);

    // Group questions for Web Dev Quiz
    const webDevQuestionIds = createdQuestions
      .filter((q) => q.category === 'Web Development')
      .map((q) => q._id);

    // Group questions for General CS Quiz
    const csQuestionIds = createdQuestions
      .filter((q) => q.category !== 'Web Development')
      .map((q) => q._id);

    // Create Quizzes
    const quiz1 = await Quiz.create({
      title: 'Full Stack MERN & Web Tech Quiz',
      description: 'Test your understanding of core HTML5, CSS3, React hooks, Node.js and MongoDB.',
      category: 'Web Development',
      questions: webDevQuestionIds,
      duration: 10,
      totalMarks: webDevQuestionIds.length,
      status: 'active',
    });

    const quiz2 = await Quiz.create({
      title: 'Computer Science Fundamentals',
      description: 'Test your grasp on Data Structures, Python immutability, networking codes and SQL.',
      category: 'Computer Science',
      questions: csQuestionIds,
      duration: 10,
      totalMarks: csQuestionIds.length,
      status: 'active',
    });

    console.log(`Created 2 quizzes: "${quiz1.title}" and "${quiz2.title}"`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
