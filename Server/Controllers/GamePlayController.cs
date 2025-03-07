using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Models;
using Server.Data;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/games")]
    [ApiController]
    public class GamePlayController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;


        public GamePlayController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;

        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllGames()
        {
            try
            {
                Console.WriteLine("GetAllGames method was called");

                var userEmail = User.Identity?.Name;
                if (string.IsNullOrEmpty(userEmail))
                {
                    Console.WriteLine("No email found in Identity.Name");
                    return Unauthorized("User email not found");
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    Console.WriteLine($"Could not find user with email: {userEmail}");
                    return Unauthorized("User not found");
                }

                var games = await _context.Games
                    .Where(g => g.UserId == user.Id)
                    .OrderByDescending(g => g.Id)
                    .Select(g => new GameDto
                    {
                        Id = g.Id,
                        UserId = g.UserId,
                        Status = g.Status,
                        Target = g.Target,
                        Guesses = g.Guesses,
                        View = g.View,
                        RemainingGuesses = g.RemainingGuesses
                    })
                    .ToListAsync();

                Console.WriteLine($"Found {games.Count} games for user {user.Id}");
                return Ok(games);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error in GetMyGames");
                return StatusCode(500, "An error occurred while fetching games");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateGame()
        {
            try
            {
                Console.WriteLine("CreateGame method was called");


                Console.WriteLine($"User.Identity.IsAuthenticated: {User.Identity?.IsAuthenticated}");
                Console.WriteLine($"User.Identity.Name: {User.Identity?.Name}");


                var userEmail = User.Identity?.Name;
                if (string.IsNullOrEmpty(userEmail))
                {
                    Console.WriteLine("No email found in Identity.Name");
                    return Unauthorized("User email not found");
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    Console.WriteLine($"Could not find user with email: {userEmail}");
                    return Unauthorized("User not found");
                }

                Console.WriteLine($"Found user with ID: {user.Id}");

                var wordListPath = Path.Combine("wwwroot", "Assets", "wordList.json");
                Console.WriteLine($"Word list path: {wordListPath}");

                if (!System.IO.File.Exists(wordListPath))
                {
                    Console.WriteLine($"Word list file not found at path: {wordListPath}");
                    return NotFound("Word list not found");
                }

                var json = await System.IO.File.ReadAllTextAsync(wordListPath);
                Console.WriteLine("Successfully read word list file");

                var wordLists = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json);
                if (wordLists == null)
                {
                    Console.WriteLine("Failed to deserialize word list - result was null");
                    return BadRequest("Failed to parse word list");
                }

                if (!wordLists.ContainsKey("med_hard"))
                {
                    Console.WriteLine("Word list does not contain 'med_hard' category");
                    return BadRequest("Word list for 'med_hard' is missing");
                }

                var words = wordLists["med_hard"];
                if (words == null || words.Count == 0)
                {
                    Console.WriteLine("'med_hard' word list is empty");
                    return BadRequest("Word list is empty");
                }

                var random = new Random();
                var targetWord = words[random.Next(words.Count)];
                Console.WriteLine($"Selected target word: {targetWord}");

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
                Console.WriteLine($"Successfully created game with ID: {game.Id}");

                return Ok(new GameDto
                {
                    Id = game.Id,
                    UserId = game.UserId,
                    Status = game.Status,
                    Target = game.Target,
                    Guesses = game.Guesses,
                    View = game.View,
                    RemainingGuesses = game.RemainingGuesses
                });
            }
            catch (Exception)
            {
                Console.WriteLine("Error in CreateGame");
                return StatusCode(500, "An error occurred while creating the game");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGame(int id)
        {
            try
            {
                Console.WriteLine($"GetGame method was called for ID: {id}");

                var userEmail = User.Identity?.Name;
                if (string.IsNullOrEmpty(userEmail))
                {
                    Console.WriteLine("No email found in Identity.Name");
                    return Unauthorized("User email not found");
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    Console.WriteLine($"Could not find user with email: {userEmail}");
                    return Unauthorized("User not found");
                }

                var game = await _context.Games.FindAsync(id);
                if (game == null)
                {
                    Console.WriteLine($"Game not found with ID: {id}");
                    return NotFound($"Game not found with ID: {id}");
                }

                if (game.UserId != user.Id)
                {
                    Console.WriteLine($"User {user.Id} attempted to access game {id} belonging to user {game.UserId}");
                    return Unauthorized("You do not have permission to access this game");
                }

                return Ok(new GameDto
                {
                    Id = game.Id,
                    UserId = game.UserId,
                    Status = game.Status,
                    Target = game.Target,
                    Guesses = game.Guesses,
                    View = game.View,
                    RemainingGuesses = game.RemainingGuesses
                });
            }
            catch (Exception)
            {
                Console.WriteLine($"Error in GetGame for ID: {id}");
                return StatusCode(500, "An error occurred while fetching the game");
            }
        }

        [HttpPost("{id}/guess")]
        public async Task<IActionResult> MakeGuess(int id, [FromBody] string guess)
        {
            try
            {
                Console.WriteLine($"MakeGuess method was called for game ID: {id} with guess: {guess}");

                if (string.IsNullOrEmpty(guess))
                {
                    return BadRequest("Guess cannot be empty");
                }

                var userEmail = User.Identity?.Name;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized("User email not found");
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    return Unauthorized("User not found");
                }

                var game = await _context.Games.FindAsync(id);
                if (game == null)
                {
                    return NotFound($"Game not found with ID: {id}");
                }

                if (game.UserId != user.Id)
                {
                    return Unauthorized("You do not have permission to access this game");
                }

                if (game.Status != "Unfinished")
                {
                    return BadRequest("Game is already finished");
                }


                if (guess.Length > 1)
                {
                    if (guess.Length != game.Target.Length)
                    {
                        return BadRequest($"Word guess must be {game.Target.Length} letters long");
                    }


                    game.RemainingGuesses--;

                    if (guess.ToLower() == game.Target.ToLower())
                    {
                        game.Status = "Won";
                        game.View = game.Target;
                    }
                    else if (game.RemainingGuesses <= 0)
                    {
                        game.Status = "Lost";
                    }
                }
                else
                {
                    if (game.Guesses.Contains(guess))
                    {
                        return BadRequest("Letter was already guessed");
                    }


                    game.Guesses += guess;


                    if (!game.Target.Contains(guess))
                    {
                        game.RemainingGuesses--;
                    }


                    var viewArray = game.View.ToCharArray();
                    for (int i = 0; i < game.Target.Length; i++)
                    {
                        if (game.Target[i].ToString().ToLower() == guess.ToLower())
                        {
                            viewArray[i] = game.Target[i];
                        }
                    }
                    game.View = new string(viewArray);


                    if (game.View == game.Target)
                    {
                        game.Status = "Won";
                    }
                    else if (game.RemainingGuesses <= 0)
                    {
                        game.Status = "Lost";
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new GameDto
                {
                    Id = game.Id,
                    UserId = game.UserId,
                    Status = game.Status,
                    Target = game.Target,
                    Guesses = game.Guesses,
                    View = game.View,
                    RemainingGuesses = game.RemainingGuesses
                });
            }
            catch (Exception)
            {
                Console.WriteLine($"Error in MakeGuess for game ID: {id}");
                return StatusCode(500, "An error occurred while processing the guess");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id)
        {
            try
            {
                Console.WriteLine($"DeleteGame method was called for ID: {id}");

                var userEmail = User.Identity?.Name;
                if (string.IsNullOrEmpty(userEmail))
                {
                    Console.WriteLine("No email found in Identity.Name");
                    return Unauthorized("User email not found");
                }

                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)
                {
                    Console.WriteLine($"Could not find user with email: {userEmail}");
                    return Unauthorized("User not found");
                }

                var game = await _context.Games.FindAsync(id);
                if (game == null)
                {
                    Console.WriteLine($"Game not found with ID: {id}");
                    return NotFound($"Game not found with ID: {id}");
                }

                if (game.UserId != user.Id)
                {
                    Console.WriteLine($"User {user.Id} attempted to delete game {id} belonging to user {game.UserId}");
                    return Unauthorized("You do not have permission to delete this game");
                }

                _context.Games.Remove(game);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully deleted game with ID: {id}");

                return Ok();
            }
            catch (Exception)
            {
                Console.WriteLine($"Error in DeleteGame for ID: {id}");
                return StatusCode(500, "An error occurred while deleting the game");
            }
        }
    }
}