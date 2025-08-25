import { getModels } from './db.js';

// Todo methods
async function createTodo(userId, text, options = {}) {
  try {
    const { Todo } = await getModels();
    
    const newTodo = new Todo({
      userId,
      text,
      dueDate: options.dueDate,
      tags: options.tags || [],
      priority: options.priority || 'medium',
      notes: options.notes,
      reminder: options.reminder
    });
    
    const savedTodo = await newTodo.save();
    
    return {
      id: savedTodo._id.toString(), // Convert ObjectId to string
      userId: savedTodo.userId,
      text: savedTodo.text,
      completed: savedTodo.completed,
      createdAt: savedTodo.createdAt,
      updatedAt: savedTodo.updatedAt,
      completedAt: savedTodo.completedAt,
      dueDate: savedTodo.dueDate,
      tags: savedTodo.tags,
      priority: savedTodo.priority,
      notes: savedTodo.notes,
      reminder: savedTodo.reminder
    };
 } catch (error) {
    throw error;
  }
}

async function findTodosByUserId(userId) {
  try {
    const { Todo } = await getModels();
    const todos = await Todo.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    
    return todos.map(todo => ({
      id: todo._id.toString(), // Convert ObjectId to string
      userId: todo.userId,
      text: todo.text,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      completedAt: todo.completedAt,
      dueDate: todo.dueDate,
      tags: todo.tags,
      priority: todo.priority,
      notes: todo.notes,
      reminder: todo.reminder
    }));
  } catch (error) {
    throw error;
  }
}

async function updateTodoCompletion(id, completed) {
  try {
    const { Todo } = await getModels();
    const updateData = { 
      completed,
      updatedAt: new Date()
    };
    
    // If marking as completed, set completedAt timestamp
    if (completed) {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }
    
    const result = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
    
    return !!result;
  } catch (error) {
    throw error;
  }
}

async function updateTodo(id, updates) {
  try {
    const { Todo } = await getModels();
    const updateData = { ...updates, updatedAt: new Date() };
    
    // Handle date fields
    if (updates.completed !== undefined) {
      if (updates.completed) {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }
    
    const result = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
    
    return !!result;
  } catch (error) {
    throw error;
  }
}

async function deleteTodo(id) {
  try {
    const { Todo } = await getModels();
    const result = await Todo.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    throw error;
  }
}

export { createTodo, findTodosByUserId, updateTodoCompletion, updateTodo, deleteTodo };