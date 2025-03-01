using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Models;
using Server.Data;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using System.Security.Claims;

namespace Server.Controllers
{
    //[Authorize] 
    [Route("api/games")]
    [ApiController]
    public class GamePlayController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;

        public GamePlayController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
        {
            _context = context;
            _userManager = userManager;
            _env = env;
        }

        // [AllowAnonymous]
        // [HttpPost]
      
    //     public async Task<IActionResult> CreateGame()
    //     {
    //         Console.WriteLine("CreateGame method was called");


    //         var token = Request.Headers["Authorization"].ToString().Split(" ").Last();
    //         Console.WriteLine($"Received Token: {token}");

    //         var authorizationHeader = Request.Headers["Authorization"].ToString();

    //         Console.WriteLine("Moving on");

    //         if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
    //         {
    //             Console.WriteLine("Token is missing or not in correct format.");
    //             return Unauthorized("No token provided.");
    //         }
    //         Console.WriteLine("Moving on Again");
    //         var token1 = authorizationHeader.Split(" ").Last();
    //         Console.WriteLine($"Received Token: {token1}");

    //         if (string.IsNullOrEmpty(token))
    //             {
    //                 Console.WriteLine("Token is missing.");
    //                 return Unauthorized("No token provided.");
    //             }

    //         Console.WriteLine("Moving on Once More");
    //         var user = await _userManager.GetUserAsync(User);
    //         Console.WriteLine("Moving on to User == Null Line 59");
    //         //if (user == null) return Unauthorized();

    //         Console.WriteLine("Moving on to user == null at line 63");

    //         if (user == null) 
    //         {
    //             Console.WriteLine("Unauthorized: User not found.");
    //             return Unauthorized("User not authenticated.");
    //         }
    //         Console.WriteLine("Moving on to user Email");
    //         Console.WriteLine($"Authenticated User: {user.Email}");
            
    //         var wordListPath = Path.Combine(_env.WebRootPath, "assets", "wordList.json");
    //         if (!System.IO.File.Exists(wordListPath))
    //             return NotFound("Word list not found");

    //         var json = await System.IO.File.ReadAllTextAsync(wordListPath);
    //         var words = JsonSerializer.Deserialize<List<string>>(json);
    //         if (words == null || words.Count == 0)
    //             return BadRequest("Word list is empty");

            
    //         var random = new Random();
    //         var targetWord = words[random.Next(words.Count)];

            
    //         var game = new Game
    //         {
    //             UserId = user.Id,
    //             Status = "Unfinished",
    //             Target = targetWord,
    //             Guesses = "",
    //             View = new string('_', targetWord.Length),
    //             RemainingGuesses = 8
    //         };

    //         _context.Games.Add(game);
    //         await _context.SaveChangesAsync();

    //         return Ok(new GameDto
    //         {
    //             Id = game.Id,
    //             UserId = game.UserId,
    //             Status = game.Status,
    //             View = game.View,
    //             RemainingGuesses = game.RemainingGuesses
    //         });
    //     }
    // }


  [AllowAnonymous] // Allow anonymous access to this endpoint
[HttpPost]
public async Task<IActionResult> CreateGame()
{
    Console.WriteLine("CreateGame method was called");

    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    Console.WriteLine("User ID: " + userId); // Log the user ID to verify

    if (string.IsNullOrEmpty(userId))
    {
        return BadRequest("User not authenticated");
    }


    
    // No need to check for token or user authentication now
    var wordListPath = Path.Combine(_env.WebRootPath, "assets", "wordList.json");
    if (!System.IO.File.Exists(wordListPath))
        return NotFound("Word list not found");

    var json = await System.IO.File.ReadAllTextAsync(wordListPath);
    
    // Deserialize to a dictionary
    var wordLists = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json);
    if (wordLists == null || !wordLists.ContainsKey("easy"))
        return BadRequest("Word list for 'easy' is missing or empty.");

    var words = wordLists["easy"]; // Extract the 'easy' word list
    if (words == null || words.Count == 0)
        return BadRequest("Word list is empty");

    var random = new Random();
    var targetWord = words[random.Next(words.Count)];


   
Console.WriteLine("Word list JSON: " + json); // Log the JSON data




Console.WriteLine("Words in easy list: " + string.Join(", ", words)); 

    //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    var game = new Game
    {
        UserId = userId,
        Status = "Unfinished",
        Target = targetWord,
        Guesses = "",
        View = new string('_', targetWord.Length),
        RemainingGuesses = 8
    };

    _context.Games.Add(game);
    await _context.SaveChangesAsync();

    return Ok(new GameDto
    {
        Id = game.Id,
        Status = game.Status,
        View = game.View,
        RemainingGuesses = game.RemainingGuesses
    });
}
    }
}