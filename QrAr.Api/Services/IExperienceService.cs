using QrAr.Api.Dtos;
using QrAr.Api.Models;

namespace QrAr.Api.Services;

public interface IExperienceService
{
    Task<Experience?> GetByIdAsync(string id);
    Task<IEnumerable<Experience>> GetAllActiveAsync();
    Task<(IEnumerable<ExperienceDto> Items, int Total)> GetFilteredAsync(
        string? search, string? type, int page, int pageSize, bool? onlyActive);
    Task<Experience> CreateAsync(Experience experience);
    Task<Experience?> UpdateAsync(string id, ExperienceCreateUpdateDto dto);
    Task<bool> DeleteAsync(string id);
    Task<Dictionary<string, string[]>> ValidateExperienceAsync(ExperienceCreateUpdateDto dto);
}