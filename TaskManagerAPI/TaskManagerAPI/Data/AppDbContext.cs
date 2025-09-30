using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }

        // Remove the complex OnModelCreating for now to avoid errors
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // We'll add seed data later through migrations
        }
    }
}