using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;      // Add this
using TaskManagerAPI.Services;   // Add this

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TaskItem>>> GetTasks()
        {
            var tasks = await _taskService.GetAllTasks();
            return Ok(tasks);
        }

        // ... other methods
    }
}
