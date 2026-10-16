using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtService _jwtService;
    private readonly IConfiguration _configuration;
    public AuthController(UserManager<ApplicationUser> userManager, JwtService jwtService, IConfiguration configuration)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new ApplicationUser
        {
            UserName = model.EmailAddress,
            Email = model.EmailAddress,
            FullName = model.FullName
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var token = _jwtService.GenerateToken(user);

        return Ok(new { token, message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return Unauthorized("Invalid credentials");

        var token = _jwtService.GenerateToken(user);

        return Ok(new { token });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin(GoogleDto model)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new List<string>
        {
            _configuration["Google:ClientId"]
        }
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(model.IdToken, settings);

        var user = await _userManager.FindByEmailAsync(payload.Email);

        if (user == null)
        {
            user = new ApplicationUser
            {
                Email = payload.Email,
                UserName = payload.Email,
                FullName = payload.Name,
                EmailConfirmed = true
            };

            await _userManager.CreateAsync(user);
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new { token });
    }
    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        return Ok(new
        {
            fullName = User.FindFirstValue(ClaimTypes.Name),
            email = User.FindFirstValue(ClaimTypes.Email)
        });
    }

}
