using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class productColorCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Colour_code",
                table: "ProductDetails",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Colour_code",
                table: "Colours",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "24ad002a-6ba3-4b77-b29b-f363a6080f1a");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "65eef68e-1591-404f-bd77-57b153d484ec");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Colour_code",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "Colour_code",
                table: "Colours");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "2c044595-e040-433b-9dc9-073c091612b8");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "d85efe77-d6eb-4732-ad9d-c02b8fd8ec8b");
        }
    }
}
