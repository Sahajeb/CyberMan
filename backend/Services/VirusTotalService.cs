using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CyberManBackEnd.Services
{
    public class VirusTotalService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public VirusTotalService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["VirusTotal:ApiKey"];

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("x-apikey", _apiKey);
        }

        public async Task<string> SubmitUrlAsync(string url)
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("url", url)
            });

            var response = await _httpClient.PostAsync(
                "https://www.virustotal.com/api/v3/urls",
                content);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetAnalysisAsync(string analysisId)
        {
            var response = await _httpClient.GetAsync(
                $"https://www.virustotal.com/api/v3/analyses/{analysisId}");

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
        
    }
}
