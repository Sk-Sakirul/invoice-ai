import os
from dotenv import load_dotenv
from supabase import create_client
from google import genai

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

# ✅ NEW Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

print("Config loaded successfully 🚀")