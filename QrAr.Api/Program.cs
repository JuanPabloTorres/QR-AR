using QrAr.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Configure Services
builder.Services.AddQrArApiServices(builder.Configuration);

var app = builder.Build();

// Configure Middleware Pipeline
app.UseQrArMiddleware();

// Map API Endpoints
app.MapApiEndpoints();

// Initialize Database
await app.InitializeDatabaseAsync();

app.Run();








