import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Briefcase, FileText, SlidersHorizontal, Plus } from 'lucide-react';

const CreateJobPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minScore, setMinScore] = useState(70);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token missing. Please log in again.');
      }

      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title,
          description: description,
          min_match_score: Number(minScore)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post job');
      }

      navigate('/hr');
    } catch (err) {
      console.error('Error posting job:', err);
      setError(err.message || 'Failed to create job posting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        
        <nav className="flex text-sm font-medium text-zinc-500 mb-4">
          <Link to="/hr" className="hover:text-zinc-900 transition-colors flex items-center gap-1.5">
            <ArrowLeft size={16} /> Back to Command Center
          </Link>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
          <div className="mb-8 border-b border-zinc-100 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Post a New Role</h1>
              <p className="mt-1.5 text-sm text-zinc-500 font-medium">Define the job requirements and configure your AI matching threshold baseline.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-sm">
              <Sparkles size={22} />
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                <Briefcase size={14} className="text-zinc-400" /> Job Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all sm:text-sm font-medium text-zinc-900"
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-zinc-400" /> Job Description & Requirements
              </label>
              <textarea
                required
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all sm:text-sm text-zinc-900 custom-scrollbar font-normal leading-relaxed"
                placeholder="Paste the complete job description here. Include key responsibilities, required tech stack, and qualifications. Our AI engine uses this exact text to evaluate semantic alignment and score incoming candidate resumes..."
              />
            </div>

            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-blue-600" /> AI Minimum Match Threshold
                </label>
                <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-sm rounded-lg shadow-sm">
                  {minScore}%
                </span>
              </div>
              
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Candidates whose AI match score meets or exceeds this threshold will be <strong>automatically shortlisted</strong> with zero manual delay. Applicants scoring below will be held for review or skill-gap feedback.
              </p>
              
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              
              <div className="flex justify-between text-xs font-bold text-zinc-400 pt-1">
                <span>0% (Lenient)</span>
                <span>50% (Standard)</span>
                <span>100% (Strict)</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Link
                to="/hr"
                className="px-6 py-3 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-50 transition-all shadow-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl shadow-sm text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Plus size={16} /> Publish Role
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateJobPost;