using Microsoft.AspNetCore.Identity;

namespace Server.Models;

public class EmailLoginDetails{
  public string Email { get; set; }
  public string Password { get; set; }
}