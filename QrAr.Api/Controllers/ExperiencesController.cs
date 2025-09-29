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

            // GET /api/experiences/{id}/model - Serve 3D model files
            app.MapGet("/api/experiences/{id}/model", GetExperienceModel);
        }

        private static async Task<IResult> GetExperienceById(string id, IExperienceService experienceService)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return Results.BadRequest(ApiResponses.ValidationError("Invalid ID", new Dictionary<string, string[]> { ["id"] = ["ID cannot be empty"] }));

                var experience = await experienceService.GetByIdAsync(id);

                if (experience is null)
                    return Results.NotFound(ApiResponses.NotFound("Experience not found"));

                var dto = ExperienceDto.ToDto(experience);
                return Results.Ok(ApiResponses.Success(dto, "Experience retrieved successfully"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting experience by ID {id}: {ex.Message}");
                return Results.Problem(
                    detail: "An error occurred while retrieving the experience",
                    title: "Internal Server Error",
                    statusCode: 500
                );
            }
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
            try
            {
                var (items, total) = await experienceService.GetFilteredAsync(search, type, page, pageSize, onlyActive);

                return Results.Ok(ApiResponses.PaginatedSuccess(
                    items, total, page, pageSize,
                    $"Retrieved {items.Count()} experiences"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting experiences: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return Results.Problem(
                    detail: ex.Message,
                    title: "Internal Server Error",
                    statusCode: 500
                );
            }
        }

        private static async Task<IResult> CreateExperience(ExperienceCreateUpdateDto dto, IExperienceService experienceService)
        {
            try
            {
                var errors = await experienceService.ValidateExperienceAsync(dto);
                if (errors.Count > 0)
                    return Results.BadRequest(ApiResponses.ValidationError("Invalid input data", errors));

                var experienceId = Guid.NewGuid().ToString("N");
                
                // Map DTO to Experience entity
                var experience = new Experience
                {
                    Id = experienceId,
                    Title = dto.Title,
                    Type = dto.Type,
                    MediaUrl = dto.MediaUrl ?? "",
                    ThumbnailUrl = dto.ThumbnailUrl,
                    IsActive = dto.IsActive,
                    ModelData = dto.ModelData,
                    ModelFormat = dto.ModelFormat,
                    ModelSize = dto.ModelSize,
                    ModelFileName = dto.ModelFileName,
                    QRCodeUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={Uri.EscapeDataString($"https://localhost:3000/ar/{experienceId}")}"
                };

                var createdExperience = await experienceService.CreateAsync(experience);
                var responseDto = ExperienceDto.ToDto(createdExperience);

                var response = ApiResponses.Success(responseDto, "Experience created successfully");
                return Results.Created($"/api/experiences/{createdExperience.Id}", response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating experience: {ex.Message}");
                return Results.Problem(
                    detail: "An error occurred while creating the experience",
                    title: "Internal Server Error",
                    statusCode: 500
                );
            }
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

        private static async Task<IResult> GetExperienceModel(string id, IExperienceService experienceService)
        {
            var experience = await experienceService.GetByIdAsync(id);

            if (experience is null)
                return Results.NotFound(ApiResponses.NotFound("Experience not found"));

            if (experience.Type != "Model3D" || string.IsNullOrEmpty(experience.ModelData))
                return Results.NotFound(ApiResponses.NotFound("3D model not found for this experience"));

            try
            {
                // Convert base64 string back to bytes
                var modelBytes = Convert.FromBase64String(experience.ModelData);
                
                // Determine content type based on model format
                var contentType = experience.ModelFormat?.ToLower() switch
                {
                    "glb" => "model/gltf-binary",
                    "gltf" => "model/gltf+json",
                    "fbx" => "application/octet-stream",
                    "obj" => "text/plain",
                    _ => "application/octet-stream"
                };

                var fileName = experience.ModelFileName ?? $"{experience.Id}.{experience.ModelFormat ?? "glb"}";
                
                return Results.File(modelBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ApiResponses.Error("Failed to serve model file", ex.Message));
            }
        }
    }
}