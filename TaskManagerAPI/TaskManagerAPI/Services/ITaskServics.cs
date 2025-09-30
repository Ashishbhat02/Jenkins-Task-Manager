using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public interface ITaskService
    {
        Task<List<TaskItem>> GetAllTasks();
        Task<TaskItem> GetTaskById(int id);
        Task<TaskItem> CreateTask(TaskItem task);
        Task<TaskItem> UpdateTask(TaskItem task);
        Task<bool> DeleteTask(int id);
    }
}