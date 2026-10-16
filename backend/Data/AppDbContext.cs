using CyberManBackEnd.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    public DbSet<EmailScan> EmailScans { get; set; }
    public DbSet<UrlScan> UrlScans { get; set; }
    public DbSet<CredentialVault> CredentialVaults { get; set; }


}

