import React from 'react';

const FilterTasks = ({ currentFilter, onFilterChange, taskStats }) => {
    const filters = [
        { key: 'all', label: 'All Tasks', count: taskStats.total },
        { key: 'active', label: 'Active', count: taskStats.active },
        { key: 'completed', label: 'Completed', count: taskStats.completed },
        { key: 'overdue', label: 'Overdue', count: taskStats.overdue }
    ];

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h6 className="card-title mb-3">Filter Tasks</h6>
                <div className="d-flex flex-wrap gap-2">
                    {filters.map(filter => (
                        <button
                            key={filter.key}
                            type="button"
                            className={`btn ${currentFilter === filter.key ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                            onClick={() => onFilterChange(filter.key)}
                        >
                            {filter.label} <span className="badge bg-light text-dark ms-1">{filter.count}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterTasks;