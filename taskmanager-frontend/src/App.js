import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterTasks from './components/FilterTasks';
import taskService from './services/taskService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError('');
            const tasksData = await taskService.getAllTasks();
            setTasks(tasksData);
        } catch (error) {
            console.error('Error loading tasks:', error);
            setError('Error loading tasks. Please check if the backend is running on https://localhost:5001');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData, isEditing = false) => {
        try {
            setError('');
            if (isEditing) {
                await taskService.updateTask(taskData);
            } else {
                await taskService.createTask(taskData);
            }
            await loadTasks();
            setEditingTask(null);
        } catch (error) {
            console.error('Error saving task:', error);
            setError('Error saving task. Please try again.');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                setError('');
                await taskService.deleteTask(taskId);
                await loadTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
                setError('Error deleting task. Please try again.');
            }
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            setError('');
            const updatedTask = { ...task, isCompleted: !task.isCompleted };
            await taskService.updateTask(updatedTask);
            await loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Error updating task. Please try again.');
        }
    };

    // Filter tasks based on current filter
    const filteredTasks = tasks.filter(task => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (dueDate) dueDate.setHours(0, 0, 0, 0);
        
        const isOverdue = dueDate && dueDate < today && !task.isCompleted;
        
        switch (filter) {
            case 'active':
                return !task.isCompleted;
            case 'completed':
                return task.isCompleted;
            case 'overdue':
                return isOverdue;
            default:
                return true;
        }
    });

    // Calculate task statistics
    const taskStats = {
        total: tasks.length,
        active: tasks.filter(t => !t.isCompleted).length,
        completed: tasks.filter(t => t.isCompleted).length,
        overdue: tasks.filter(t => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueDate = t.dueDate ? new Date(t.dueDate) : null;
            if (dueDate) dueDate.setHours(0, 0, 0, 0);
            return dueDate && dueDate < today && !t.isCompleted;
        }).length
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2 mb-0">Task Manager</h1>
                        <span className="badge bg-primary fs-6">Total: {taskStats.total}</span>
                    </div>
                    
                    {error && (
                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                    )}
                    
                    <TaskForm 
                        onTaskCreated={handleCreateTask}
                        editingTask={editingTask}
                        onCancelEdit={handleCancelEdit}
                    />
                    
                    <FilterTasks
                        currentFilter={filter}
                        onFilterChange={setFilter}
                        taskStats={taskStats}
                    />
                    
                    <TaskList
                        tasks={filteredTasks}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                    />
                </div>
                
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Task Statistics</h5>
                            </div>
                            <div className="card-body">
                                <div className="list-group list-group-flush">
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>Total Tasks</span>
                                        <span className="badge bg-primary rounded-pill">{taskStats.total}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>Active Tasks</span>
                                        <span className="badge bg-warning text-dark rounded-pill">{taskStats.active}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>Completed</span>
                                        <span className="badge bg-success rounded-pill">{taskStats.completed}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>Overdue</span>
                                        <span className="badge bg-danger rounded-pill">{taskStats.overdue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card mt-3">
                            <div className="card-body">
                                <h6 className="card-title">Quick Tips</h6>
                                <ul className="small text-muted mb-0">
                                    <li>Click ✓ to mark complete</li>
                                    <li>Click ✏️ to edit tasks</li>
                                    <li>Use filters to organize view</li>
                                    <li>Overdue tasks show in red</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;