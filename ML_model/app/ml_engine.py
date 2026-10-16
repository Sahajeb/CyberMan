import re
import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

MODEL_PATH = "model/cyberman-phishing-model"

tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

# -----------------------------
# Clean text so ML learns intent, not links
# -----------------------------
def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+", "", text)        # remove URLs
    text = re.sub(r"\S+@\S+", "", text)        # remove emails
    text = re.sub(r"\d+", "", text)            # remove numbers
    text = re.sub(r"[^\w\s]", "", text)        # remove punctuation
    text = re.sub(r"\s+", " ", text).strip()
    return text

def predict_email(text: str) -> dict:
    cleaned_text = clean_text(text)

    inputs = tokenizer(
        cleaned_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256
    )

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)

    phishing_score = probs[0][1].item()

    # REALISTIC enterprise thresholds
    if phishing_score >= 0.90:
        verdict = "PHISHING"
    elif phishing_score >= 0.60:
        verdict = "SUSPICIOUS"
    else:
        verdict = "SAFE"

    return {
        "cleaned_text": cleaned_text,
        "phishing_score": round(phishing_score, 4),
        "ml_verdict": verdict,
        "is_phishing": verdict == "PHISHING"
    }
