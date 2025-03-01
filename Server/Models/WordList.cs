using System.Text.Json.Serialization;

namespace Server.Models;

public class WordList
{
    [JsonPropertyName("easy")]
    public List<string> Easy { get; set; }

    [JsonPropertyName("easy_med")]
    public List<string> EasyMed { get; set; }

    [JsonPropertyName("med")]
    public List<string> Med { get; set; }

    [JsonPropertyName("med_hard")]
    public List<string> MedHard { get; set; }

    [JsonPropertyName("hard")]
    public List<string> Hard { get; set; }
}