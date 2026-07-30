import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, UploadCloud, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';

const ApplyModal = ({ job, user, onClose }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [savedResumeName, setSavedResumeName] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem(`profile_${user?.email}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const hasSkills = parsedData.skills && parsedData.skills.length > 0;
      const hasResume = !!parsedData.resumeName;
      
      if (hasSkills && hasResume) {
        setIsProfileComplete(true);
        setSavedResumeName(parsedData.resumeName);
      }
    }
    setCheckingProfile(false);
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file && !savedResumeName) {
      setError('Please select a resume (PDF) to upload.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing. Please log in again.');

      const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      let exactAiScore = 0;
      let missingSkills = [];
      let currentResumeId = null;

      try {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadRes = await fetch(`${AI_SERVICE_URL}/upload-resume/`, {
            method: 'POST',
            body: formData
          });
          
          if (!uploadRes.ok) throw new Error('Failed to parse the new resume document.');
          
          const uploadData = await uploadRes.json();
          currentResumeId = uploadData.resume_id; 
        }

        const pythonResponse = await fetch(`${AI_SERVICE_URL}/search-resumes/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            job_description: job.description || job.title,
            resume_id: currentResumeId
          })
        });

        if (!pythonResponse.ok) throw new Error('Failed to evaluate resume match score.');

        const pythonData = await pythonResponse.json();

        if (!pythonData.matches || pythonData.matches.length === 0) {
          throw new Error("AI could not find a parsed resume. Please select and upload your PDF again.");
        }

        exactAiScore = pythonData.matches[0].match_score;
        missingSkills = pythonData.matches[0].missing_skills;

      } catch (aiError) {
        console.error("AI Pipeline Error:", aiError);
        throw new Error(aiError.message || "AI Evaluation failed. Ensure your Python backend is running.");
      }

      const response = await fetch(`${BACKEND_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          job_id: job.id,
          ai_score: exactAiScore,
          missing_skills: missingSkills
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application to database');
      }

      setSuccess(true);
      
      localStorage.setItem('lastAppliedJob', job.id.toString());
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Application Error:', err);
      setError(err.message || 'Something went wrong during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting && !success) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Application Gateway</h2>
          {!isSubmitting && !success && (
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md hover:bg-zinc-100">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="mb-6 border-b border-zinc-100 pb-6">
            <h3 className="text-2xl font-bold text-zinc-900 leading-tight">{job.title}</h3>
            {job.min_match_score && (
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 rounded-md">
                  Target Baseline: {job.min_match_score}% Match
                </span>
                <span className="text-xs text-zinc-500 font-medium">Your resume will be AI-scored upon submission.</span>
              </div>
            )}
          </div>

          {checkingProfile ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : success ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <h4 className="text-lg text-emerald-900 font-bold">Application Submitted</h4>
              <p className="text-sm text-emerald-700 mt-2 font-medium">Your resume has been successfully parsed and routed to the HR pipeline.</p>
            </motion.div>
          ) : !isProfileComplete ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-amber-600" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900">Profile Incomplete</h4>
              <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto mb-6">
                You must complete your profile and upload a default resume before you can apply to roles on SkillMatch.
              </p>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Complete Profile Now <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            // APPLICATION FORM
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-bold text-zinc-900">Selected Resume</label>
                
                {/* Resume Selection Box */}
                <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center shrink-0 text-blue-600">
                      <FileText size={20} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-zinc-900 truncate">
                        {file ? file.name : savedResumeName}
                      </p>
                      <p className="text-xs text-zinc-500 font-medium">
                        {file ? 'New upload' : 'Default profile resume'}
                      </p>
                    </div>
                  </div>
                  
                  <label className="shrink-0 ml-4 cursor-pointer">
                    <span className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 transition-colors">
                      Change
                    </span>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-white border border-zinc-300 text-zinc-700 text-sm font-bold rounded-xl hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] px-4 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>Submit Application <UploadCloud size={16} /></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ApplyModal;
