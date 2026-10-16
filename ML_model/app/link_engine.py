import re
from urllib.parse import urlparse

SHORTENERS = {"bit.ly", "tinyurl", "t.co", "is.gd", "cutt.ly",".xyz",".abc",".czy"}
TRUSTED_DOMAINS = {"chatgpt.com", "openai.com", "youtube.com", "google.com"}

def analyze_links(text: str) -> dict:
    urls = re.findall(r"https?://\S+", text)
    risk_score = 0.0

    for url in urls:
        domain = urlparse(url).netloc.lower()

        # Remove www
        domain = domain.replace("www.", "")

        # Trusted domains → no risk
        if domain in TRUSTED_DOMAINS:
            continue

        if any(s in domain for s in SHORTENERS):
            risk_score = max(risk_score, 0.7)

        if "@" in url:
            risk_score = max(risk_score, 0.8)

        if re.match(r"(\d{1,3}\.){3}\d{1,3}", domain):
            risk_score = max(risk_score, 0.9)

    return {
        "links_found": urls,
        "link_risk": round(risk_score, 2)
    }
