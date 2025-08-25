import { findUserByUsername } from '../../lib/user.js';
import { findTodosByUserId } from '../../lib/todo.js';

export default async function handler(request, response) {
  // Handle only GET requests
 if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username } = request.query;

    // Validate input
    if (!username) {
      return response.status(400).json({ message: 'Username is required' });
    }

    // Find user by username
    const user = await findUserByUsername(username);
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    // Get todos for user
    const todos = await findTodosByUserId(user.id);
    
    // Return todos
    return response.status(200).json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    return response.status(500).json({ message: 'Failed to retrieve todos' });
  }
}