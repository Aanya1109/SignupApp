# Viva Preparation

## Questions and simple answers

1. **What is a React component?**
   A reusable piece of the user interface written as a JavaScript function that returns JSX. In this project: `SignUp`, `Login`, `Welcome`, `PasswordField`.

2. **What is JSX?**
   A syntax that looks like HTML but is written inside JavaScript. A build tool (Vite) converts it into normal JavaScript calls.

3. **What are state and event handling in React?**
   State is data that can change, stored with `useState` (for example `email`, `password`, `loading`). When state changes, React redraws the component. Events such as `onChange` and `onSubmit` run functions when the user types or submits.

4. **What is Express.js?**
   A Node.js framework that makes it easy to create a web server, define routes, and use middleware.

5. **What is a REST API?**
   A way for programs to talk over HTTP using URLs and methods (GET, POST, PUT, DELETE) and usually JSON. Ours has `POST /api/auth/signup` and `POST /api/auth/login`.

6. **GET vs POST?**
   GET asks for data and puts parameters in the URL. POST sends data in the request body to create or process something. Passwords must go in a POST body, never in a URL.

7. **Which HTTP status codes do you use?**
   200 OK (login worked), 201 Created (signup worked), 400 Bad Request (invalid input), 401 Unauthorized (wrong credentials), 409 Conflict (email exists), 500 Server Error, 503 Service Unavailable (database down).

8. **What is MongoDB?**
   A NoSQL database that stores data as flexible JSON-like documents in collections, instead of rows in tables.

9. **What is Mongoose?**
   A library that lets Node.js talk to MongoDB using schemas and models, with built-in validation.

10. **Schema vs model?**
    A schema describes the shape and rules of a document (fields, types, required, unique). A model is built from the schema and gives us functions such as `User.create()` and `User.findOne()`.

11. **What is password hashing and why use it?**
    Hashing turns a password into a fixed string that cannot be reversed. If the database leaks, attackers do not get real passwords. We never store plain text.

12. **What is bcrypt?**
    A slow hashing algorithm designed for passwords. It adds a random *salt* so the same password gives different hashes, and the slowness makes guessing attacks expensive. We use `bcryptjs`.

13. **What is JSON?**
    JavaScript Object Notation – a text format for data, e.g. `{"email":"a@b.com"}`. It is the format between React and Express.

14. **What is the Fetch API?**
    A browser function that sends HTTP requests and returns a promise. `api.js` uses `fetch()` with `method: 'POST'` and a JSON body.

15. **What is CORS and why did you configure it?**
    Browsers block a page on one origin (`localhost:5173`) from calling another (`localhost:5000`) unless the server allows it. Our server sends CORS headers that allow only `CLIENT_ORIGIN`.

16. **What are environment variables?**
    Settings kept outside the code, in `.env`. We keep the MongoDB connection string there so secrets never go into source code or Git.

17. **Client-side vs server-side validation?**
    Client-side gives quick feedback but can be bypassed (anyone can call the API directly). Server-side is the real protection. We do both.

18. **Why is the login error message generic?**
    "Incorrect email or password" does not reveal whether the email exists, so attackers cannot discover registered emails.

19. **Is your login secure for production?**
    No – it is a demonstration. It checks the password but creates no session or token. Production needs `HttpOnly` secure cookie sessions or tokens, HTTPS, and more.

20. **Explain Sign Up from start to finish.**
    The user types an email and password → React validates → `fetch` sends a POST with JSON to `/api/auth/signup` → Express validates again → checks the email is not used → bcrypt hashes the password → Mongoose saves the user in MongoDB → server replies 201 JSON → React shows the success message.

## Two-minute demo script

1. (15 s) "This is a full-stack Sign Up and Login app. React is the frontend, Express and Node the backend, MongoDB Atlas the database, and they talk through a REST API."
2. (30 s) Click Sign Up with an empty form to show validation, then a short password. Then register a valid email. "The success message only appears after the server returns 201."
3. (30 s) Show the `users` collection in Atlas. "The password is a bcrypt hash, not the real password."
4. (20 s) Register the same email again → "409 Conflict, handled." 
5. (25 s) Click Log In: wrong password → generic error; correct password → Welcome screen. Mention the show/hide password button.
6. (10 s) "Login is a demonstration – a production version would add secure cookie sessions."
