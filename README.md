# NoteNest

**NoteNest** is a full-stack note-taking application that allows users to register, log in, and manage their personal notes. Built with a React/Vite frontend, Express.js backend, and PostgreSQL database, NoteNest offers a clean, responsive UI and secure, persisting storage for notes tied to individual user accounts.


## ⚙️ Tech Stack

* **Frontend:** React 18 (Vite) + React Router + Axios
* **Backend:** Node.js, Express.js, Passport.js (local strategy)
* **Database:** PostgreSQL
* **Authentication:** Session-based with bcrypt hashing
* **Styling:** CSS with CSS variables, responsive grid layout

---

## 🚀 Features

* **User Authentication** (Register/Login) with secure password hashing
* **Session Management** via `express-session`
* **CRUD Notes**: Create, Read, Delete notes
* **User-specific Data**: Each user sees only their own notes
* **Responsive Design**: Grid layout for notes, sidebar form
* **Validation**: Prevent adding empty notes

---

## 📋 Prerequisites

* Node.js (v18+)
* npm
* PostgreSQL database running locally or remotely

---

## 🔧 Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd NoteNest/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables** in `.env`:

   ```ini
   PG_USER=your_pg_username
   PG_HOST=localhost
   PG_DATABASE=notenest
   PG_PASSWORD=your_pg_password
   PG_PORT=5432
   ```

4. **Initialize database schema** (in `psql` or pgAdmin):

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     
   );

   CREATE TABLE notes (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     title TEXT,
     content TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ````

5. **Start the backend server:**

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:5000/`.

---

## 🖥️ Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd NoteNest/my-react-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173/`.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | `/auth/register` | Register new user               |
| POST   | `/auth/login`    | Log in (creates session cookie) |

### Notes

> **Protected**: requires session cookie (`withCredentials: true`)

| Method | Endpoint     | Description                  |
| ------ | ------------ | ---------------------------- |
| GET    | `/notes`     | Fetch all notes for the user |
| POST   | `/notes`     | Create a new note            |
| DELETE | `/notes/:id` | Delete a note by its ID      |

---

## 🛡️ Authentication Flow

1. **Register:** `POST /auth/register` with `{ email, password }` → stores hashed password
2. **Login:** `POST /auth/login` with `{ username: email, password }` → Passport local strategy validates
3. **Session:** `express-session` issues a cookie, stored in browser
4. **Protected Routes:** `/notes` routes check `req.isAuthenticated()` before proceeding

---

## 🎨 Styling & Customization

* **Global styles** include CSS variables for theme, grid layout for notes, and sidebar styling.
* **Component styles** applied via class names in each JSX file.

---

## 🚀 Running Both Services

In separate terminals:

```bash
# Terminal 1: Backend
cd NoteNest/backend
npm start

# Terminal 2: Frontend
cd NoteNest/my-react-app
npm run dev
```

---

## 🎯 Future Enhancements

* Add **Edit** and **Update** note functionality
* Integrate **Google OAuth** or other social logins
* Add **tags** and **search** for notes
* Unit and integration **tests** (Jest, React Testing Library)
