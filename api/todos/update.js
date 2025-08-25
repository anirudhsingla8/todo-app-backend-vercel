import { updateTodoCompletion, updateTodo } from '../../lib/todo.js';

export default async function handler(request, response) {
  // Handle only PUT requests
  if (request.method !== 'PUT') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if we're updating completion status (has 'id' and 'completed' properties)
    // or updating other fields (has 'id' in URL path)
    const { id, completed, ...updates } = request.body;
    
    // If we have id and completed, update completion status
    if (id !== undefined && completed !== undefined) {
      const result = await updateTodoCompletion(id, completed);
      if (!result) {
        return response.status(404).json({ message: 'Todo not found' });
      }
      
      return response.status(200).json({ id, completed });
    }
    
    // If we have other update fields, update those
    if (id !== undefined && Object.keys(updates).length > 0) {
      // Convert string dates to Date objects
      if (updates.dueDate !== undefined) updates.dueDate = new Date(updates.dueDate);
      if (updates.reminder !== undefined) updates.reminder = new Date(updates.reminder);
      
      const result = await updateTodo(id, updates);
      if (!result) {
        return response.status(404).json({ message: 'Todo not found' });
      }
      
      return response.status(200).json({ message: 'Todo updated successfully' });
    }
    
    // If we don't have proper parameters
    return response.status(400).json({ message: 'Invalid update parameters' });
  } catch (error) {
    console.error('Update todo error:', error);
    return response.status(500).json({ message: 'Failed to update todo' });
  }
}