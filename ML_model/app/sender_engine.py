TRUSTED_PROVIDERS = {
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com"
}

SUSPICIOUS_TLDS = {
    ".ru",
    ".tk",
    ".xyz",
    ".click",
    ".abcd",
    ".Com",
    ".cOm",
    ".coM"
}

def analyze_sender(sender_email: str) -> dict:
    domain = sender_email.split("@")[-1].lower()

    # Trusted email providers
    if domain in TRUSTED_PROVIDERS:
        risk = 0.1

    # Suspicious TLDs
    elif any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
        risk = 0.8

    # Custom / corporate domains (unknown but not bad)
    else:
        risk = 0.2

    return {
        "sender": sender_email,
        "sender_risk": risk
    }
