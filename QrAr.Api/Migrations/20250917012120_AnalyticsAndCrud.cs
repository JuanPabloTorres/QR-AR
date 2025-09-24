using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrAr.Api.Migrations
{
    /// <inheritdoc />
    public partial class AnalyticsAndCrud : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Analytics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ExperienceId = table.Column<string>(type: "TEXT", nullable: false),
                    EventName = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analytics", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Experiences_CreatedAtUtc",
                table: "Experiences",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Analytics_ExperienceId_EventName_CreatedAtUtc",
                table: "Analytics",
                columns: new[] { "ExperienceId", "EventName", "CreatedAtUtc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analytics");

            migrationBuilder.DropIndex(
                name: "IX_Experiences_CreatedAtUtc",
                table: "Experiences");
        }
    }
}
