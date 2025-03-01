using Microsoft.AspNetCore.Identity;

namespace Server.Models;

public class ApplicationUser : IdentityUser {
    public virtual ICollection<Game> Games { get; set; } = new List<Game>();
}
