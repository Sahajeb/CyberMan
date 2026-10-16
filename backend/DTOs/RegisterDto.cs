using System.ComponentModel.DataAnnotations;

public class RegisterDto
{
    [Required]
    [RegularExpression(
        @"^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$",
        ErrorMessage = "Email must start with a letter and follow a valid email format."
    )]
    [EmailAddress]
    public string EmailAddress { get; set; }

    [Required]
    public string FullName { get; set; }

    [Required]
    [MinLength(6)]
    public string Password { get; set; }
}
