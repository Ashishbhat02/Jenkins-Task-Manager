using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;  // Add this using directive

namespace TaskManagerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> TaskItems { get; set; }
    }
}
