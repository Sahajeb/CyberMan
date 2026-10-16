using CyberManBackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CyberManBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UrlController : ControllerBase
    {
        private readonly VirusTotalService _vtService;
        AppDbContext _context;
        public UrlController(VirusTotalService vtService, AppDbContext context)
        {
            _vtService = vtService;
            _context = context;
        }

        [HttpPost("scan")]
        public async Task<IActionResult> Scan([FromBody] UrlScanRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Url))
                return BadRequest("Invalid URL.");

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                // STEP 1: Submit URL
                var submitResponse = await _vtService.SubmitUrlAsync(request.Url);

                using var submitJson = JsonDocument.Parse(submitResponse);

                var analysisId = submitJson.RootElement
                    .GetProperty("data")
                    .GetProperty("id")
                    .GetString();

                if (string.IsNullOrEmpty(analysisId))
                    return StatusCode(500, "Failed to retrieve analysis ID.");

                // STEP 2: Poll for completion
                string report = "";
                string status = "";
                int maxAttempts = 6;

                for (int i = 0; i < maxAttempts; i++)
                {
                    await Task.Delay(8000);

                    report = await _vtService.GetAnalysisAsync(analysisId);

                    using var tempJson = JsonDocument.Parse(report);

                    status = tempJson.RootElement
                        .GetProperty("data")
                        .GetProperty("attributes")
                        .GetProperty("status")
                        .GetString();

                    if (status == "completed")
                        break;
                }

                if (status != "completed")
                    return StatusCode(500, "Scan timeout.");

                // STEP 3: Extract stats safely
                using var reportJson = JsonDocument.Parse(report);

                var stats = reportJson.RootElement
                    .GetProperty("data")
                    .GetProperty("attributes")
                    .GetProperty("stats");

                int malicious = stats.TryGetProperty("malicious", out var m) ? m.GetInt32() : 0;
                int suspicious = stats.TryGetProperty("suspicious", out var s) ? s.GetInt32() : 0;
                int harmless = stats.TryGetProperty("harmless", out var h) ? h.GetInt32() : 0;
                int undetected = stats.TryGetProperty("undetected", out var u) ? u.GetInt32() : 0;

                string riskLevel = malicious > 0 ? "HIGH"
                                  : suspicious > 0 ? "MEDIUM"
                                  : "LOW";

                var urlScan = new UrlScan
                {
                    Url = request.Url,
                    Malicious = malicious,
                    Suspicious = suspicious,
                    Harmless = harmless,
                    Undetected = undetected,
                    RiskLevel = riskLevel,
                    UserId = userId,
                    ScannedAt = DateTime.UtcNow
                };

                _context.UrlScans.Add(urlScan);
                await _context.SaveChangesAsync();

                return Ok(urlScan);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"VirusTotal API error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
