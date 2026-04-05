from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import upload, invoices, analytics
import time

app = FastAPI(
    title="Invoice Extraction AI",
    description="AI-powered invoice OCR and data extraction API",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── REQUEST LOGGING ──────────────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    ms = round((time.time() - start) * 1000, 2)
    print(f"[{request.method}] {request.url.path} → {response.status_code} ({ms}ms)")
    return response

# ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"❌ Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"}
    )

# ─── ROUTES ───────────────────────────────────────────────────────────────────
app.include_router(upload.router,    prefix="/api/upload",    tags=["Upload"])
app.include_router(invoices.router,  prefix="/api/invoices",  tags=["Invoices"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

# ─── HEALTH ───────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Invoice AI is running 🚀"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
