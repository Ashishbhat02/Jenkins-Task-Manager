import axios from 'axios';

// Use relative path or your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create new task
  createTask: async (task) => {
    try {
      const response = await apiClient.post('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (task) => {
    try {
      const response = await apiClient.put(`/tasks/${task.id}`, task);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

export default taskService;
