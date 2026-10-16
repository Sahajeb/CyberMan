from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from .ml_engine import predict_email
from .sender_engine import analyze_sender
from .link_engine import analyze_links
from .risk_engine import calculate_final_risk



# ✅ CREATE APP INSTANCE
app = FastAPI(title="CyberMan Phishing Detection API")

# ✅ ENABLE CORS (for HTML/JS frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Request Model
class ScanRequest(BaseModel):
    sender: str
    content: str

@app.get("/")
def ok():
    return "hello"
# ✅ Route
@app.post("/scan")
def scan_email(req: ScanRequest):
    ml_result = predict_email(req.content)
    sender_result = analyze_sender(req.sender)
    link_result = analyze_links(req.content)

    final = calculate_final_risk(ml_result, sender_result, link_result)

    return {
        "ml": ml_result,
        "sender": sender_result,
        "links": link_result,
        "final": final
    }
