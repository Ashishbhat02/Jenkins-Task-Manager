using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using System;

namespace TaskManagerAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            // Database initialization
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();
                    context.Database.EnsureCreated();
                    Console.WriteLine("✅ Database created successfully!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Database creation failed: {ex.Message}");
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureServices((context, services) =>
                    {
                        // Add services to the container.
                        services.AddControllers();
                        services.AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlite("Data Source=Data/tasks.db"));

                        services.AddCors(options =>
                        {
                            options.AddPolicy("AllowAll", policy =>
                            {
                                policy.AllowAnyOrigin()
                                      .AllowAnyMethod()
                                      .AllowAnyHeader();
                            });
                        });
                    });

                    webBuilder.Configure(app =>
                    {
                        var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

                        // Configure the HTTP request pipeline.
                        if (env.IsDevelopment())
                        {
                            app.UseDeveloperExceptionPage();
                        }

                        app.UseCors("AllowAll");
                        app.UseRouting();
                        app.UseAuthorization();
                        app.UseEndpoints(endpoints =>
                        {
                            endpoints.MapControllers();
                        });

                        Console.WriteLine("🚀 Backend starting...");
                    });
                });
    }
}
