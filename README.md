# 🎓 Online Quiz Application – Complete MERN Stack Project

A modern, robust, and fully functional **Online Quiz Application** designed and implemented for a B.Tech Computer Science / Information Technology capstone project and faculty viva examination demonstration.

Developed using the complete **MERN Stack** (MongoDB, Express.js, React.js, Node.js), this application enables educational institutions and instructors to build question banks, bundle quizzes, monitor candidate attempts, and provide students with a distraction-free, one-by-one test interface with real-time feedback and server-side grade calculation.

---

## 🌟 Key Features

### 👤 Student Capabilities
- **Registration & Authentication**: Secure sign-up and login with JWT token authentication and bcrypt password hashing.
- **Interactive Student Dashboard**: View active quizzes, category badges, max marks, duration, and test status.
- **One-by-One Question Interface**:
  - Displays questions sequentially with 4 multiple-choice options.
  - Interactive Question Palette jump grid to switch between questions quickly.
  - Next / Previous question controls with live answered count and progress bar.
  - Integrated countdown timer with automatic submission on expiration.
- **Anti-Cheat & Answer Protection**: Correct answers are **never** exposed in student-facing APIs; evaluation takes place strictly on the backend.
- **Immediate Result & Analysis**:
  - Automatically calculates total score, percentage, correct answers, and incorrect answers.
  - Color-coded question breakdown comparing student's selection against the correct option.
  - Displays instructor solution explanations.
- **Attempt History**: Dedicated "My Results" ledger to track all previous submissions.
- **Single Attempt Lockout**: Automatically prevents duplicate submissions on completed assessments.

### 🛡️ Faculty / Administrator Capabilities
- **Faculty Dashboard & Analytics**: High-level statistical cards showing total questions, live quizzes, registered students, and student submissions.
- **Question Bank Management**:
  - Add new multiple-choice questions with 4 options, difficulty, category, and explanation.
  - Edit existing questions.
  - Delete obsolete questions.
- **Quiz Bundling & Publishing**:
  - Assemble quizzes by picking questions directly from the question bank.
  - Define custom time durations (minutes), titles, and descriptions.
  - Toggle quiz status between `active` (visible to students) and `inactive` (draft).
- **Submissions Ledger**: Review all student quiz attempts, candidate emails, scores, and timestamps.
- **Student Directory**: View all registered student accounts.
- **Role-Based Protected Routes**: Strict client and server middleware barriers prevent unauthorized privilege escalation.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, React Router v6 | Single Page Application (SPA) architecture & navigation |
| **HTTP Client** | Axios | REST API communication with automated Bearer Token interceptor |
| **Styling** | Vanilla CSS3 (Custom Design System) | Modern responsive UI, CSS variables, Google Fonts (Plus Jakarta Sans) |
| **Backend** | Node.js, Express.js | Modular RESTful API server & request controllers |
| **Database** | MongoDB & Mongoose | Flexible document storage with schema models and relationships |
| **Security** | JWT & bcryptjs | Stateless authorization and salted password hashing |

---

## 📂 Project Structure

```text
online-quiz-application/
├── client/                     # Frontend React SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Media and static assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # Global React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Routed view pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminQuestions.jsx
│   │   │   ├── AdminQuizzes.jsx
│   │   │   ├── AdminResults.jsx
│   │   │   ├── AdminStudents.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyResults.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   ├── QuizTaking.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios configuration with auth interceptor
│   │   ├── App.jsx             # Route definitions & guards
│   │   ├── index.css           # Global modern CSS styling & tokens
│   │   └── main.jsx            # React root entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Vite config with backend proxy setup
│
├── server/                     # Backend Node.js & Express API
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, student list
│   │   ├── questionController.js # CRUD for question bank
│   │   ├── quizController.js   # CRUD for quizzes
│   │   └── resultController.js # Quiz submission & grading engine
│   ├── middleware/
│   │   └── auth.js             # JWT verification and Admin role guards
│   ├── models/
│   │   ├── Question.js         # Question schema
│   │   ├── Quiz.js             # Quiz schema
│   │   ├── Result.js           # Result schema
│   │   └── User.js             # User schema with bcrypt hook
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── quizRoutes.js
│   │   └── resultRoutes.js
│   ├── .env                    # Local environment variables
│   ├── .env.example            # Environment template
│   ├── package.json
│   ├── seed.js                 # Sample database seeder
│   ├── server.js               # Express application entry point
│   └── test_runner.js          # Automated in-memory integration test suite
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18 or higher installed on your computer.
- **npm**: v9 or higher.
- **MongoDB**: A running local MongoDB Community Server (default `mongodb://127.0.0.1:27017/online_quiz_db`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI string.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/goutham2442-star/online-quiz-application.git
cd online-quiz-application
```

---

### Step 2: Backend Setup
1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```

