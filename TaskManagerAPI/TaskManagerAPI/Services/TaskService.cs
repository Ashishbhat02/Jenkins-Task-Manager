using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskItem>> GetAllTasks()
        {
            return await _context.TaskItems.ToListAsync();  // Changed from Tasks to TaskItems
        }

        public async Task<TaskItem> GetTaskById(int id)
        {
            return await _context.TaskItems.FindAsync(id);  // Changed from Tasks to TaskItems
        }

        public async Task<TaskItem> CreateTask(TaskItem task)
        {
            _context.TaskItems.Add(task);  // Changed from Tasks to TaskItems
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem> UpdateTask(int id, TaskItem task)
        {
            var existingTask = await _context.TaskItems.FindAsync(id);  // Changed from Tasks to TaskItems
                if (existingTask == null)
                    return null;

                    // Update properties
                    existingTask.Title = task.Title;
                    existingTask.Description = task.Description;
                    existingTask.IsCompleted = task.IsCompleted;

                    await _context.SaveChangesAsync();
                    return existingTask;
        }

        public async Task<bool> DeleteTask(int id)
        {
            var task = await _context.TaskItems.FindAsync(id);  // Changed from Tasks to TaskItems
            if (task == null)
                return false;

            _context.TaskItems.Remove(task);  // Changed from Tasks to TaskItems
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
