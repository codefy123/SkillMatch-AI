import re
import json
import os

TAXONOMY_PATH = os.path.join(os.path.dirname(__file__), 'skills_taxonomy.json')

def load_taxonomy():
    try:
        with open(TAXONOMY_PATH, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

SKILL_TAXONOMY = load_taxonomy()

def extract_skills(text: str) -> set:
    """
    Scans the ENTIRE document (top to bottom) for any mention of a tech skill.
    Uses negative lookarounds to safely match skills with special characters (C++, C#, .NET).
    """
    if not text:
        return set()
        
    text_lower = text.lower()
    found_skills = set()
    
    for canonical_skill, aliases in SKILL_TAXONOMY.items():
        for alias in aliases:
            escaped_alias = re.escape(alias.lower())
            pattern = r"(?<![a-z0-9])" + escaped_alias + r"(?![a-z0-9])"
            
            if re.search(pattern, text_lower):
                found_skills.add(canonical_skill)
                break
                
    return found_skills

def explain(resume_skills: set, job_skills: set) -> dict:
    """
    Compares the two sets of skills and returns exactly what matched and what is missing.
    """
    if not job_skills:
        return {
            "matched_skills": list(resume_skills),
            "missing_skills": []
        }
        
    matched = resume_skills.intersection(job_skills)
    missing = job_skills.difference(resume_skills)
    
    return {
        "matched_skills": list(matched),
        "missing_skills": list(missing)
    }