namespace QrAr.Api.Dtos.Responses
{
    /// <summary>
    /// Standard API response wrapper for all endpoints
    /// </summary>
    /// <typeparam name="T">Type of the data being returned</typeparam>
    public sealed record ApiResponse<T>
    {
        public bool Success { get; init; }
        public T? Data { get; init; }
        public string? Error { get; init; }
        public string? Message { get; init; }

        /// <summary>
        /// Creates a successful response with data
        /// </summary>
        public static ApiResponse<T> SuccessResult(T data, string? message = null) =>
            new() { Success = true, Data = data, Message = message };

        /// <summary>
        /// Creates a successful response without data
        /// </summary>
        public static ApiResponse<T> SuccessResult(string? message = null) =>
            new() { Success = true, Message = message };

        /// <summary>
        /// Creates an error response
        /// </summary>
        public static ApiResponse<T> ErrorResult(string error, string? message = null) =>
            new() { Success = false, Error = error, Message = message };
    }
}