
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Server.Models;

public class Game
{
    [Key]
    public int Id { get; set; }


    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; }
    public string? UserId { get; set; }

    [Required]
    public string Status { get; set; }

    [Required]
    public string Target { get; set; }

    public string Guesses { get; set; } = "";
    public string View { get; set; }
    public int RemainingGuesses { get; set; } = 8;


}