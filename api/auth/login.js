import { findUserByUsername, comparePassword } from '../../lib/user.js';

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

    // Find user by username
    const user = await findUserByUsername(username);
    
    if (!user) {
      return response.status(401).json({ message: 'User not found' });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return response.status(401).json({ message: 'Incorrect password' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Return success response
    return response.status(200).json({
      user: {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        createdAt: userWithoutPassword.createdAt
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}
