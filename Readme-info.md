
2026-EchoFlow(3)

Phase 0 — Git-first foundation

Before coding features:
	•	create project folder
	•	initialize git repo
	•	create .gitignore
	•	create initial README
	•	make first commit
	•	define folder structure for backend and later frontend

Phase 1 — Backend bootstrap
	•	initialize Node backend
	•	install dependencies
	•	create server
	•	verify server runs on 5001
	•	commit

Phase 2 — PostgreSQL setup
	•	create database
	•	design schema
	•	create tables
	•	connect backend to database
	•	test DB connection
	•	commit

Phase 3 — Backend architecture cleanup
	•	routes
	•	controllers
	•	services/helpers
	•	config
	•	middleware
	•	error handling
	•	commit

Phase 4 — Core Echo Flow features
	•	source submission
	•	pending status
	•	approval route
	•	public approved feed
	•	commit after each feature

Phase 5 — Auth and admin permissions
	•	users
	•	login/auth
	•	role protection
	•	admin-only approval actions
	•	commit by feature

Phase 6 — Frontend
	•	React setup
	•	API connection
	•	submission UI
	•	feed UI
	•	admin moderation UI
	•	commit by screen/feature

Phase 7 — Polish
	•	validation
	•	testing
	•	cleanup
	•	documentation
	•	deployment prep

This way, your Git log becomes your learning log.
     
👉 Explain your Echoflow app architecture end-to-end
“Echo Flow is a full-stack app built with a React frontend, a Node and Express backend, and PostgreSQL as the database.
I started with the backend first because I wanted a solid foundation before building the UI. I installed Node, npm, PostgreSQL, and the main backend dependencies such as Express, database libraries, environment config tools, and any middleware I needed.
Then I created the Express server in server.js, set it to run on port 5001, and made sure the server was working before adding more features.
After that, I designed the PostgreSQL schema based on the app’s core data. Since Echo Flow is about submitted content and moderation, I needed tables for things like users, sources or posts, categories, and statuses such as pending or approved. That way the database structure matched the real workflow of the app.

Next, I connected the backend to PostgreSQL so the server could read and write data. I organized the backend into folders so the project would scale better. For example, I separated routes, database logic, config, middleware, and helper functions inside src instead of keeping everything in one large file.
From there, the architecture works like this: the client sends a request to an API endpoint, Express receives it, the route sends the work to the proper backend logic, the backend validates the request, talks to PostgreSQL, and then sends a response back to the frontend in JSON.
For Echo Flow specifically, one important part of the architecture is moderation. A normal user can submit content, but that content may go into a pending state first. Then an admin can review it and approve it before it becomes publicly visible. So the backend is not just storing data, it is also enforcing workflow rules and permissions.
Overall, I built the backend first to create a clean API and database structure, and then the frontend can consume that API instead of mixing business logic into the UI.” 👉Why did you choose PostgreSQL for Echo Flow, and how did you design the database schema?
“I chose PostgreSQL because Echo Flow has strongly related data, and relational databases are a good fit for that. The app is not just storing simple posts. It has users, sources, categories, votes, bookmarks, and moderation states, and those pieces need to connect to each other correctly.
One reason PostgreSQL stood out was data integrity. I wanted the database to help enforce rules, not just store raw data. For example, a vote should belong to a valid user and a valid source, and bookmarks should also connect to real users and real content. PostgreSQL helps with that through constraints, foreign keys, and structured schema design.
Another reason is versatility. Most of the app data is structured, but PostgreSQL can also handle semi-structured data when needed, which gives flexibility as the project grows.
For the schema, I designed tables around the main app features. For example, I needed a users table for authentication and roles, a sources table for submitted content, a categories table to organize content, and tables like votes and bookmarks to represent user interaction. Then I defined relationships between them so the backend can query things efficiently and keep the data consistent.
So overall, I chose PostgreSQL because Echo Flow depends on connected data, strong relationships, and reliable constraints, and PostgreSQL is a strong fit for that kind of application.”
“The tables are the foundation of the app’s functionality.”
“I designed relationships between those tables so the data stays consistent and the app logic works correctly.”
👉How does content submission and admin approval work in Echo Flow from backend point of view? 
“From the backend perspective, when a user submits content in Echo Flow, the request is sent to a POST API endpoint, for example something like /api/sources.
When the backend receives that request, it first validates the input, such as the title, URL, or category. After validation, instead of immediately making the content public, the backend stores it in the database with a status of pending.
This means the content exists in the system but is not visible in the public feed.
For admin approval, I created a protected route, for example something like /api/admin/approve/:id. This route is secured so only users with admin privileges can access it. Typically this is done using middleware that checks the user’s role from a token or session.
When an admin calls this route, the backend updates the status of that specific record from pending to approved in the database.
On the frontend or public API side, when fetching content for users, the backend only returns records where the status is approved. That ensures unapproved content never appears publicly.
So overall, the backend controls the full workflow: submission creates a pending record, admin routes change the status, and public endpoints only expose approved data.”
🧠request lifecycle (POST → validation → DB)
	•	role-based access (admin-only route)
	•	database state management (pending → approved)
	•	data filtering (only approved shown)
	•	security awareness

