import os
from dotenv import load_dotenv
from supabase import create_client
import google.generativeai as genai

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase environment variables missing")

if not GEMINI_API_KEY:
    raise ValueError("Gemini API key missing")

# Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ✅ Correct Gemini setup
genai.configure(api_key=GEMINI_API_KEY)

# Create model instance (instead of Client)
model = genai.GenerativeModel("gemini-1.5-flash")

print("Config loaded successfully 🚀")