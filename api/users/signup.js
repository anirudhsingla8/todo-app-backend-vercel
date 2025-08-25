import { createUser, findUserByUsername } from '../../lib/user.js';

export default async function handler(request, response) {
  // Handle only POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = request.body;
    
    // Validate input
    if (!username || !password) {
      return response.status(400).json({ message: 'Username and password are required' });
    }
    
    if (password.length < 6) {
      return response.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return response.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await createUser(username, password);
    
    // Return success response
    return response.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message === 'User already exists') {
      return response.status(400).json({ message: 'User already exists' });
    }
    return response.status(500).json({ message: 'Failed to create user' });
  }
}