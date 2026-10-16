namespace CyberManBackEnd.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalEmailScans { get; set; }
        public int TotalUrlScans { get; set; }
        public int VaultItems { get; set; }

        public int PhishingEmails { get; set; }
        public int SafeEmails { get; set; }

        public int HighRiskUrls { get; set; }
        public int MediumRiskUrls { get; set; }
        public int LowRiskUrls { get; set; }

        public List<RecentActivityDto> RecentActivities { get; set; }

    }
    public class RecentActivityDto
    {
        public string Type { get; set; }
        public string Target { get; set; }
        public string Result { get; set; }
        public string RiskLevel { get; set; }
        public DateTime Time { get; set; }
    }
}
