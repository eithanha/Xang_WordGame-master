using Microsoft.AspNetCore.Mvc;
using System.Text.Json;


[ApiController]
[Route("http:/localhost:5000/assets/wordList.json")]
public class WordListController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public WordListController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet]
    public IActionResult GetWordList()
    {
        var filePath = Path.Combine(_env.ContentRootPath, "Data", "wordList.json");
        if (!System.IO.File.Exists(filePath))
        {
            return NotFound("Word list file not found.");
        }

        var jsonData = System.IO.File.ReadAllText(filePath);
        var wordList = JsonSerializer.Deserialize<Server.Models.WordList>(jsonData);

        return Ok(wordList);
    }
}
