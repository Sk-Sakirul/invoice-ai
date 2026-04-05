import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# ---------------------------
# 🔐 ENV VARIABLES
# ---------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ---------------------------
# ⚠️ VALIDATION
# ---------------------------
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase environment variables missing")

if not OPENROUTER_API_KEY:
    print("⚠️ Warning: OPENROUTER_API_KEY not set")

# ---------------------------
# 🗄️ SUPABASE CLIENT
# ---------------------------
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("✅ Config loaded successfully 🚀")