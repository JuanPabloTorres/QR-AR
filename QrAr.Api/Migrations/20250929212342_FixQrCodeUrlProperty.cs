using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QrAr.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixQrCodeUrlProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "QRCodeUrl",
                table: "Experiences",
                newName: "QrCodeUrl");

            migrationBuilder.AlterColumn<string>(
                name: "QrCodeUrl",
                table: "Experiences",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "QrCodeUrl",
                table: "Experiences",
                newName: "QRCodeUrl");

            migrationBuilder.AlterColumn<string>(
                name: "QRCodeUrl",
                table: "Experiences",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);
        }
    }
}