👉How do you protect your backend routes (like admin approval) so normal users cannot access them?

-🧠 Very important principle
Validation happens in two layers:
1. Backend (you just did)
	•	prevents bad requests early
	•	returns clean error messages
2. Database (you also did)
	•	enforces constraints
	•	prevents invalid data from being stored
👉 Together = strong system
You should say:
-“I validate incoming request data inside my route handlers before interacting with the database. For example, in the source submission route, I check that required fields like title, URL, and submitter_id are present and valid. If any required field is missing or invalid, I return a 400 error and stop the request.
This prevents invalid or malicious data from reaching the database. I also rely on PostgreSQL constraints like foreign keys and checks to enforce data integrity at the database level.”
-Didn’t we already define types in the schema? Why do we still need backend validation?”
Short answer:
👉 Database types help, but they are not enough.
👉 Backend validation protects the app before the database is even involved.
 -How should we make sure ONLY admins can approve content? Only authenticated admins should be able to access the approval route. After login, the backend issues a token. That token should include the user identity and role, such as admin or user. Then middleware checks the token on protected routes. If the user is not authenticated or their role is not admin, the backend rejects the request.”
not “only admins have tokens”
but “both users and admins can have tokens, but only admin-role tokens can access admin routes.”

-Interview version of what you built so far
You can now honestly say:
“I built the backend foundation of Echo Flow with Node, Express, and PostgreSQL. I designed a relational schema for users, categories, sources, votes, and bookmarks. I implemented a moderation workflow where submitted content is stored as pending, admins can approve it, and the public feed only returns approved sources. I also tracked the rebuild from the start using Git so every major stage is visible in commit history.”
That is already a strong project explanation.

-Interview-quality summary
If an interviewer asks what this route does, you can say:
“This POST route handles source submission. It reads the incoming JSON body, validates required fields like title, URL, and submitter ID, then inserts the new source into PostgreSQL using a parameterized query. Optional fields are converted to null if missing, and the database applies the default moderation status of pending. On success, the route returns the newly created row with a 201 status. On invalid input it returns 400, and on server or database failure it returns 500.”

<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->
<!-- ************************************************************************************ -->


2026-EchoFlow-app

mkdir echoflow
cd echoflow

git init

mkdir backend
mkdir frontend

touch .gitignore
touch README.md

if git ask for your info: git config --global user.name "Your Name"
git config --global user.email "your@email.com"
 otherwise just follow bellow:
git add .
git commit -m "Initialize Echo Flow repo with base structure"

cd backend npm init -y (create pakage.json)

npm install express
npm install --save-dev nodemon

in pakage.json :  "scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

touch server.js
npm run dev
Server running on http://localhost:5001

Go back to root (important):
cd ..
git add .
git commit -m "Setup backend with Express server and nodemon"
git log --oneline

cd backend 
npm install pg dotenv
	•	pg = lets Node talk to PostgreSQL
	•	dotenv = loads secrets from .env

mkdir src
mkdir src/config
mkdir src/routes
mkdir src/controllers
mkdir src/models
mkdir src/middleware
mkdir src/helpers

in terminal: createdb echoflow
touch backend/src/config/db.js
run again:  npm run dev
http://localhost:5001
http://localhost:5001/db-test

cd .. :
git add .
git commit -m "Add PostgreSQL connection and backend folder structure"
git log --oneline

⛔$$$-file history specifically
git log -p backend/server.js
git diff HEAD~1 backend/server.js

⛔Remove tracked node_modules from Git only:
git rm -r --cached backend/node_modules
git add .gitignore
git commit -m "Remove node_modules from Git tracking"
git status
git show --name-only --stat

git rm -r --cached backend/node_modules
git add .gitignore
git commit -m "Remove node_modules from Git tracking"

git log --oneline
git status

Step 3.1 — Enter the database
In terminal, connect to your database:
Step 3.2 — Create the tables(users, categories, votes, sources, bookmarks )
touch backend/sql/schema.sql

git add .
git commit -m "Create initial database schema for Echo Flow"

backend/src/routes/sourcesRoutes.js
Open backend/server.js.
At the top, add:
Enter PostgreSQL:
Insert one user:
Insert one admin too, useful later:
Insert categories:
SELECT * FROM users;
SELECT * FROM categories;
In backend run:
npm run dev
Make a POST request to:
http://localhost:5001/api/sources
SELECT id, title, status, category_id, submitter_id FROM sources;
git add .
git commit -m "Add source submission route with pending moderation status"
git log --oneline

backend/src/routes/adminRoutes.js
Open backend/server.js
Add this import near the top:
const adminRoutes = require("./src/routes/adminRoutes");
PATCH http://localhost:5001/api/admin/approve/1
% git log --oneline

backend/src/routes/sourcesRoutes.js
Add this route above the router.post("/") route:
GET http://localhost:5001/api/sources
Now submit one more source with POST /api/sources:
git add .
git commit -m "Add public feed route for approved sources only"

