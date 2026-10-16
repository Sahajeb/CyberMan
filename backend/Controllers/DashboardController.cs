
using CyberManBackEnd.DTOs;
using Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CyberManBackEnd.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();


            var totalEmail = await _context.EmailScans
                .Where(x => x.UserId == userId)
                .CountAsync();

            var totalUrl = await _context.UrlScans
                .Where(x => x.UserId == userId)
                .CountAsync();

            var vaultItems = await _context.CredentialVaults
                .Where(x => x.UserId == userId)
                .CountAsync();

            var phishingEmails = await _context.EmailScans
                .Where(x => x.UserId == userId && x.Prediction == "Phishing")
                .CountAsync();

            var safeEmails = await _context.EmailScans
                .Where(x => x.UserId == userId && x.Prediction == "Safe")
                .CountAsync();

            var highRisk = await _context.UrlScans
                .Where(x => x.UserId == userId && x.RiskLevel == "High")
                .CountAsync();

            var mediumRisk = await _context.UrlScans
                .Where(x => x.UserId == userId && x.RiskLevel == "Medium")
                .CountAsync();

            var lowRisk = await _context.UrlScans
                .Where(x => x.UserId == userId && x.RiskLevel == "Low")
                .CountAsync();

            // Recent URL Scans
            var recentUrls = await _context.UrlScans
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.ScannedAt)
                .Take(5)
                .Select(x => new RecentActivityDto
                {
                    Type = "URL Scan",
                    Target = x.Url,
                    Result = x.RiskLevel,
                    RiskLevel = x.RiskLevel,
                    Time = x.ScannedAt
                })
                .ToListAsync();

            // Recent Email Scans
            var recentEmails = await _context.EmailScans
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.ScannedAt)
                .Take(5)
                .Select(x => new RecentActivityDto
                {
                    Type = "Email Scan",
                    Target = x.SenderEmail,
                    Result = x.Prediction,
                    RiskLevel = x.Prediction,
                    Time = x.ScannedAt
                })
                .ToListAsync();

            var activities = recentUrls
                .Concat(recentEmails)
                .OrderByDescending(x => x.Time)
                .Take(8)
                .ToList();

            var response = new DashboardStatsDto
            {
                TotalEmailScans = totalEmail,
                TotalUrlScans = totalUrl,
                VaultItems = vaultItems,

                PhishingEmails = phishingEmails,
                SafeEmails = safeEmails,

                HighRiskUrls = highRisk,
                MediumRiskUrls = mediumRisk,
                LowRiskUrls = lowRisk,

                RecentActivities = activities
            };

            return Ok(response);
        }
    }
}