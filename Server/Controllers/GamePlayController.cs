using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Models;
using Server.Data;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace Server.Controllers
{
    [Authorize] 
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

        [HttpPost]
        public async Task<IActionResult> CreateGame()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            
            var wordListPath = Path.Combine(_env.WebRootPath, "assets", "wordList.json");
            if (!System.IO.File.Exists(wordListPath))
                return NotFound("Word list not found");

            var json = await System.IO.File.ReadAllTextAsync(wordListPath);
            var words = JsonSerializer.Deserialize<List<string>>(json);
            if (words == null || words.Count == 0)
                return BadRequest("Word list is empty");

            
            var random = new Random();
            var targetWord = words[random.Next(words.Count)];

            
            var game = new Game
            {
                UserId = user.Id,
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
                UserId = game.UserId,
                Status = game.Status,
                View = game.View,
                RemainingGuesses = game.RemainingGuesses
            });
        }
    }
}
