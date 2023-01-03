using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PD4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColourValue",
                table: "ProductDetails",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SizeValue",
                table: "ProductDetails",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "3a5bca24-d6aa-44aa-b708-035564e20daf");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "28586319-d240-4f9a-9ae1-f422be659d38");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColourValue",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "SizeValue",
                table: "ProductDetails");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "df412354-0e94-4beb-856c-03ae643966aa");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "57451433-a8f9-48c8-a9fe-aa03669220af");
        }
    }
}
