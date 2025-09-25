# API Response Models

?? **Location**: `QrAr.Api\Dtos\Responses\`  
?? **Namespace**: `QrAr.Api.Dtos.Responses`

## Overview

This folder contains standardized response wrapper models that provide consistent structure for all API endpoints in the QR AR API.

## Files

| File | Purpose | Description |
|------|---------|-------------|
| `ApiResponse.cs` | Generic response wrapper | Standardizes success/error responses with data |
| `PaginatedResponse.cs` | Pagination wrapper | Handles paginated data with metadata |
| `ApiResponses.cs` | Helper methods | Static convenience methods for common responses |

## Quick Start

### 1. Add Using Statement
```csharp
using QrAr.Api.Dtos.Responses;
```

### 2. Use in Controllers
```csharp
// Success response with data
return Results.Ok(ApiResponses.Success(data, "Operation successful"));

// Error response
return Results.BadRequest(ApiResponses.ValidationError("Invalid input"));

// Paginated response
return Results.Ok(ApiResponses.PaginatedSuccess(items, total, page, pageSize));
```

## Response Structure

### Standard Response
```json
{
  "success": true | false,
  "data": T | null,
  "error": "string" | null,
  "message": "string" | null
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "items": [...]
  },
  "message": "Retrieved successfully"
}
```

## Benefits

- ? **Consistency**: All endpoints use the same response format
- ? **Type Safety**: Generic types ensure compile-time checking
- ? **Client-Friendly**: Predictable structure for frontend integration
- ? **Error Handling**: Standardized error responses
- ? **Pagination**: Built-in pagination metadata

## TypeScript Compatibility

These models are fully compatible with TypeScript interfaces:

```typescript
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: T[];
};
```