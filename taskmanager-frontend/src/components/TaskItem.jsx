import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
    const getPriorityBadge = (priority) => {
        const priorities = {
            1: { class: 'bg-secondary', text: 'Low' },
            2: { class: 'bg-warning text-dark', text: 'Medium' },
            3: { class: 'bg-danger', text: 'High' }
        };
        
        const priorityInfo = priorities[priority] || priorities[1];
        return <span className={`badge ${priorityInfo.class} ms-2`}>{priorityInfo.text}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        return due < today && !task.isCompleted;
    };

    return (
        <div className={`card mb-3 ${task.isCompleted ? 'border-success' : ''} ${isOverdue(task.dueDate) ? 'border-danger' : ''}`}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <h6 className={`card-title mb-2 ${task.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
                            {task.title}
                            {getPriorityBadge(task.priority)}
                            {isOverdue(task.dueDate) && (
                                <span className="badge bg-danger ms-2">Overdue</span>
                            )}
                            {task.isCompleted && (
                                <span className="badge bg-success ms-2">Completed</span>
                            )}
                        </h6>
                        
                        {task.description && (
                            <p className={`card-text small mb-2 ${task.isCompleted ? 'text-muted' : 'text-body'}`}>
                                {task.description}
                            </p>
                        )}
                        
                        <div className="text-muted small">
                            <span><strong>Due:</strong> {formatDate(task.dueDate)}</span>
                            <span className="ms-3"><strong>Created:</strong> {formatDate(task.createdDate)}</span>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2 flex-shrink-0">
                        <button
                            className={`btn btn-sm ${task.isCompleted ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => onToggleComplete(task)}
                            title={task.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                        >
                            {task.isCompleted ? '↶' : '✓'}
                        </button>
                        
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(task)}
                            title="Edit Task"
                            disabled={task.isCompleted}
                        >
                            ✏️
                        </button>
                        
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(task.id)}
                            title="Delete Task"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;