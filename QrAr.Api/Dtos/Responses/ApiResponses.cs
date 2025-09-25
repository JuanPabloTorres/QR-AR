namespace QrAr.Api.Dtos.Responses
{
    /// <summary>
    /// Common response types for typical API operations
    /// </summary>
    public static class ApiResponses
    {
        /// <summary>
        /// Standard success response without data
        /// </summary>
        public static ApiResponse<object> Success(string? message = null) =>
            ApiResponse<object>.SuccessResult(message);

        /// <summary>
        /// Standard success response with data
        /// </summary>
        public static ApiResponse<T> Success<T>(T data, string? message = null) =>
            ApiResponse<T>.SuccessResult(data, message);

        /// <summary>
        /// Standard error response
        /// </summary>
        public static ApiResponse<object> Error(string error, string? message = null) =>
            ApiResponse<object>.ErrorResult(error, message);

        /// <summary>
        /// Not found error response
        /// </summary>
        public static ApiResponse<object> NotFound(string? message = null) =>
            ApiResponse<object>.ErrorResult("Not found", message ?? "The requested resource was not found");

        /// <summary>
        /// Validation error response
        /// </summary>
        public static ApiResponse<object> ValidationError(string? message = null) =>
            ApiResponse<object>.ErrorResult("Validation error", message ?? "The request contains invalid data");

        /// <summary>
        /// Internal server error response
        /// </summary>
        public static ApiResponse<object> InternalError(string? message = null) =>
            ApiResponse<object>.ErrorResult("Internal server error", message ?? "An unexpected error occurred");

        /// <summary>
        /// Paginated success response
        /// </summary>
        public static ApiResponse<PaginatedResponse<T>> PaginatedSuccess<T>(
            IEnumerable<T> items, 
            int total, 
            int page, 
            int pageSize, 
            string? message = null) =>
            ApiResponse<PaginatedResponse<T>>.SuccessResult(
                PaginatedResponse<T>.Create(items, total, page, pageSize), 
                message);
    }
}