from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

start_ts = time.time()
app = FastAPI(title="CheckSync Backend")

# Allow the frontend to call the API (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
async def health():
    return {
        "status": "ok",
        "uptime_seconds": round(time.time() - start_ts, 2),
    }
