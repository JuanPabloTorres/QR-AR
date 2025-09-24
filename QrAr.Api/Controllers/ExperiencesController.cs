using Microsoft.EntityFrameworkCore;
using QrAr.Api.DbContexts;
using QrAr.Api.Dtos;
using QrAr.Api.Models;

namespace QrAr.Api.Controllers
{
    public static class ExperiencesController
    {
        public static void MapExperiencesEndpoints(this WebApplication app)
        {
            // GET /api/experiences/{id}
            app.MapGet("/api/experiences/{id}", GetExperienceById);

            // GET /api/experiences/all
            app.MapGet("/api/experiences/all", GetAllActiveExperiences);

            // GET /api/experiences (with filtering and pagination)
            app.MapGet("/api/experiences", GetExperiences);

            // POST /api/experiences
            app.MapPost("/api/experiences", CreateExperience);

            // PUT /api/experiences/{id}
            app.MapPut("/api/experiences/{id}", UpdateExperience);

            // DELETE /api/experiences/{id}
            app.MapDelete("/api/experiences/{id}", DeleteExperience);
        }

        private static async Task<IResult> GetExperienceById(string id, AppDbContext db)
        {
            var experience = await db.Experiences.FindAsync(id);
            return experience is null ? Results.NotFound() : Results.Ok(experience);
        }

        private static async Task<IResult> GetAllActiveExperiences(AppDbContext db)
        {
            var experiences = await db.Experiences
                .Where(e => e.IsActive)
                .OrderByDescending(e => e.CreatedAtUtc)
                .ToListAsync();

            return Results.Ok(experiences);
        }

        private static async Task<IResult> GetExperiences(
            string? search, string? type, int page, int pageSize, bool? onlyActive, AppDbContext db)
        {
            page = page <= 0 ? 1 : page;
            pageSize = pageSize is < 1 or > 100 ? 20 : pageSize;

            var query = db.Experiences.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(x => x.Title.Contains(search) || x.Id.Contains(search));

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(x => x.Type == type);

            if (onlyActive is true)
                query = query.Where(x => x.IsActive);

            var total = await query.CountAsync();

            var items = (await query
                .OrderByDescending(x => x.CreatedAtUtc)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync())
                .Select(x => ExperienceDto.ToDto(x))
                .ToList();

            return Results.Ok(new { total, page, pageSize, items });
        }

        private static async Task<IResult> CreateExperience(ExperienceRecord experience, AppDbContext db)
        {
            if (string.IsNullOrWhiteSpace(experience.Id))
                experience.Id = Guid.NewGuid().ToString("N");

            db.Experiences.Add(experience);
            await db.SaveChangesAsync();

            return Results.Created($"/api/experiences/{experience.Id}", experience);
        }

        private static async Task<IResult> UpdateExperience(string id, ExperienceCreateUpdateDto dto, AppDbContext db)
        {
            var errors = ValidateExperience(dto);
            if (errors.Count > 0)
                return Results.ValidationProblem(errors);

            var experience = await db.Experiences.FindAsync(id);
            if (experience is null)
                return Results.NotFound();

            experience.Title = dto.Title;
            experience.Type = dto.Type;
            experience.MediaUrl = dto.MediaUrl;
            experience.ThumbnailUrl = dto.ThumbnailUrl;
            experience.IsActive = dto.IsActive;

            await db.SaveChangesAsync();

            return Results.Ok(ExperienceDto.ToDto(experience));
        }

        private static async Task<IResult> DeleteExperience(string id, AppDbContext db)
        {
            var experience = await db.Experiences.FindAsync(id);
            if (experience is null)
                return Results.NotFound();

            db.Experiences.Remove(experience);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }

        private static Dictionary<string, string[]> ValidateExperience(ExperienceCreateUpdateDto dto)
        {
            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(dto.Title))
                errors["title"] = ["Requerido"];

            if (string.IsNullOrWhiteSpace(dto.Type) || !(dto.Type is "Video" or "Model3D" or "Message" or "Image"))
                errors["type"] = ["Debe ser Video | Model3D | Message"];

            if (string.IsNullOrWhiteSpace(dto.MediaUrl) || !Uri.IsWellFormedUriString(dto.MediaUrl, UriKind.Absolute))
                errors["mediaUrl"] = ["URL inválida"];

            return errors;
        }
    }
}