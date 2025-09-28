using Microsoft.EntityFrameworkCore;
using QrAr.Api.DbContexts;
using QrAr.Api.Dtos;
using QrAr.Api.Models;

namespace QrAr.Api.Services;

public class ExperienceService : IExperienceService
{
    private readonly AppDbContext _context;

    public ExperienceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Experience?> GetByIdAsync(string id)
    {
        return await _context.Experiences.FindAsync(id);
    }

    public async Task<IEnumerable<Experience>> GetAllActiveAsync()
    {
        return await _context.Experiences
            .Where(e => e.IsActive)
            .OrderByDescending(e => e.CreatedAtUtc)
            .ToListAsync();
    }

    public async Task<(IEnumerable<ExperienceDto> Items, int Total)> GetFilteredAsync(
        string? search, string? type, int page, int pageSize, bool? onlyActive)
    {
        page = page <= 0 ? 1 : page;
        pageSize = pageSize is < 1 or > 100 ? 20 : pageSize;

        var query = _context.Experiences.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => x.Title.Contains(search) || x.Id.Contains(search));

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(x => x.Type == type);

        if (onlyActive is true)
            query = query.Where(x => x.IsActive);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => ExperienceDto.ToDto(x))
            .ToListAsync();

        return (items, total);
    }

    public async Task<Experience> CreateAsync(Experience experience)
    {
        if (string.IsNullOrWhiteSpace(experience.Id))
            experience.Id = Guid.NewGuid().ToString("N");

        _context.Experiences.Add(experience);
        await _context.SaveChangesAsync();

        return experience;
    }

    public async Task<Experience?> UpdateAsync(string id, ExperienceCreateUpdateDto dto)
    {
        var experience = await _context.Experiences.FindAsync(id);
        if (experience is null)
            return null;

        experience.Title = dto.Title;
        experience.Type = dto.Type;
        experience.MediaUrl = dto.MediaUrl;
        experience.ThumbnailUrl = dto.ThumbnailUrl;
        experience.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return experience;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var experience = await _context.Experiences.FindAsync(id);
        if (experience is null)
            return false;

        _context.Experiences.Remove(experience);
        await _context.SaveChangesAsync();

        return true;
    }

    public Task<Dictionary<string, string[]>> ValidateExperienceAsync(ExperienceCreateUpdateDto dto)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(dto.Title))
            errors["title"] = ["Requerido"];

        if (string.IsNullOrWhiteSpace(dto.Type) || !(dto.Type is "Video" or "Model3D" or "Message" or "Image"))
            errors["type"] = ["Debe ser Video | Model3D | Message | Image"];

        if (string.IsNullOrWhiteSpace(dto.MediaUrl) || !Uri.IsWellFormedUriString(dto.MediaUrl, UriKind.Absolute))
            errors["mediaUrl"] = ["URL inválida"];

        return Task.FromResult(errors);
    }
}