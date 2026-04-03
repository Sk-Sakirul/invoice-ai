from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, invoices, analytics

app = FastAPI(title="Invoice Extraction AI")

# Same as CORS in Express
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Same as app.use('/api/upload', router) in Express
app.include_router(upload.router, prefix="/api/upload")
app.include_router(invoices.router, prefix="/api/invoices")
app.include_router(analytics.router, prefix="/api/analytics")

@app.get("/")
def root():
    return {"status": "Invoice AI running"}