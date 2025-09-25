# API Response Models

?? **New Location**: The API response models have been moved to a dedicated folder!

## ?? Current Organization

```
QrAr.Api/
??? Dtos/
    ??? Responses/                    # ?? API Response Models
    ?   ??? ApiResponse.cs               # Generic API response wrapper
    ?   ??? PaginatedResponse.cs         # Paginated data response
    ?   ??? ApiResponses.cs              # Static helper methods
    ?   ??? README.md                    # Detailed documentation
    ?   ??? MIGRATION_GUIDE.md           # Step-by-step migration guide
    ??? ExperienceDto.cs              # Experience DTOs
    ??? ExperienceCreateUpdateDto.cs  
    ??? README.md                     # This file
```

## ?? Quick Start

### Import the namespace:
```csharp
using QrAr.Api.Dtos.Responses;
```

### Use in your controllers:
```csharp
// Success response
return Results.Ok(ApiResponses.Success(data, "Operation successful"));

// Error response  
return Results.BadRequest(ApiResponses.ValidationError("Invalid input"));

// Paginated response
return Results.Ok(ApiResponses.PaginatedSuccess(items, total, page, pageSize));
```

## ?? Documentation

- **?? [Detailed Documentation](./Responses/README.md)** - Complete API reference
- **?? [Migration Guide](./Responses/MIGRATION_GUIDE.md)** - Step-by-step implementation
- **?? [Response Examples](./Responses/README.md#response-structure)** - JSON response formats

## ? Benefits

- ? **Organized Structure**: Dedicated folder for response models
- ? **Consistent Responses**: Standardized format across all endpoints  
- ? **Type Safety**: Generic types with compile-time checking
- ? **Easy Migration**: Gradual adoption without breaking changes
- ? **Client-Friendly**: Predictable structure for frontend integration
- ? **TypeScript Ready**: Compatible with frontend TypeScript interfaces

## ?? Available Response Types

| Type | Purpose | Usage |
|------|---------|--------|
| `ApiResponse<T>` | Standard wrapper | `ApiResponses.Success(data)` |
| `PaginatedResponse<T>` | Paginated data | `ApiResponses.PaginatedSuccess(items, total, page, size)` |
| Helper Methods | Quick responses | `ApiResponses.NotFound()`, `ApiResponses.ValidationError()` |

---

**?? Ready to migrate?** Check the [Migration Guide](./Responses/MIGRATION_GUIDE.md) for detailed steps!