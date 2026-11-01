# NoteSpace — Full-Stack Note Taking Web Application

> **Tagline:** *"Your Thoughts. Organized Beautifully."*  
> **Architecture:** MVC (Model-View-Controller)  
> **Stack:** React.js, Node.js, Express.js, MongoDB, Mongoose, Tailwind CSS

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [What is Used and Why (Simple Guide)](#-what-is-used-and-why-simple-guide)
3. [MVC Architecture Explained](#-mvc-architecture-explained)
4. [User & Note Database Relationship](#-user--note-database-relationship)
5. [How Data Travels (End-to-End Flow)](#-how-data-travels-end-to-end-flow)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Step-by-Step Setup & Run Guide](#-step-by-step-setup--run-guide)
8. [Automated Testing & Security Checks](#-automated-testing--security-checks)

---

## 🚀 Project Overview

**NoteSpace** is a full-stack note-taking web application built as a college-level engineering project following software design practices.

### Core Features:
- **User Authentication:** Secure registration, login, and logout.
- **Password Security:** Passwords hashed with `bcryptjs` (salt rounds: 12) before saving to MongoDB.
- **JWT Protection:** Authenticated routes guarded by JWT Bearer tokens.
- **Full CRUD Operations:** Create, Read all, Read by ID, Update, and Delete notes.
- **Strict Data Isolation:** Each user sees and modifies **only their own notes**. Trying to access another user's note returns `403 Forbidden`.
- **Search & Filter:** Instant dynamic search by note title or content.
- **Modern UI/UX:** SaaS-style interface inspired by Notion & Linear with subtle animations and toast alerts.

---

## 🔍 What is Used and Why (Simple Guide)

This section explains every tool, library, and package in plain English so you can explain it to your professor or interviewer.

### 🎨 Frontend Technologies

| Technology / Package | What is it? | Why did we use it? |
|---|---|---|
| **React.js (v18)** | Frontend UI Library | Lets us build reusable UI components (cards, modals, navbars) and update the screen instantly when state changes without refreshing the page. |
| **Vite** | Build Tool & Dev Server | Replaces old Create-React-App. Starts in milliseconds and bundles the frontend super fast using native ES modules. |
| **React Router DOM** | Client-Side Routing | Allows multi-page navigation (`/`, `/login`, `/register`, `/dashboard`, `/dashboard/notes/:id`) without reloading the entire browser window. |
| **Tailwind CSS** | Utility-First CSS Framework | Allows styling components directly in JSX using utility classes (e.g. `bg-primary`, `rounded-2xl`, `shadow-card`), keeping the design clean and consistent. |
| **Axios** | HTTP Client | Used instead of plain `fetch` because it supports **interceptors**. Our Axios interceptor automatically attaches the `Authorization: Bearer <token>` header to every API request and redirects to login if the token expires. |
| **Framer Motion** | Animation Library | Creates smooth slide-in animations for note cards, fade-ins for pages, and smooth modal popups to give the app a polished SaaS feel. |
| **Lucide React** | Icon Pack | Provides clean SVG icons (FileText, Search, Trash, Edit, Lock, Mail, Clock) that fit modern minimalist design. |
| **React Hot Toast** | Notification System | Displays floating popup toast alerts ("Note created!", "Logged out successfully") without blocking the user. |

---

### ⚙️ Backend Technologies

| Technology / Package | What is it? | Why did we use it? |
|---|---|---|
| **Node.js** | JavaScript Server Runtime | Executes JavaScript on the backend server, allowing unified full-stack JavaScript. |
| **Express.js** | Web Framework | Simplifies routing, HTTP request handling, middleware pipelines, and REST API creation. |
| **MongoDB** | NoSQL Database | Stores data as flexible JSON-like BSON documents. Perfect for storing users and notes without complex table migrations. |
| **Mongoose** | MongoDB ODM (Object Data Modeling) | Enforces schema validation, required fields, relationships (ObjectId references), and lifecycle hooks (like hashing passwords before saving). |
| **bcryptjs** | Password Hashing Library | Uses a one-way mathematical hashing algorithm with 12 salt rounds. We never save plain text passwords in the database. Even if the DB is leaked, passwords cannot be reversed. |
| **jsonwebtoken (JWT)** | Token-based Auth | Generates signed, tamper-proof tokens containing the user's ID and role. The frontend stores this token and sends it in the `Authorization` header to prove identity without the server having to store session files. |
| **express-validator** | Input Validation Middleware | Validates that incoming request data meets rules (e.g., valid email format, password at least 6 characters, title not empty) before any database query runs. |
| **express-rate-limit** | Brute-Force Rate Limiting | Limits how many login/register attempts an IP address can make in a given timeframe to prevent automated password guessing. |
| **cors** | Cross-Origin Resource Sharing | Security middleware that controls which frontend URLs (e.g., `http://localhost:5173`) are permitted to send HTTP requests to the backend (`http://localhost:5000`). |
| **dotenv** | Environment Variable Loader | Loads confidential secrets (`JWT_SECRET`, `MONGO_URI`, `PORT`) from a private `.env` file into `process.env` so they are never hardcoded into source code. |
| **morgan** | Request Logger | Prints incoming HTTP requests (`GET /api/notes 200 4.2ms`) to the console, making debugging easy. |

---

## 🏛 MVC Architecture Explained

The backend strictly separates concerns into **Model**, **View**, and **Controller**:

```
[ BROWSER / USER ]
       │
       ▼
  [ VIEW ]  ──────────────── React.js Frontend (Components & Pages)
       │
       │ HTTP Request + JWT
       ▼
 [ CONTROLLER ]  ─────────── Express Routes & Controllers (userController, noteController)
       │                     - Validates inputs
       │                     - Checks authentication & ownership
       │                     - Processes business logic
       ▼
  [ MODEL ]  ─────────────── Mongoose Schemas (User.js, Note.js)
       │                     - Defines document shapes & constraints
       │                     - Communicates directly with MongoDB
       ▼
[ DATABASE ] ─────────────── MongoDB Collections ("users", "notes")
```

- **Model (`backend/models/`):**
  - [`User.js`](file:///Users/aprajitamishra/Documents/notes-app/backend/models/User.js): Schema for users (name, email, password, role). Contains pre-save hook to hash password.
  - [`Note.js`](file:///Users/aprajitamishra/Documents/notes-app/backend/models/Note.js): Schema for notes (title, content, user ObjectId reference).
- **Controller (`backend/controllers/`):**
  - [`userController.js`](file:///Users/aprajitamishra/Documents/notes-app/backend/controllers/userController.js): Handles user registration, login, logout, and profile fetching.
  - [`noteController.js`](file:///Users/aprajitamishra/Documents/notes-app/backend/controllers/noteController.js): Handles note CRUD logic and enforces ownership checks.
- **View (`frontend/src/`):**
  - React components and pages that show data to the user and accept interactions.

---

## 🔗 User & Note Database Relationship

The application implements a **One-to-Many** relationship:
- **One User** can create **many Notes**.
- **Each Note** belongs to **exactly one User**.

### In the Note Schema:
```javascript
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

### 🔒 Ownership Security Rule:
The backend **never trusts a user ID sent in the request body**.
1. When creating a note, the user ID is extracted from the verified JWT:
   ```javascript
   note = await Note.create({ title, content, user: req.user._id });
   ```
2. When reading, updating, or deleting a note by its ID, the controller verifies:
   ```javascript
   if (note.user.toString() !== req.user._id.toString()) {
     return res.status(403).json({ message: "You are not authorized to access this note." });
   }
   ```
This ensures an ordinary user **can never read, edit, or delete another user's note by changing the ID in the URL**.

---

## 🔄 How Data Travels (End-to-End Flow)

Here is exactly what happens when a user clicks **"Save Note"**:

```
1. User types Title and Content in React modal and clicks "Save Note".
2. React runs frontend validation (checks length and non-empty).
3. noteService.createNote() calls axios.post('/notes/create', { title, content }).
4. Axios Request Interceptor automatically injects:
   Authorization: Bearer eyJhbGciOi... (stored in localStorage).
5. Request arrives at Express server on port 5000.
6. authMiddleware reads header, calls jwt.verify(token, JWT_SECRET).
7. authMiddleware finds the user in MongoDB and attaches it: req.user = user.
8. noteRoutes runs express-validator rules on title and content.
9. noteController.createNote takes req.body and creates Note with user = req.user._id.
10. Note is saved into MongoDB's "notes" collection.
11. Server responds with HTTP 201 Created and the new note JSON.
12. React receives note, adds it to the state array, and displays a toast: "Note created!".
13. Dashboard instantly renders the new card on the screen.
```

---

## 📡 API Endpoints Reference

### 1. Authentication Endpoints

| Method | Endpoint | Description | Auth Required? |
|---|---|---|:---:|
| `POST` | `/api/users/register` | Register new account (hashes password with bcrypt) | No |
| `POST` | `/api/users/login` | Login user, verifies password, returns JWT token | No |
| `POST` | `/api/users/logout` | Client sign-out signal | Yes |
| `GET` | `/api/users/me` | Fetch currently logged-in user profile | Yes |
| `GET` | `/api/users/admin/all` | Admin-only route: returns all users | Yes (Admin) |

*(Also aliased under `/api/auth/*`)*

### 2. Note Endpoints (All Protected with JWT)

| Method | Master Route | REST Alias | Description |
|---|---|---|---|
| `POST` | `/api/notes/create` | `/api/notes` | Create a new note for logged-in user |
| `GET` | `/api/notes/read` | `/api/notes` | Get all notes belonging to logged-in user (supports `?search=`) |
| `GET` | `/api/notes/read/:id` | `/api/notes/:id` | Get single note by ID (with ownership check) |
| `PUT` | `/api/notes/update/:id` | `/api/notes/:id` | Update note title and/or content (with ownership check) |
| `DELETE`| `/api/notes/delete/:id` | `/api/notes/:id` | Delete note (with ownership check) |

---

## 💻 Step-by-Step Setup & Run Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or MongoDB Atlas cloud URI)

---

### Step 1: Open Project Directory
```bash
cd /Users/aprajitamishra/Documents/notes-app
```

---

### Step 2: Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notespace
JWT_SECRET=notespace_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

---

### Step 3: Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend starts at:* `http://localhost:5000`  
*Health Check URL:* `http://localhost:5000/api/health`

---

### Step 4: Run the Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend opens at:* `http://localhost:5173`

---

## 🧪 Automated Testing & Security Checks

To run the complete 18-test end-to-end integration and security test suite:

```bash
cd backend
node test-suite.js
```

### What the test suite verifies:
1. Server health check and active MongoDB connection.
2. CORS preflight resolution from `http://127.0.0.1:5173`.
3. User registration and default role assignment (`user`).
4. Duplicate email rejection (`409 Conflict`).
5. Password hashing and rejection of incorrect passwords (`401 Unauthorized`).
6. Successful login and verification that password hash is **never leaked** in response.
7. Data isolation between users: User B sees 0 notes when User A has notes.
8. **Ownership protection:** User B attempting to GET, PUT, or DELETE User A's note receives `403 Forbidden`.
9. Full and partial note updates.
10. Role-based authorization: standard user denied access to admin route (`403`), while admin succeeds (`200`).
11. Note deletion and verification of subsequent `404 Not Found`.

---

## 📂 Project File Structure

```text
notes-app/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection with IPv4 prioritization
│   ├── models/
│   │   ├── User.js                # User Mongoose model + bcrypt pre-save hook
│   │   └── Note.js                # Note Mongoose model + ObjectId ref to User
│   ├── controllers/
│   │   ├── userController.js      # Auth & profile business logic
│   │   └── noteController.js      # Note CRUD logic + ownership checks
│   ├── routes/
│   │   ├── userRoutes.js          # Auth routes + express-validator rules
│   │   └── noteRoutes.js          # Protected note routes + standard REST aliases
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT extraction & verification
│   │   └── roleMiddleware.js      # Role-based restriction (user / admin)
│   ├── test-suite.js              # 18 automated integration & security tests
│   ├── .env                       # Backend secrets (MONGO_URI, JWT_SECRET)
│   ├── .env.example               # Template for environment variables
│   ├── server.js                  # Express entry point, CORS & health status
│   └── package.json
│
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── assets/                # Images & illustrations
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.jsx         # Landing page navigation
│   │   │   ├── Sidebar.jsx        # Dashboard collapsible sidebar
│   │   │   ├── NoteCard.jsx       # Note display card with actions
│   │   │   ├── NoteModal.jsx      # Create & Edit note modal with counter
│   │   │   ├── SearchBar.jsx      # Instant title/content search input
│   │   │   ├── Loading.jsx        # Reusable spinner & skeleton
│   │   │   └── ProtectedRoute.jsx # Route guard redirecting unauthenticated users
│   │   ├── pages/                 # Full application views
│   │   │   ├── Landing.jsx        # Public hero, preview, and features
│   │   │   ├── Login.jsx          # Login view with show/hide password
│   │   │   ├── Register.jsx       # Register view with live strength meter
│   │   │   ├── Dashboard.jsx      # Main dashboard with stats & note grid
│   │   │   ├── AllNotes.jsx       # Complete notes collection view
│   │   │   ├── NoteDetails.jsx    # Single note inspection & full reading view
│   │   │   ├── RecentNotes.jsx    # Filtered view for 7-day recent notes
│   │   │   └── Profile.jsx        # User account info & logout
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global authentication state (React Context)
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Custom hook for easy AuthContext access
│   │   ├── services/
│   │   │   ├── api.js             # Centralized Axios with Bearer interceptor
│   │   │   ├── authService.js     # User authentication API calls
│   │   │   └── noteService.js     # Note CRUD API calls
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx# Shell layout with top nav & sidebar
│   │   ├── App.jsx                # Router setup & toast provider
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind directives & custom classes
│   ├── .env                       # Frontend config (VITE_API_URL)
│   ├── .env.example
│   ├── vite.config.js             # Vite configuration with API proxy
│   ├── tailwind.config.js         # Custom color palette & typography
│   └── package.json
│
└── README.md                      # Complete project documentation
```

---

*NoteSpace — Your Thoughts. Organized Beautifully.*
# notes-app
