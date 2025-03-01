using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Server.Models;

namespace Server.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
    {
      _signInManager = signInManager;
      _userManager = userManager;
    }






    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] EmailLoginDetails details)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var user = new ApplicationUser { UserName = details.Email, Email = details.Email };

      var result = await _userManager.CreateAsync(user, details.Password);

      if (!result.Succeeded)
      {
          List<string> errors = result.Errors.Select(e => e.Description).ToList();
          return BadRequest(new { errors });
      }

      return Ok(new { Id = user.Id, Email = user.Email });
    }

    [AllowAnonymous]
    [HttpGet("test")]
    public IActionResult Test()
    {
      return Ok(new { message = "Working" });
    }


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] EmailLoginDetails details)
    {
      if (!ModelState.IsValid) return BadRequest(new { error = "Invalid input" });

      var user = await _userManager.FindByEmailAsync(details.Email);
      if (user == null)
      {
        return BadRequest(new { error = $"User not found {details.Email}" });
      }

      var result = await _signInManager.PasswordSignInAsync(user.UserName, details.Password, false, false);
      if (!result.Succeeded)
      {
        return Unauthorized(new { error = "Invalid credentials" });
      }

      
      return Ok(new { Id = user.Id, Email = user.Email, Token = "fake_jwt_token" }); 
    }


    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
      await _signInManager.SignOutAsync();
      return Ok(new { message = "Logout Successful" });
    }
      }
}