Step 6.1 — Install auth dependency
npm install bcrypt
What it does:
	•	hashes passwords securely
	•	prevents storing raw passwords in DB
	.	Never store plain passwords.
-touch backend/src/routes/authRoutes.js(import this route to server.js)
-backend/server.js
Make a POST request to:
http://localhost:5001/api/auth/signup
{
  "username": "sara",
  "email": "sara@example.com",
  "password": "secret123"
}
Step 6.6 — Verify in PostgreSQL
SELECT id, username, email, role, password_hash FROM users ORDER BY id;
git add .
git commit -m "Add user signup route with bcrypt password hashing"

Instead of writing: INSERT INTO users VALUES ('sara', 'sara@example.com', 'hash', 'user’);
we write: VALUES ($1, $2, $3, $4)
1. Prevents SQL injection
Bad example (unsafe):
const query = `INSERT INTO users VALUES ('${username}')`;
If someone sends:
username = "sara'; DROP TABLE users; --"
👉 Your database is in danger.
Safe version 
VALUES ($1)
[username]
PostgreSQL treats the value as data only, not SQL.

-backend/src/routes/authRoutes.js
Add this below signup route
test login
http://localhost:5001/api/auth/login
🔥 Why we don’t decrypt passwords
We never “decrypt” passwords.
Instead:
	•	store hash
	•	compare hash
👉 One-way security
We store only hashed passwords, not raw passwords. At login, the user sends a plain password, and bcrypt.compare() safely checks whether that plain password matches the stored hash. A direct equality check would fail because the raw password and the hash are different values.

We use the SAME message for:
	•	wrong email
	•	wrong password
Why?
👉 Prevents attackers from guessing valid emails.
If you said:
	•	“email not found”
	•	“wrong password”
Then attacker learns which emails exist.

“How does bcrypt.compare work if hashes are different each time?”
You say:
“bcrypt stores the salt inside the hash. When comparing, it extracts the salt from the stored hash, re-hashes the input password using that same salt, and compares the result. That’s why even though hashes are different each time, the comparison still works.”
*git add .
git commit -m "Add login route with bcrypt password comparison"

🧠 What JWT does
Right now:
	•	user logs in
	•	backend returns user data
	•	but next request → user is “unknown” again
JWT fixes that.
👉 After login:
	•	backend gives user a token
	•	user sends that token in future requests
	•	backend verifies it
-npm install jsonwebtoken
inside .env:
JWT_SECRET=supersecretkey123
inside authRoures: const jwt = require("jsonwebtoken");
touch backend/src/middleware/authMiddleware.js
touch backend/src/middleware/adminMiddleware.js
in adminRoutes:
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.patch(
  "/approve/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
🧠Why do we store role inside the JWT token instead of querying the database every time?
Because it makes authorization faster and simpler for each request.
But important:
This works well because the token is signed, so the client cannot safely change the role without breaking the signature.
“We store the role in the JWT so the backend can authorize requests without querying the database every time. That improves performance and keeps middleware simpler. Since the token is signed, the role claim can be trusted as long as the token is valid. The tradeoff is that role changes are not reflected until the token expires or is reissued.”

Phase 6.4 — Reject route for moderation
create PATCH /api/admin/reject/:id http://localhost:5001/api/admin/reject/2

Phase 7 — Voting system
Step 7.1 — Create votes route file
touch backend/src/routes/votesRoutes.js
Add near the top at server.js
Step 7.3 — Restart backend
POST http://localhost:5001/api/votes
Authorization: Bearer USER_TOKEN_HERE
body: { "source_id": 1,
  "vote_type": "up"}
SELECT id, user_id, source_id, vote_type FROM votes ORDER BY id;
git add .
git commit -m "Add authenticated voting route with upsert behavior"
Small interview version
If asked how voting works, you can now say:
“I built an authenticated voting route where a logged-in user can upvote or downvote a source. The database enforces one vote per user per source with a unique constraint, and I use PostgreSQL’s ON CONFLICT clause to update the existing vote instead of inserting duplicates.”


Step 8.1 — Create bookmarks route file
touch backend/src/routes/bookmarksRoutes.js
Add near the top in server.js Step 8.3 — Restart backend
Step 8.4 — Test add bookmark
Step 8.5 — Test duplicate bookmark
Step 8.6 — Test get my bookmarks
Step 8.7 — Test remove bookmark
Step 8.8 — Verify in PostgreSQL
git add .
git commit -m "Add authenticated bookmarks routes for create list and delete"
“I built authenticated bookmark routes that let users save, list, and remove sources. The bookmarks table enforces one bookmark per user per source with a unique constraint, and the list route joins bookmarks with source data so the frontend can render saved items directly.”

Phase 9 — Category filtering for sources
Step 9.1 — Update sourcesRoutes.js
Find your current GET / route and replace it with this version:.
What changed here: req.query
const { category_id } = req.query;
Step 9.2 — Restart backend
Step 9.3 — Check category IDs in database
Step 9.4 — Test without filter
Step 9.5 — Test with category filter
Step 9.6 — Optional better validation