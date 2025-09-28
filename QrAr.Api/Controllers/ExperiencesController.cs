using Microsoft.AspNetCore.Builder;
using QrAr.Api.Dtos;
using QrAr.Api.Dtos.Responses;
using QrAr.Api.Models;
using QrAr.Api.Services;

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

        private static async Task<IResult> GetExperienceById(string id, IExperienceService experienceService)
        {
            var experience = await experienceService.GetByIdAsync(id);

            if (experience is null)
                return Results.NotFound(ApiResponses.NotFound("Experience not found"));

            var dto = ExperienceDto.ToDto(experience);
            return Results.Ok(ApiResponses.Success(dto, "Experience retrieved successfully"));
        }

        private static async Task<IResult> GetAllActiveExperiences(IExperienceService experienceService)
        {
            var experiences = await experienceService.GetAllActiveAsync();
            var dtos = experiences.Select(ExperienceDto.ToDto);

            return Results.Ok(ApiResponses.Success(dtos, "Active experiences retrieved successfully"));
        }

        private static async Task<IResult> GetExperiences(
            string? search, string? type, int page, int pageSize, bool? onlyActive,
            IExperienceService experienceService)
        {
            var (items, total) = await experienceService.GetFilteredAsync(search, type, page, pageSize, onlyActive);

            return Results.Ok(ApiResponses.PaginatedSuccess(
                items, total, page, pageSize,
                $"Retrieved {items.Count()} experiences"));
        }

        private static async Task<IResult> CreateExperience(Experience experience, IExperienceService experienceService)
        {
            var createdExperience = await experienceService.CreateAsync(experience);
            var dto = ExperienceDto.ToDto(createdExperience);

            var response = ApiResponses.Success(dto, "Experience created successfully");
            return Results.Created($"/api/experiences/{createdExperience.Id}", response);
        }

        private static async Task<IResult> UpdateExperience(string id, ExperienceCreateUpdateDto dto,
            IExperienceService experienceService)
        {
            var errors = await experienceService.ValidateExperienceAsync(dto);
            if (errors.Count > 0)
                return Results.BadRequest(ApiResponses.ValidationError("Invalid input data", errors));

            var updatedExperience = await experienceService.UpdateAsync(id, dto);
            if (updatedExperience is null)
                return Results.NotFound(ApiResponses.NotFound("Experience not found"));

            var responseDto = ExperienceDto.ToDto(updatedExperience);
            return Results.Ok(ApiResponses.Success(responseDto, "Experience updated successfully"));
        }

        private static async Task<IResult> DeleteExperience(string id, IExperienceService experienceService)
        {
            var deleted = await experienceService.DeleteAsync(id);
            if (!deleted)
                return Results.NotFound(ApiResponses.NotFound("Experience not found"));

            return Results.Ok(ApiResponses.Success("Experience deleted successfully"));
        }
    }
}