using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

[ApiController]
[Route("api/scan")]
[Authorize] // 🔒 Always protect this
public class ScanController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<ScanController> _logger;

    public ScanController(
        AppDbContext context,
        IHttpClientFactory httpClientFactory,
        UserManager<ApplicationUser> userManager,
        ILogger<ScanController> logger)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> ScanEmail(ScanRequestDto model)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
            return Unauthorized("User not found from token");


        var client = _httpClientFactory.CreateClient();
        var fastApiUrl = "http://127.0.0.1:8000/scan";

        var json = JsonSerializer.Serialize(new
        {
            sender = model.SenderEmail,
            content = model.Content
        });

        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(fastApiUrl, httpContent);

        if (!response.IsSuccessStatusCode)
            return StatusCode(503, "FastAPI service unavailable");

        var resultString = await response.Content.ReadAsStringAsync();

        var fastApiResponse = JsonSerializer.Deserialize<FastApiResponse>(
            resultString,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        if (fastApiResponse == null || fastApiResponse.Final == null)
            return StatusCode(500, "Invalid response from FastAPI");

        var scan = new EmailScan
        {
            SenderEmail = model.SenderEmail,
            Content = model.Content,
            Prediction = fastApiResponse.Final.Verdict,
            Confidence = fastApiResponse.Final.FinalRiskScore*100,
            UserId = user.Id, // ✅ link to logged user
            ScannedAt = DateTime.UtcNow
        };

        // 🔥 SAVE TO DATABASE
        _context.EmailScans.Add(scan);
        await _context.SaveChangesAsync();

        return Ok(scan);
    }
    
    


}
