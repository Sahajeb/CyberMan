using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyberManBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddUrlScanTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UrlScans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Malicious = table.Column<int>(type: "int", nullable: false),
                    Suspicious = table.Column<int>(type: "int", nullable: false),
                    Harmless = table.Column<int>(type: "int", nullable: false),
                    Undetected = table.Column<int>(type: "int", nullable: false),
                    RiskLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScannedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UrlScans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UrlScans_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UrlScans_UserId",
                table: "UrlScans",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UrlScans");
        }
    }
}
