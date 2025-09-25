using Microsoft.EntityFrameworkCore;
using QrAr.Api.Models;

namespace QrAr.Api.DbContexts
{
    public sealed class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Experience> Experiences => Set<Experience>();

        public DbSet<AnalyticsEvent> Analytics => Set<AnalyticsEvent>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            b.Entity<Experience>().HasKey(x => x.Id);

            b.Entity<Experience>().Property(x => x.Id).ValueGeneratedNever();

            b.Entity<Experience>().HasIndex(x => x.CreatedAtUtc);

            b.Entity<AnalyticsEvent>().HasKey(x => x.Id);

            b.Entity<AnalyticsEvent>().HasIndex(x => new { x.ExperienceId, x.EventName, x.CreatedAtUtc });
        }
    }
}
