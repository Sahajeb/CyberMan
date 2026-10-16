using System.Text.Json.Serialization;

public class FastApiResponse
{
    [JsonPropertyName("ml")]
    public MlResult Ml { get; set; }

    [JsonPropertyName("sender")]
    public SenderResult Sender { get; set; }

    [JsonPropertyName("links")]
    public LinksResult Links { get; set; }

    [JsonPropertyName("final")]
    public FinalResult Final { get; set; }
}

public class MlResult
{
    [JsonPropertyName("cleaned_text")]
    public string CleanedText { get; set; }

    [JsonPropertyName("phishing_score")]
    public double PhishingScore { get; set; }

    [JsonPropertyName("ml_verdict")]
    public string MlVerdict { get; set; }

    [JsonPropertyName("is_phishing")]
    public bool IsPhishing { get; set; }
}

public class SenderResult
{
    [JsonPropertyName("sender")]
    public string Sender { get; set; }

    [JsonPropertyName("sender_risk")]
    public double SenderRisk { get; set; }
}

public class LinksResult
{
    [JsonPropertyName("links_found")]
    public List<string> LinksFound { get; set; }

    [JsonPropertyName("link_risk")]
    public double LinkRisk { get; set; }
}

public class FinalResult
{
    [JsonPropertyName("final_risk_score")]
    public double FinalRiskScore { get; set; }

    [JsonPropertyName("verdict")]
    public string Verdict { get; set; }
}
