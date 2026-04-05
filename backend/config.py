import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# ─── ENV VARIABLES ────────────────────────────────────────────────────────────
SUPABASE_URL       = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY       = os.getenv("SUPABASE_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# ─── STARTUP VALIDATION ───────────────────────────────────────────────────────
missing = []
if not SUPABASE_URL:       missing.append("SUPABASE_URL")
if not SUPABASE_KEY:       missing.append("SUPABASE_KEY")
if not OPENROUTER_API_KEY: missing.append("OPENROUTER_API_KEY")

if missing:
    raise EnvironmentError(
        f"❌ Missing required environment variables: {', '.join(missing)}\n"
        f"   Add them to your .env file (local) or Render environment (production)."
    )

# ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("✅ Config loaded — Supabase + OpenRouter ready 🚀")
