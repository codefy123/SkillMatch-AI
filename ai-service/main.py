from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from utils import extract_skills, explain
from typing import Optional
import PyPDF2
import io
import uuid
import re
import torch
import os

torch.set_num_threads(1)
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

app = FastAPI()

origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer('./model')

resumes_db = {}

class SearchRequest(BaseModel):
    job_description: str
    resume_id: Optional[str] = None

def extract_text_from_pdf(file_bytes):
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf_reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + " "
    return text

def clean_resume_noise(text: str) -> str:
    text = re.sub(r'http[s]?://\S+', '', text)
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '', text)
    text = re.sub(r'\+?\d{10,15}', '', text)
    
    noise_words = [
        "Noida Institute Of Engineering & Technology", "Greater Noida", "Uttar Pradesh",
        "Resonance International School", "Primus Public School", "Central Board of Secondary Education",
        "Muzaffarpur", "Bihar", "CGPA", "Percentage", "B.Tech", "CSE", "(Data Science)", "12th", "10th",
        "Bachelor of Technology", "High School", "Secondary Education"
    ]
    
    for word in noise_words:
        pattern = re.compile(re.escape(word), re.IGNORECASE)
        text = pattern.sub('', text)
        
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    file_bytes = await file.read()
    raw_text = extract_text_from_pdf(file_bytes)
    
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
    cleaned_text = clean_resume_noise(raw_text)
    
    resume_id = str(uuid.uuid4())
    resumes_db[resume_id] = {
        "filename": file.filename,
        "text": cleaned_text
    }
    
    return {"status": "success", "resume_id": resume_id, "filename": file.filename}

@app.post("/search-resumes/")
def search_resumes(req: SearchRequest):
    if not resumes_db:
        return {"matches": []}
        
    job_desc = req.job_description
    target_resume_id = req.resume_id
    
    emb_jd = model.encode(job_desc)
    
    job_skills = extract_skills(job_desc)
    total_job_skills = len(job_skills) if len(job_skills) > 0 else 1
    
    results = []

    items_to_evaluate = {}
    if target_resume_id and target_resume_id in resumes_db:
        items_to_evaluate = {target_resume_id: resumes_db[target_resume_id]}
    else:
        items_to_evaluate = resumes_db
    
    for res_id, res_data in items_to_evaluate.items():
        resume_text = res_data["text"]
        
        emb_res = model.encode(resume_text)
        raw_semantic_score = float(util.cos_sim(emb_res, emb_jd))
        
        adjusted_semantic = min(1.0, max(0.0, (raw_semantic_score - 0.25) / 0.30))
        
        resume_skills = extract_skills(resume_text)
        explanation = explain(resume_skills, job_skills)
        matched = explanation["matched_skills"]
        
        required_skills_threshold = max(1, total_job_skills * 0.70) 
        skill_score = min(1.0, len(matched) / required_skills_threshold)
        
        if adjusted_semantic == 0.0:
            final_score = 0.0
        else:
            final_score = (adjusted_semantic * 0.6) + (skill_score * 0.4)
            
            if total_job_skills < 3:
                final_score = final_score * 0.5
        
        results.append({
            "filename": res_data["filename"],
            "match_score": round(max(0, final_score * 100), 2), 
            "matched_skills": list(matched),
            "missing_skills": list(explanation["missing_skills"])
        })
        
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return {"matches": results}
