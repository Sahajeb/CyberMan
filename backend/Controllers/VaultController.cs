using CyberManBackEnd.DTOs;
using CyberManBackEnd.Models;
using CyberManBackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CyberManBackEnd.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VaultController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly VaultEncryptionService _encryption;

        public VaultController(AppDbContext context,
                               VaultEncryptionService encryption)
        {
            _context = context;
            _encryption = encryption;
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create(AddVaultDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var encrypted = _encryption.Encrypt(dto.Password);

            var vault = new CredentialVault
            {
                ApplicationName = dto.ApplicationName,
                Username = dto.Username,
                EncryptedPassword = encrypted,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.CredentialVaults.Add(vault);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // ================= GET =================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var data = await _context.CredentialVaults
                .Where(x => x.UserId == userId)
                .ToListAsync();

            var result = data.Select(x => new
            {
                id = x.Id,
                appName = x.ApplicationName,
                username = x.Username,
                password = _encryption.Decrypt(x.EncryptedPassword)
            });

            return Ok(result);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateVaultDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var entry = await _context.CredentialVaults
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entry == null)
                return NotFound();

            entry.ApplicationName = dto.ApplicationName;
            entry.Username = dto.Username;

            if (!string.IsNullOrEmpty(dto.Password))
                entry.EncryptedPassword = _encryption.Encrypt(dto.Password);

            entry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var entry = await _context.CredentialVaults
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entry == null)
                return NotFound();

            _context.CredentialVaults.Remove(entry);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}