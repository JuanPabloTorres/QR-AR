using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrAr.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddModel3DFieldsToExperiences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ModelData",
                table: "Experiences",
                type: "BLOB",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModelFileName",
                table: "Experiences",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModelFormat",
                table: "Experiences",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ModelSize",
                table: "Experiences",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Analytics",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModelData",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "ModelFileName",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "ModelFormat",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "ModelSize",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Analytics");
        }
    }
}
