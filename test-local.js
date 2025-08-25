/**
 * Simple test script to verify the backend works locally
 * This script demonstrates how to test the API endpoints
 */

// Note: This is just a documentation script, not an actual test
// To test locally, run `npm run dev` and use a tool like curl or Postman

console.log(`
To test the Vercel-compatible backend locally:

1. Install dependencies:
   npm install

2. Create a .env.local file with your MongoDB connection string:
   echo "MONGODB_URI=your_mongodb_connection_string_here" > .env.local

3. Run the development server:
   npm run dev

4. Test the endpoints using curl or Postman:

   # User signup
   curl -X POST http://localhost:3000/api/users/signup \\
     -H "Content-Type: application/json" \\
     -d '{"username": "testuser", "password": "testpassword"}'

   # User login
   curl -X POST http://localhost:3000/api/auth/login \\
     -H "Content-Type: application/json" \\
     -d '{"username": "testuser", "password": "testpassword"}'

   # Create a todo (replace USERNAME with actual username)
   curl -X POST http://localhost:3000/api/todos/create \\
     -H "Content-Type: application/json" \\
     -d '{"username": "USERNAME", "text": "Test todo item"}'

   # Get todos (replace USERNAME with actual username)
   curl http://localhost:3000/api/todos?username=USERNAME

   # Update todo completion status (replace TODO_ID with actual ID)
   curl -X PUT http://localhost:3000/api/todos/update \\
     -H "Content-Type: application/json" \\
     -d '{"id": "TODO_ID", "completed": true}'

   # Update todo fields (replace TODO_ID with actual ID)
   curl -X PUT http://localhost:3000/api/todos/update \\
     -H "Content-Type: application/json" \\
     -d '{"id": "TODO_ID", "text": "Updated todo text"}'

   # Delete todo (replace TODO_ID with actual ID)
   curl -X DELETE http://localhost:3000/api/todos/delete \\
     -H "Content-Type: application/json" \\
     -d '{"id": "TODO_ID"}'
`);