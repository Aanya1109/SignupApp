# SignupApp – Sign Up and Login (React + Express + MongoDB)

## 1. Project overview

SignupApp lets a person create an account (Sign Up) and then log in. The React page sends the email and password to an Express server using a REST API. The server checks the data, hashes the password with bcrypt, and stores the user in MongoDB.

> **Important:** the login in this project is a **demonstration**. See section 14.

## 2. Technologies used

| Part | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Communication | REST API, JSON, Fetch API |
| Security helpers | bcryptjs, helmet, cors, express-rate-limit, dotenv |

## 3. Folder structure

```
SignupApp/
├── client/                    React frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx           starts React
│       ├── App.jsx            page routes (/signup, /login, /welcome)
│       ├── api.js             Fetch API calls to the server
│       ├── validation.js      form validation rules
│       ├── index.css          global styles
│       ├── App.css            page styles
│       ├── components/PasswordField.jsx
│       └── pages/ SignUp.jsx, Login.jsx, Welcome.jsx
├── server/                    Express backend
│   ├── server.js              starts the server and connects to MongoDB
│   ├── models/User.js         Mongoose schema + model
│   ├── routes/auth.js         /signup and /login
│   ├── middleware/requireDatabase.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── README.md
└── VIVA_PREP.md               viva questions + 2-minute demo script
```

## 4. Prerequisites

1. **Node.js 18 or newer** (LTS). Download from https://nodejs.org. Check in PowerShell:
   ```powershell
   node -v
   npm -v
   ```
2. A free **MongoDB Atlas** account (section 6) – or MongoDB installed locally.
3. A code editor such as VS Code.

## 5. Install dependencies

Open **two** PowerShell windows. In the first:

```powershell
cd path\to\SignupApp\server
npm install
```

In the second:

```powershell
cd path\to\SignupApp\client
npm install
```

## 6. Create a MongoDB Atlas database

1. Go to https://www.mongodb.com/cloud/atlas and sign up (free).
2. Create a project, then click **Create** (or **Build a Database**) and choose the free **M0** cluster. Pick any nearby region and click **Create**.
3. **Database user:** open **Database Access** → **Add New Database User**. Choose *Password* authentication, enter a username (for example `signupuser`) and a password. Use letters and numbers only – special characters must be URL-encoded in the connection string. Give it *Read and write to any database* and save.
4. **Network access:** open **Network Access** → **Add IP Address** → **Add Current IP Address** → Confirm. (For a demo at college, you may need to add the college network's IP again, or temporarily choose *Allow access from anywhere* `0.0.0.0/0`. Remove it after the demo.)

## 7. Get the connection string

1. Open **Database** → click **Connect** on your cluster → **Drivers**.
2. Copy the string. It looks like:
   ```
   mongodb+srv://signupuser:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your real password (no `<` `>` symbols) and add the database name `signupapp` before the `?`:
   

**Using local MongoDB instead:** install MongoDB Community Server, make sure the service is running, and use:
```
MONGODB_URI=mongodb://127.0.0.1:27017/signupapp
```

## 8. Create the server `.env` file

```powershell
cd path\to\SignupApp\server
Copy-Item .env.example .env
notepad .env
```

Set your values:

```
MONGODB_URI=mongodb+srv://signupuser:<password>@cluster0.abcde.mongodb.net/signupapp?retryWrites=true&w=majority
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Never share or upload `.env`. It is already listed in `.gitignore`.

## 9. Start the Express server

```powershell
cd path\to\SignupApp\server
npm run dev
```

You should see `Connected to MongoDB.` and `Server running at http://localhost:5000`. Use `npm start` if you do not want auto-restart.

Quick check: open http://localhost:5000/api/health in a browser. It should show `"database":"connected"`.

## 10. Start the React frontend

In the second PowerShell window:

```powershell
cd path\to\SignupApp\client
npm run dev
```

Open http://localhost:5173. If your server uses a different port, copy `client\.env.example` to `client\.env`, set `VITE_API_URL`, and restart the client.

## 11. Test Sign Up and Login

1. Go to the Sign Up page, enter `student@example.com` and `StrongPass123`, click **Sign Up**. A green success message appears.
2. In Atlas: **Database → Browse Collections → signupapp → users**. The password should look like `$2a$10$...` (a hash), not `StrongPass123`.
3. Sign up with the same email again → "An account with this email already exists."
4. Submit the empty form, an invalid email (`abc`), and a 5-character password → red messages appear.
5. Click **Log In**, enter the correct details → the Welcome screen appears.
6. Try a wrong password, and an email that was never registered → both show "Incorrect email or password."
7. Stop the server and try to sign up → "Cannot reach the server…".

## 12. REST API

All responses are JSON.

**POST `/api/auth/signup`**
```json
{ "email": "student@example.com", "password": "StrongPass123" }
```
| Status | Meaning |
|---|---|
| 201 | Created. Body: `{ "message": "...", "user": { "id", "email", "createdAt" } }` |
| 400 | Invalid input. Body includes `errors` per field |
| 409 | Email already registered |
| 503 | Database unavailable |

**POST `/api/auth/login`**
```json
{ "email": "student@example.com", "password": "StrongPass123" }
```
| Status | Meaning |
|---|---|
| 200 | Credentials correct. Body: `{ "message": "...", "user": { "id", "email" } }` |
| 400 | Missing email or password |
| 401 | Wrong email or password (same message for both) |
| 503 | Database unavailable |

**GET `/api/health`** – shows whether the database is connected.

Project Demo

Watch the project demonstration below:

https://github.com/user-attachments/assets/2c34f27d-19ef-49e6-a18f-6e7ba03d332b
