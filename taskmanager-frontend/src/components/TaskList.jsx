import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
    if (tasks.length === 0) {
        return (
            <div className="card">
                <div className="card-body text-center text-muted py-5">
                    <h5>No tasks found</h5>
                    <p className="mb-0">Create your first task to get started!</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                />
            ))}
        </div>
    );
};

export default TaskList;