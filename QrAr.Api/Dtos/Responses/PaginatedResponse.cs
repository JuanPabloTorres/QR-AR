namespace QrAr.Api.Dtos.Responses
{
    /// <summary>
    /// Response wrapper for paginated data
    /// </summary>
    /// <typeparam name="T">Type of items in the paginated collection</typeparam>
    public sealed record PaginatedResponse<T>
    {
        public int Total { get; init; }
        public int Page { get; init; }
        public int PageSize { get; init; }
        public IEnumerable<T> Items { get; init; } = [];

        /// <summary>
        /// Creates a paginated response
        /// </summary>
        public static PaginatedResponse<T> Create(IEnumerable<T> items, int total, int page, int pageSize) =>
            new() 
            { 
                Items = items, 
                Total = total, 
                Page = page, 
                PageSize = pageSize 
            };

        /// <summary>
        /// Gets the total number of pages
        /// </summary>
        public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);

        /// <summary>
        /// Indicates if there's a next page
        /// </summary>
        public bool HasNextPage => Page < TotalPages;

        /// <summary>
        /// Indicates if there's a previous page
        /// </summary>
        public bool HasPreviousPage => Page > 1;
    }
}