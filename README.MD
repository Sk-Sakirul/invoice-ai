# Invoice AI — Intelligent Invoice Processing System

An AI-powered full-stack application that extracts structured data from invoices using OCR and AI, stores it in a database, detects duplicates, and provides analytics through a modern dashboard.

## 🌐 Live Demo
🔗 Frontend: https://your-frontend-url.vercel.app
🔗 Backend API: https://your-backend-url.onrender.com

## 📦 GitHub Repository
🔗 https://github.com/Sk-Sakirul/invoice-ai.git

## 🧪 Test Data
Sample invoices used for testing are included in:

`/test-data/`

You can upload:
PDF invoices
JPG / PNG invoices

## 🏗 System Architecture
```
Frontend (React + Tailwind)
        ↓
FastAPI Backend (API Layer)
        ↓
Services Layer
  ├── OCR (Tesseract + pdf2image)
  ├── LLM (Gemini / Mock AI)
        ↓
Supabase
  ├── Database (PostgreSQL)
  └── Storage (Files)
```

## ⚙️ Tech Stack
### Frontend
React (Vite) <br>
Tailwind CSS <br>
React Router <br>
Recharts

### Backend
FastAPI (Python) <br>
Tesseract OCR <br>
pdf2image <br>
Gemini API (LLM parsing) <br>
Supabase (DB + Storage)

## ✨ Features
### 📤 Invoice Upload
Upload PDF, JPG, PNG
File stored in Supabase Storage
Status tracking (processing → done)

### 🔍 OCR Extraction
Extracts text using Tesseract,
Supports multi-page PDFs

### 🤖 AI Parsing
Converts raw OCR text into structured JSON
#### Extracts:
Vendor name <br>
Invoice number <br>
Dates <br>
Amounts <br>
Line items <br>
Confidence score included <br>

🔁 Duplicate Detection <br>
Based on: <br>
Invoice number <br>
Vendor name 

📊 Dashboard <br>
Summary metrics <br>
Vendor spend chart <br>
Monthly trends <br>
Recent invoices <br>

📈 Analytics Page <br>
Top vendor <br>
Best performing month <br>
Spend trends

📄 Invoices Page <br>
Search & filter <br>
Duplicate highlight <br>
Responsive UI

## 🔗 API Endpoints
#### Upload Invoice
POST /api/upload/ <br>
#### Get Invoices
GET /api/invoices

#### Analytics
GET /api/analytics/summary <br>
GET /api/analytics/vendor-spend <br>
GET /api/analytics/monthly-trends

## Key Design Decisions
1. Separation of Concerns
OCR handled in ocr_service.py
AI parsing handled in llm_service.py
Routes kept clean and modular
2. AI Prompt Engineering
Strict JSON output enforced
Retry mechanism for reliability
3. Scalable Architecture
Supabase used for DB + Storage
Stateless FastAPI backend
4. Duplicate Detection Logic
Uses vendor + invoice number
Simple but effective approach
5. Frontend Architecture
Component-based design
Separate pages for Dashboard, Analytics, Invoices

## Assumptions & Limitations
OCR accuracy depends on invoice quality <br>
AI parsing may fail for highly unstructured invoices <br>
Duplicate detection is basic (no fuzzy matching) <br>
Free-tier Gemini API may hit quota limits <br>
No authentication implemented (for simplicity)

### 🚀 Potential Improvements
Add authentication & RBAC (Admin/User) <br>
Improve duplicate detection using fuzzy matching <br>
Add export (PDF/Excel reports) <br>
Improve OCR accuracy using advanced models <br>
Add real-time notifications <br>
Add invoice editing UI <br>
Pagination & advanced filters 

## 🛠 Setup Instructions
### Backend
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Example .env
```
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-public-anon-key

# Gemini API Key
GEMINI_API_KEY=your-gemini-api-key

# Tesseract OCR Path (Windows)
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe

# Alternative Tesseract Path (optional)
# TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe

# Poppler Path (for PDF processing)
POPPLER_PATH=C:\poppler\Library\bin
```

### Frontend
```
npm install
npm run dev
```

## 👨‍💻 Author
### Sk Sakirul Islam