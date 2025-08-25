import { deleteTodo } from '../../lib/todo.js';

export default async function handler(request, response) {
  // Handle only DELETE requests
  if (request.method !== 'DELETE') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = request.body;

    // Validate input
    if (id === undefined) {
      return response.status(400).json({ message: 'Todo ID is required' });
    }

    // Delete todo
    const result = await deleteTodo(id);
    if (!result) {
      return response.status(404).json({ message: 'Todo not found' });
    }

    // Return success response
    return response.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    return response.status(500).json({ message: 'Failed to delete todo' });
  }
}