2. Review or create the `.env` file in `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/online_quiz_db
   JWT_SECRET=super_secret_jwt_key_quiz_app_2026
   JWT_EXPIRE=7d
   ```
   *(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/online_quiz_db?retryWrites=true&w=majority`)*

3. **Seed Initial Demo Data (Questions, Quizzes, Accounts)**:
   ```bash
   npm run seed
   ```
   *This seeds sample Web Development & Computer Science questions, two quizzes, and pre-configured accounts.*

4. **Start the Backend Server**:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend API runs at `http://localhost:5000`.

---

### Step 3: Frontend Setup
1. Open a second terminal window and navigate to the `client/` directory:
   ```bash
   cd client
   npm install
   ```

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The web portal will open at `http://localhost:3000`.

---

## 🔑 Default Demonstration Credentials

For faculty viva or live demonstrations, pre-configured accounts are provided (available directly via one-click buttons on the Login page):

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Administrator / Faculty** | `admin@quiz.com` | `adminpassword123` | Full dashboard, Question Bank CRUD, Quiz Builder, Student Submissions |
| **Student** | `student@quiz.com` | `studentpassword123` | Student Dashboard, Attend Quizzes, View Instant Results, History |

*New students or faculty accounts can also be created anytime using the Register page.*

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student or faculty account.
- `POST /api/auth/login` - Authenticate credentials and receive JWT token.
- `GET /api/auth/me` - Retrieve current user profile *(Private)*.
- `GET /api/auth/students` - Retrieve list of all registered students *(Admin Only)*.

### 2. Question Bank (`/api/questions`)
- `GET /api/questions` - List all questions *(Protected - correct answers hidden from students)*.
- `GET /api/questions/:id` - Fetch single question *(Protected)*.
- `POST /api/questions` - Create question with 4 options & correct answer *(Admin Only)*.
- `PUT /api/questions/:id` - Modify question details *(Admin Only)*.
- `DELETE /api/questions/:id` - Remove question *(Admin Only)*.

### 3. Quizzes (`/api/quizzes`)
- `GET /api/quizzes` - List available quizzes *(Active only for students)*.
- `GET /api/quizzes/:id` - Fetch quiz questions and time limit.
- `POST /api/quizzes` - Create assessment from question bank *(Admin Only)*.
- `PUT /api/quizzes/:id` - Update title, questions, or duration *(Admin Only)*.
- `DELETE /api/quizzes/:id` - Delete quiz *(Admin Only)*.

### 4. Submissions & Results (`/api/results`)
- `POST /api/results/submit` - Securely submit answers, compute score, and record attempt.
- `GET /api/results/my-results` - Retrieve logged-in student's completed attempts.
- `GET /api/results` - Retrieve all student submissions *(Admin Only)*.
- `GET /api/results/:id` - Detailed result breakdown with question-by-question review.

---

## 🧪 Automated Testing & Verification

The project includes an automated end-to-end integration test runner powered by an in-memory MongoDB engine (`mongodb-memory-server`) and `supertest`:

To run the verification test:
```bash
cd server
node test_runner.js
```

### Verified Test Cases:
1. `POST /api/auth/register` (Admin creation)
2. `POST /api/auth/register` (Student creation)
3. `POST /api/auth/login` (JWT token issuance)
4. `POST /api/questions` (Protected question bank creation)
5. `GET /api/questions` (Security validation: correct answers stripped for students)
6. `POST /api/quizzes` (Quiz assembly with bundled questions)
7. `POST /api/results/submit` (Server-side score calculation and grading accuracy)
8. Duplicate attempt rejection (Enforcing single-attempt policy)
9. `GET /api/results/my-results` (Student score history)
10. `GET /api/results` & `GET /api/auth/students` (Admin audit trail)

---

## 📸 Screenshots (Placeholders)

- **Landing Page**: Modern hero section highlighting examination features.
  `[Screenshot: Landing Page]`
- **Student Dashboard**: Grid view of active quizzes with duration and question counts.
  `[Screenshot: Student Dashboard]`
- **Interactive Quiz Interface**: Question palette, countdown timer, one-by-one question view.
  `[Screenshot: Quiz Taking View]`
- **Evaluation & Result Summary**: Performance metrics, percentage, correct/incorrect badges, explanations.
  `[Screenshot: Quiz Result Analysis]`
- **Admin Dashboard**: Overview metrics, question creation modal, quiz builder checklist.
  `[Screenshot: Faculty Admin Dashboard]`

---

## 👨‍💻 Author & Submission Details

- **Project**: Online Quiz Application (MERN Stack)
- **Course**: B.Tech Computer Science & Engineering
- **GitHub Profile**: [goutham2442-star](https://github.com/goutham2442-star)
- **Suggested Repository Name**: `online-quiz-application`
