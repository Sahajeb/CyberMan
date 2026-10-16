namespace CyberManBackEnd.Models
{
    public class CredentialVault
    {
        public int Id { get; set; }

        public string ApplicationName { get; set; }

        public string Username { get; set; }

        public string EncryptedPassword { get; set; }

        public string UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
