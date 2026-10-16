def calculate_final_risk(ml, sender, link):
    final_score = (
        ml["phishing_score"] * 0.5 +
        sender["sender_risk"] * 0.25 +
        link["link_risk"] * 0.25
    )

    # More realistic thresholds
    if final_score >= 0.75:
        verdict = "PHISHING"
    elif final_score >= 0.45:
        verdict = "SUSPICIOUS"
    else:
        verdict = "SAFE"

    return {
        "final_risk_score": round(final_score, 2),
        "verdict": verdict
    }
