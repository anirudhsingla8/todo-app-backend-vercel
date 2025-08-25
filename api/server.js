import { createUser, findUserByUsername, comparePassword } from '../lib/user.js';
import { createTodo, findTodosByUserId, updateTodo, deleteTodo } from '../lib/todo.js';
import { URL } from 'url';

// Helper function to parse request body
async function getBody(request) {
  return new Promise((resolve) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      try {
        // Ensure body is not empty before parsing
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (e) {
        console.error('Error parsing JSON body:', e);
        resolve({});
      }
    });
  });
}

export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with your frontend's domain in production
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { method, url } = request;
  // Vercel provides the full URL, so we can parse it directly
  const { pathname, searchParams } = new URL(url, `http://${request.headers.host}`);

  try {
    // Route: User Signup
    if (method === 'POST' && pathname === '/api/users/signup') {
      const { username, password } = await getBody(request);

      if (!username || !password) {
        return response.status(400).json({ message: 'Username and password are required' });
      }

      const existingUser = await findUserByUsername(username);
      if (existingUser) {
        return response.status(409).json({ message: 'User already exists' });
      }

      const newUser = await createUser(username, password);
      // Return only non-sensitive data
      return response.status(201).json({ id: newUser.id, username: newUser.username });
    }

    // Route: User Login
    if (method === 'POST' && pathname === '/api/auth/login') {
        const { username, password } = await getBody(request);

        if (!username || !password) {
            return response.status(400).json({ message: 'Username and password are required' });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({ message: 'Invalid credentials' });
        }

        return response.status(200).json({ message: 'Login successful', userId: user.id });
    }

    // Route: Get Todos for a User
    if (method === 'GET' && pathname === '/api/todos') {
        const username = searchParams.get('username');

        if (!username) {
            return response.status(400).json({ message: 'Username query parameter is required' });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        const todos = await findTodosByUserId(user.id);
        return response.status(200).json(todos);
    }

    // Route: Create a new Todo
    if (method === 'POST' && pathname === '/api/todos/create') {
        const { username, text, ...options } = await getBody(request);

        if (!username || !text) {
            return response.status(400).json({ message: 'Username and text are required' });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        const newTodo = await createTodo(user.id, text, options);
        return response.status(201).json(newTodo);
    }

    // Route: Update a Todo
    if (method === 'PUT' && pathname === '/api/todos/update') {
        const { id, ...updates } = await getBody(request);

        if (!id) {
            return response.status(400).json({ message: 'Todo ID is required for updates' });
        }

        const success = await updateTodo(id, updates);
        if (success) {
            return response.status(200).json({ message: 'Todo updated successfully' });
        } else {
            return response.status(404).json({ message: 'Todo not found or update failed' });
        }
    }

    // Route: Delete a Todo
    if (method === 'DELETE' && pathname === '/api/todos/delete') {
        const { id } = await getBody(request);

        if (!id) {
            return response.status(400).json({ message: 'Todo ID is required for deletion' });
        }

        const success = await deleteTodo(id);
        if (success) {
            return response.status(200).json({ message: 'Todo deleted successfully' });
        } else {
            return response.status(404).json({ message: 'Todo not found or deletion failed' });
        }
    }

    // Default response for unmatched routes
    return response.status(404).json({ message: `Route ${method} ${pathname} not found` });

  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ message: 'An internal server error occurred. Please check logs for details.' });
  }
}
