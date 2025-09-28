using Microsoft.EntityFrameworkCore;
using QrAr.Api.DbContexts;
using QrAr.Api.Models;

namespace QrAr.Api.Services;

public interface IDatabaseSeederService
{
    Task SeedAsync();
}

public class DatabaseSeederService : IDatabaseSeederService
{
    private readonly AppDbContext _context;

    public DatabaseSeederService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // Ensure database is created and migrations are applied
        await _context.Database.MigrateAsync();

        // Seed initial data if not exists
        await SeedExperiencesAsync();

        await _context.SaveChangesAsync();
    }

    private async Task SeedExperiencesAsync()
    {
        if (!await _context.Experiences.AnyAsync())
        {
            var sampleExperience = new Experience
            {
                Id = "demo_video_01",
                Title = "Highlight MJ",
                Type = "Video", // "Video" | "Model3D" | "Message"
                MediaUrl = "https://cdn.tu-dominio/video/highlight.mp4",
                ThumbnailUrl = "https://cdn.tu-dominio/thumbs/highlight.jpg",
                IsActive = true
            };

            _context.Experiences.Add(sampleExperience);
        }
    }
}