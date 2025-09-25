using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrAr.Api.Migrations
{
    /// <inheritdoc />
    public partial class updateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Experiences",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "QRCodeUrl",
                table: "Experiences",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAtUtc",
                table: "Experiences",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Experiences",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Analytics",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Analytics",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAtUtc",
                table: "Analytics",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "Analytics",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "QRCodeUrl",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "UpdatedAtUtc",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Analytics");

            migrationBuilder.DropColumn(
                name: "UpdatedAtUtc",
                table: "Analytics");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Analytics");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Analytics",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);
        }
    }
}
