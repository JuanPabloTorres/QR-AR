using Microsoft.EntityFrameworkCore;
using QrAr.Api.Controllers;
using QrAr.Api.DbContexts;
using QrAr.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// CORS: en dev permitimos Next.js local; en prod, el dominio WebAR
string[] allowedOrigins = new[]
{
    "http://localhost:3000",       // Next.js (admin) en desarrollo
     "http://localhost:3001",      // Next.js (WebAR) en desarrollo
    "https://ar.tu-dominio.com",   // WebAR (producción)
      "https://qr-ar-webar-jstllshmq-juan-p-torres-torres-projects.vercel.app", // WebAR (Vercel)
};

builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlite("Data Source=qr_ar.db"));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(o =>
{
    o.AddPolicy("default", p => p
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("default");   // habilita CORS

app.UseSwagger();

app.UseSwaggerUI();

// ----------- Map Controllers -----------
app.MapExperiencesEndpoints();
app.MapAnalyticsEndpoints();

// ----------- Migración + Seed al arrancar -----------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();

    if (!db.Experiences.Any())
    {
        db.Experiences.Add(new ExperienceRecord
        {
            Id = "demo_video_01",
            Title = "Highlight MJ",
            Type = "Video", // "Video" | "Model3D" | "Message"
            MediaUrl = "https://cdn.tu-dominio/video/highlight.mp4",
            ThumbnailUrl = "https://cdn.tu-dominio/thumbs/highlight.jpg",
            IsActive = true
        });
        db.SaveChanges();
    }
}

app.Run();








