# LearnEase Backend
This is the backend of the LearnEase application. It is built with **Node.js**, **Express.js**, and **MongoDB**. It provides APIs for managing users, lessons, and orders.
---
## Project Structure.
```text
LearnEase-Backend/
│
├─ config/ # Database configuration.
├─ controllers/ # Route controllers for users, lessons and orders.
├─ middlewares/ # Custom middlewares (logger, static files)
├─ public/ # Static files.
├─ routes/ # Express route definitions.
├─ services/ # Business logic services.
├─ utils/ # Utility functions.
├─ validators/ # Request validators.
├─ logs/ # Log files.
├─ .env # Environment variables (not pushed to GitHub. User will have add manually.)
├─ .gitignore # Git ignore file.
├─ index.js # Entry point of the server.
├─ package.json
└─ package-lock.json
```
---
## Setup Instructions
1. Create a '.env' file in the root directory:
> **Note:** The '.env' file is not included in the repository. You will have to create it manually.
```env
MONGO_URL=your_mongodb_connection_string
PORT=6969
```
- MONGO_URL - Your MongoDB connection URI.
- PORT - The port the server will run (the default is 6969).
2. Install dependecies.
Open a terminal in the root folder of the project (where package.json is location), then run:
```bash
npm install
```
> This will install all required Node.js packages.
3.  CORS Configuration **(If running the frontend locally.)**

The server uses CORS to control which frontends are allowed to send requests.

Inside index.js, the CORS middleware is currently configured like this:
``` javascript
app.use(cors({
    origin: "https://saahiltakooree.github.io",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
```
#### What this means

This configuration only allows requests from:

>https://saahiltakooree.github.io


So if you try to call the API from:
- http://localhost:3000
- Any device on your home network
- Another domain

Your request will be blocked by CORS.

Running the Backend Locally (Change Required)

If you want to run the frontend locally, you must change the origin value to allow the local frontend.

Replace the CORS config with:

```javascript
app.use(cors());
```
> This allows requests from any domain.
---
## Run the project (Locally)
Open a terminal in the root folder of the project (where package.json is location), then run:
```bash
npm start
```
The server will:
- Connect to MongoDB using the 'MONGO_URL' from the '.env' file.
- Automatically create the 'LearnEase' database if it does not exist.
- Automatically create the required collections (users, lessons, orders) if they does not exist.
- Start listenin on the port specified in the '.env' file (The default is 6969).

There should be message like this in the console:
```text
Server is running on port 6969.
```
>This means the server is ready and connected to MongoDB.
---
## API Endpoints

The backend exposes routes under the `/api` path, plus a static file endpoint for lesson images. Some key endpoints include:

### Users
- `POST /api/users/signup` – Create a new user.
- `POST /api/users/login` – Login a user.
- `PUT /api/users/reset-password` – Reset user password.

### Lessons
- `GET /api/lessons` – Get all lessons.
- `GET /api/lessons/:id` – Get a lesson by ID.
- `POST /api/lessons` – Create a new lesson.
- `PUT /api/lessons/:id` – Update lesson details.
- `DELETE /api/lessons/:id` – Delete a lesson.
- `GET /api/lessons/taught` – Get lessons by 'teacher' email.
- `GET /api/lessons/enrolled` – Get lessons a user is enrolled in.

### Orders
- `GET /api/orders` – Get all orders.
- `POST /api/orders` – Create a new order.

### Search
- `GET /api/search` – ### Search
- `GET /api/search?q=<keyword>` – Search lessons by keyword across `name`, `description`, `topic`, `location`, `price`, `space`, and `availableSpace`.


### Static Files
- `GET /images/lessons/:imageName` – Get lesson images stored in the `public/images/lessons` folder  

  > Example: `/images/lessons/math.jpeg`  
  > The server automatically serves the file if it exists and sets proper `Content-Type` and caching headers. If the file does not exist, it returns a 404 JSON response.