# Vercel Todo Backend

This is a Vercel-compatible backend for a todo application, designed to work with serverless functions.

## Project Structure

```
.
├── api/
│   ├── auth/
│   │   └── login.js
│   ├── users/
│   │   └── signup.js
│   └── todos/
│       ├── index.js
│       ├── create.js
│       ├── update.js
│       └── delete.js
├── lib/
│   ├── db.js
│   ├── user.js
│   └── todo.js
├── package.json
├── vercel.json
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/auth/login` - User login
- `POST /api/users/signup` - User registration
- `GET /api/todos?username={username}` - Get all todos for a user
- `POST /api/todos/create` - Create a new todo
- `PUT /api/todos/update` - Update todo completion status or fields
- `DELETE /api/todos/delete` - Delete a todo

## Deployment to Vercel

1. Push this code to a GitHub repository
2. Connect the repository to a new Vercel project:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project settings:
     - Framework Preset: Other
     - Root Directory: / (or leave empty)
     - Build and Output Settings: Use default settings
3. Set the `MONGODB_URI` environment variable in the Vercel dashboard:
   - Go to your project settings
   - Click "Environment Variables"
   - Add a new variable:
     - Name: `MONGODB_URI`
     - Value: Your MongoDB connection string
   - Make sure to set it for both Development and Production environments
4. Vercel will automatically deploy the project
5. After deployment, you can access your API at your Vercel project URL

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (required)

## Local Testing

To test the API endpoints locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Test the endpoints using curl or Postman:

   ### User signup
   ```bash
   curl -X POST http://localhost:3000/api/users/signup \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpassword"}'
   ```

   ### User login
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpassword"}'
   ```

   ### Create a todo (replace USERNAME with actual username)
   ```bash
   curl -X POST http://localhost:3000/api/todos/create \
     -H "Content-Type: application/json" \
     -d '{"username": "USERNAME", "text": "Test todo item"}'
   ```

   ### Get todos (replace USERNAME with actual username)
   ```bash
   curl http://localhost:3000/api/todos?username=USERNAME
   ```

   ### Update todo completion status (replace TODO_ID with actual ID)
   ```bash
   curl -X PUT http://localhost:3000/api/todos/update \
     -H "Content-Type: application/json" \
     -d '{"id": "TODO_ID", "completed": true}'
   ```

   ### Update todo fields (replace TODO_ID with actual ID)
   ```bash
   curl -X PUT http://localhost:3000/api/todos/update \
     -H "Content-Type: application/json" \
     -d '{"id": "TODO_ID", "text": "Updated todo text"}'
   ```

   ### Delete todo (replace TODO_ID with actual ID)
   ```bash
   curl -X DELETE http://localhost:3000/api/todos/delete \
     -H "Content-Type: application/json" \
     -d '{"id": "TODO_ID"}'
   ```

## Technologies Used

- Node.js
- MongoDB (with Mongoose)
- Vercel Serverless Functions
- Bcrypt (for password hashing)