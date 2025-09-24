using Microsoft.EntityFrameworkCore;
using QrAr.Api.Models;

namespace QrAr.Api.DbContexts
{
    public sealed class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ExperienceRecord> Experiences => Set<ExperienceRecord>();

        public DbSet<AnalyticsEvent> Analytics => Set<AnalyticsEvent>();

        protected override void OnModelCreating(ModelBuilder b)
        {


            b.Entity<ExperienceRecord>().HasKey(x => x.Id);
            b.Entity<ExperienceRecord>().Property(x => x.Id).ValueGeneratedNever();
            b.Entity<ExperienceRecord>().HasIndex(x => x.CreatedAtUtc);

            b.Entity<AnalyticsEvent>().HasKey(x => x.Id);
            b.Entity<AnalyticsEvent>().HasIndex(x => new { x.ExperienceId, x.EventName, x.CreatedAtUtc });
        }
    }
}
