const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cors = require('cors');

// Create test app instance
function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/questions', require('./routes/questionRoutes'));
  app.use('/api/quizzes', require('./routes/quizRoutes'));
  app.use('/api/results', require('./routes/resultRoutes'));

  return app;
}

async function runTestSuite() {
  console.log('🚀 Starting Automated Full-Stack Backend Integration Test...');
  let mongod;

  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✓ In-memory MongoDB instance started and connected.');

    const request = require('supertest');
    const app = createTestApp();

    // 1. Test Admin Registration
    console.log('\n--- 1. Testing Admin Registration ---');
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Prof. Sharma',
        email: 'prof.sharma@college.edu',
        password: 'facultysecret123',
        role: 'admin',
      });
    console.log('Admin Register Status:', adminRes.status, 'Role:', adminRes.body.user?.role);
    if (adminRes.status !== 201 || adminRes.body.user?.role !== 'admin') {
      throw new Error('Admin registration failed');
    }
    const adminToken = adminRes.body.token;

    // 2. Test Student Registration
    console.log('\n--- 2. Testing Student Registration ---');
    const studentRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Aarav Patel',
        email: 'aarav@student.edu',
        password: 'studentsecret123',
        role: 'student',
      });
    console.log('Student Register Status:', studentRes.status, 'Role:', studentRes.body.user?.role);
    if (studentRes.status !== 201 || studentRes.body.user?.role !== 'student') {
      throw new Error('Student registration failed');
    }
    const studentToken = studentRes.body.token;

    // 3. Test Student Login
    console.log('\n--- 3. Testing Student Login ---');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'aarav@student.edu',
        password: 'studentsecret123',
      });
    console.log('Login Status:', loginRes.status, 'Token returned:', !!loginRes.body.token);
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error('Student login failed');
    }

    // 4. Test Question Creation by Admin
    console.log('\n--- 4. Testing Question Creation (Admin Protected) ---');
    const q1Res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        questionText: 'Which language runs in a web browser?',
        options: ['Java', 'C', 'Python', 'JavaScript'],
        correctAnswer: 'JavaScript',
        category: 'Web Development',
        difficulty: 'Easy',
        explanation: 'JavaScript is the standard programming language of the web.',
      });
    console.log('Create Q1 Status:', q1Res.status, 'Q1 ID:', q1Res.body.question?._id);
    if (q1Res.status !== 201) throw new Error('Question 1 creation failed');

    const q2Res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        questionText: 'What is the full form of CSS?',
        options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 'Cascading Style Sheets',
        category: 'Web Development',
        difficulty: 'Easy',
        explanation: 'CSS stands for Cascading Style Sheets.',
      });
    console.log('Create Q2 Status:', q2Res.status, 'Q2 ID:', q2Res.body.question?._id);
    if (q2Res.status !== 201) throw new Error('Question 2 creation failed');

    const q1Id = q1Res.body.question._id;
    const q2Id = q2Res.body.question._id;

    // 5. Verify Security: Student Fetch Questions does NOT expose correctAnswer
    console.log('\n--- 5. Testing Question Security for Students ---');
    const studentQuestionsRes = await request(app)
      .get('/api/questions')
      .set('Authorization', `Bearer ${studentToken}`);
    console.log('Student Questions Count:', studentQuestionsRes.body.questions?.length);
    const hasExposedAnswer = studentQuestionsRes.body.questions.some((q) => q.correctAnswer !== undefined);
    console.log('Are correct answers hidden from student?:', !hasExposedAnswer ? 'YES (Secure)' : 'NO (Vulnerable)');
    if (hasExposedAnswer) throw new Error('Security flaw: Correct answers leaked in question API!');

    // 6. Test Quiz Creation by Admin
    console.log('\n--- 6. Testing Quiz Creation ---');
    const quizRes = await request(app)
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Full Stack Frontend Basics',
        description: 'Testing HTML/CSS/JS fundamentals',
        category: 'Web Development',
        duration: 15,
        questions: [q1Id, q2Id],
      });
    console.log('Create Quiz Status:', quizRes.status, 'Quiz ID:', quizRes.body.quiz?._id);
    if (quizRes.status !== 201) throw new Error('Quiz creation failed');
    const quizId = quizRes.body.quiz._id;

    // 7. Test Student Taking and Submitting Quiz
    console.log('\n--- 7. Testing Quiz Submission & Automatic Grading ---');
    // Student picks 1 correct ('JavaScript') and 1 incorrect ('Creative Style Sheets')
    const submitRes = await request(app)
      .post('/api/results/submit')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        quizId,
        answers: [
          { questionId: q1Id, selectedOption: 'JavaScript' },
          { questionId: q2Id, selectedOption: 'Creative Style Sheets' },
        ],
        timeTakenSeconds: 45,
      });

    console.log('Submit Status:', submitRes.status);
    console.log('Result Calculated:');
    console.log(' - Score:', submitRes.body.result?.score, '/', submitRes.body.result?.totalQuestions);
    console.log(' - Correct Answers:', submitRes.body.result?.correctAnswers);
    console.log(' - Incorrect Answers:', submitRes.body.result?.incorrectAnswers);
    console.log(' - Percentage:', submitRes.body.result?.percentage + '%');

    if (
      submitRes.status !== 201 ||
      submitRes.body.result?.score !== 1 ||
      submitRes.body.result?.percentage !== 50
    ) {
      throw new Error('Score calculation mismatch!');
    }

    // 8. Test Multiple Attempt Prevention
    console.log('\n--- 8. Testing Repeated Attempt Prevention ---');
    const repeatRes = await request(app)
      .post('/api/results/submit')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        quizId,
        answers: [
          { questionId: q1Id, selectedOption: 'JavaScript' },
          { questionId: q2Id, selectedOption: 'Cascading Style Sheets' },
        ],
      });
    console.log('Repeat Attempt Status:', repeatRes.status, 'Message:', repeatRes.body.message);
    if (repeatRes.status !== 400) {
      throw new Error('Repeat submission was improperly allowed!');
    }

    // 9. Test Student Results History
    console.log('\n--- 9. Testing Student Result Retrieval ---');
    const myResultsRes = await request(app)
      .get('/api/results/my-results')
      .set('Authorization', `Bearer ${studentToken}`);
    console.log('My Results Count:', myResultsRes.body.results?.length);
    if (myResultsRes.status !== 200 || myResultsRes.body.results?.length !== 1) {
      throw new Error('Failed to retrieve student result history');
    }

    // 10. Test Admin Access to All Results & Students List
    console.log('\n--- 10. Testing Admin Submissions & Students List ---');
    const allResultsRes = await request(app)
      .get('/api/results')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('Admin All Submissions Count:', allResultsRes.body.results?.length);

    const studentsListRes = await request(app)
      .get('/api/auth/students')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('Admin Students List Count:', studentsListRes.body.students?.length);

    console.log('\n🎉 ALL 10 INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
    process.exit();
  }
}

runTestSuite();
