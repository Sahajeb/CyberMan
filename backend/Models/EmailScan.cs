public class EmailScan
{
    public int Id { get; set; }

    public string SenderEmail { get; set; }
    public string Content { get; set; }

    public string Prediction { get; set; } // Safe / Phishing
    public double Confidence { get; set; }

    public DateTime ScannedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
}
