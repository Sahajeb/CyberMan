public class UrlScan
{
    public int Id { get; set; }

    public string Url { get; set; }

    public int Malicious { get; set; }
    public int Suspicious { get; set; }
    public int Harmless { get; set; }
    public int Undetected { get; set; }

    public string RiskLevel { get; set; }

    public DateTime ScannedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key
    public string UserId { get; set; }

    // Navigation Property
    public ApplicationUser User { get; set; }
}
