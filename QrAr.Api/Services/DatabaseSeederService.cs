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
            var sampleExperiences = new List<Experience>
            {
                new Experience
                {
                    Id = "demo_video_01",
                    Title = "Highlight MJ",
                    Type = "Video",
                    MediaUrl = "https://cdn.tu-dominio/video/highlight.mp4",
                    ThumbnailUrl = "https://cdn.tu-dominio/thumbs/highlight.jpg",
                    IsActive = true
                },
                new Experience
                {
                    Id = "test-astronaut",
                    Title = "Astronauta 3D",
                    Type = "Model3D",
                    MediaUrl = "https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb",
                    IsActive = true,
                    ModelFormat = "glb",
                    ModelFileName = "Astronaut.glb",
                    // Note: ModelData will be empty, using MediaUrl for external model
                },
                new Experience
                {
                    Id = "test-tipche",
                    Title = "Ti-pche",
                    Type = "Model3D",
                    MediaUrl = "/models/6e47b68d13a0413d8fd5fa248a639e8b.glb",
                    IsActive = true,
                    ModelFormat = "glb",
                    ModelFileName = "6e47b68d13a0413d8fd5fa248a639e8b.glb",
                    // Note: ModelData will be populated by loading from file if exists
                },
                new Experience
                {
                    Id = "test-message",
                    Title = "Mensaje de Bienvenida",
                    Type = "Message",
                    MediaUrl = "¡Bienvenido a la experiencia AR!",
                    IsActive = true
                }
            };

            _context.Experiences.AddRange(sampleExperiences);
        }
    }
}