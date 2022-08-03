using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class adjusDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShippingAddresss_Zip",
                table: "Orders",
                newName: "ShippingAddress_Zip");

            migrationBuilder.RenameColumn(
                name: "ShippingAddresss_State",
                table: "Orders",
                newName: "ShippingAddress_State");

            migrationBuilder.RenameColumn(
                name: "ShippingAddresss_FullName",
                table: "Orders",
                newName: "ShippingAddress_FullName");

            migrationBuilder.RenameColumn(
                name: "ShippingAddresss_Country",
                table: "Orders",
                newName: "ShippingAddress_Country");

            migrationBuilder.RenameColumn(
                name: "ShippingAddresss_City",
                table: "Orders",
                newName: "ShippingAddress_City");

            migrationBuilder.RenameColumn(
                name: "ShippingAddresss_Address2",
                table: "Orders",
                newName: "ShippingAddress_Address2");

            migrationBuilder.RenameColumn(
                name: "ShippingAddresss_Address1",
                table: "Orders",
                newName: "ShippingAddress_Address1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "b10b51e4-6682-4485-aad5-dd53b0d09bed");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "e011bbe9-c9cb-404f-8e1a-0d490569be54");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Zip",
                table: "Orders",
                newName: "ShippingAddresss_Zip");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_State",
                table: "Orders",
                newName: "ShippingAddresss_State");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_FullName",
                table: "Orders",
                newName: "ShippingAddresss_FullName");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Country",
                table: "Orders",
                newName: "ShippingAddresss_Country");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_City",
                table: "Orders",
                newName: "ShippingAddresss_City");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Address2",
                table: "Orders",
                newName: "ShippingAddresss_Address2");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Address1",
                table: "Orders",
                newName: "ShippingAddresss_Address1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "e29bae47-e52b-44b5-98c9-ee53725a1451");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "b881bbc6-d5e0-43cd-9f6e-b8cb171bd951");
        }
    }
}
