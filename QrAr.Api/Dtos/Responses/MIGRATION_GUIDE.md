# Migration Guide: Using Organized API Response Models

## Overview

The API response models have been organized into a dedicated `Responses` folder with proper namespace structure:

```
?? QrAr.Api/Dtos/Responses/
??? ApiResponse.cs       # Generic response wrapper
??? PaginatedResponse.cs # Paginated response wrapper  
??? ApiResponses.cs      # Static helper methods
??? README.md           # Documentation
```

**New Namespace**: `QrAr.Api.Dtos.Responses`

## Step-by-Step Migration

### 1. Add Using Statement

Add this to your controller files:
```csharp
using QrAr.Api.Dtos.Responses;
```

### 2. Update Controller Methods

#### Before (Current Implementation)
```csharp
private static async Task<IResult> GetExperienceById(string id, AppDbContext db)
{
    var experience = await db.Experiences.FindAsync(id);
    return experience is null ? Results.NotFound() : Results.Ok(experience);
}

private static async Task<IResult> GetExperiences(
    string? search, string? type, int page, int pageSize, bool? onlyActive, AppDbContext db)
{
    // ...filtering logic...
    return Results.Ok(new { total, page, pageSize, items });
}
```

#### After (Standardized Responses)
```csharp
using QrAr.Api.Dtos.Responses; // ?? Add this

private static async Task<IResult> GetExperienceById(string id, AppDbContext db)
{
    var experience = await db.Experiences.FindAsync(id);
    
    if (experience is null)
        return Results.NotFound(ApiResponses.NotFound("Experience not found"));

    var dto = ExperienceDto.ToDto(experience);
    return Results.Ok(ApiResponses.Success(dto, "Experience retrieved successfully"));
}

private static async Task<IResult> GetExperiences(
    string? search, string? type, int page, int pageSize, bool? onlyActive, AppDbContext db)
{
    // ...filtering logic...
    
    return Results.Ok(ApiResponses.PaginatedSuccess(
        items, total, page, pageSize, 
        $"Retrieved {items.Count} experiences"));
}
```

### 3. Common Response Patterns

#### ? Success Responses
```csharp
// With data
return Results.Ok(ApiResponses.Success(data, "Operation successful"));

// Without data  
return Results.Ok(ApiResponses.Success("Operation completed"));

// Created response
var response = ApiResponses.Success(newItem, "Item created successfully");
return Results.Created($"/api/items/{newItem.Id}", response);
```

#### ? Error Responses
```csharp
// Not found
return Results.NotFound(ApiResponses.NotFound("Resource not found"));

// Validation error
return Results.BadRequest(ApiResponses.ValidationError("Invalid input data"));

// Generic error
return Results.BadRequest(ApiResponses.Error("Custom error", "Detailed message"));
```

#### ?? Paginated Responses
```csharp
return Results.Ok(ApiResponses.PaginatedSuccess(
    items,           // IEnumerable<T>
    total,           // int
    page,            // int  
    pageSize,        // int
    "Success message" // string (optional)
));
```

## Response Format Examples

### Single Item Response
```json
{
  "success": true,
  "data": {
    "id": "demo_video_01",
    "title": "Highlight MJ",
    "type": "Video",
    "mediaUrl": "https://cdn.example.com/video.mp4",
    "isActive": true,
    "createdAtUtc": "2024-01-01T00:00:00Z"
  },
  "error": null,
  "message": "Experience retrieved successfully"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "items": [/* array of items */]
  },
  "error": null,
  "message": "Retrieved 20 experiences"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "error": "Validation error",
  "message": "Title is required"
}
```

## Benefits of Migration

- ? **Consistent API responses** across all endpoints
- ? **Better error handling** with standardized error messages
- ? **Type safety** with generic response types
- ? **Client-friendly** predictable response structure
- ? **Organized code** with dedicated response folder
- ? **TypeScript compatibility** for frontend integration

## Quick Reference

| Scenario | Method | Example |
|----------|--------|---------|
| Success with data | `ApiResponses.Success<T>(data, message?)` | `ApiResponses.Success(user, "User found")` |
| Success without data | `ApiResponses.Success(message?)` | `ApiResponses.Success("Deleted successfully")` |
| Not found | `ApiResponses.NotFound(message?)` | `ApiResponses.NotFound("User not found")` |
| Validation error | `ApiResponses.ValidationError(message?)` | `ApiResponses.ValidationError("Invalid email")` |
| Paginated data | `ApiResponses.PaginatedSuccess<T>(items, total, page, size, message?)` | `ApiResponses.PaginatedSuccess(users, 100, 1, 20)` |

---

**Next Steps**: Update your controllers one by one, starting with the most critical endpoints. The old response format will still work, allowing for gradual migration.