import { findUserByUsername } from '../../lib/user.js';
import { createTodo } from '../../lib/todo.js';

export default async function handler(request, response) {
  // Handle only POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, text, dueDate, tags, priority, notes, reminder } = request.body;

    // Validate input
    if (!username || !text) {
      return response.status(400).json({ message: 'Username and text are required' });
    }

    // Find user by username
    const user = await findUserByUsername(username);
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    // Create new todo
    const todo = await createTodo(user.id, text, {
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tags || [],
      priority: priority || 'medium',
      notes,
      reminder: reminder ? new Date(reminder) : undefined
    });
    
    // Return created todo
    return response.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    return response.status(500).json({ message: 'Failed to create todo' });
  }
}