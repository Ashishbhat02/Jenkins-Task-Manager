import React, { useState, useEffect } from 'react';

const TaskForm = ({ onTaskCreated, editingTask, onCancelEdit }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 1
    });

    // Update form when editingTask changes
    useEffect(() => {
        if (editingTask) {
            setTask({
                title: editingTask.title || '',
                description: editingTask.description || '',
                dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
                priority: editingTask.priority || 1
            });
        } else {
            // Reset form when not editing
            setTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 1
            });
        }
    }, [editingTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!task.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        const taskData = {
            ...task,
            id: editingTask?.id || 0,
            isCompleted: editingTask?.isCompleted || false
        };

        try {
            if (editingTask) {
                await onTaskCreated(taskData, true);
            } else {
                await onTaskCreated(taskData, false);
            }
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Error saving task. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({
            ...prev,
            [name]: name === 'priority' ? parseInt(value) : value
        }));
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                </h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter task title"
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            value={task.description}
                            onChange={handleChange}
                            placeholder="Enter task description (optional)"
                        />
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="dueDate" className="form-label">Due Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="dueDate"
                                name="dueDate"
                                value={task.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="priority" className="form-label">Priority</label>
                            <select
                                className="form-select"
                                id="priority"
                                name="priority"
                                value={task.priority}
                                onChange={handleChange}
                            >
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </button>
                        {editingTask && (
                            <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;