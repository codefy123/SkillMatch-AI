import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ManageJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token missing');

        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch job details');
        
        setJob(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const toggleStatus = async () => {
    const newStatus = job.status === 'active' ? 'paused' : 'active';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setJob(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.message || 'Failed to update job status.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job posting? This action cannot be undone and will delete all associated candidate applications.'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete job');
      
      navigate('/hr');
    } catch (err) {
      alert(err.message || 'Failed to delete job.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 font-bold mb-4">
            {error || 'Job not found.'}
          </div>
          <Link to="/hr" className="text-blue-600 font-bold hover:underline">Return to Command Center</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <nav className="flex text-sm font-medium text-slate-500 mb-4">
          <Link to="/hr" className="hover:text-slate-900 transition-colors">&larr; Back to Command Center</Link>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm font-medium text-slate-500">
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                  job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={toggleStatus}
                className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                {job.status === 'active' ? 'Pause Hiring' : 'Resume Hiring'}
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
              >
                Delete Role
              </button>
            </div>
          </div>

          <div className="py-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">AI Target Baseline</h3>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">Minimum Match Score</span>
                <span className="text-lg font-extrabold text-blue-600">{job.min_match_score}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${job.min_match_score}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Job Description</h3>
            <div className="prose prose-slate prose-sm max-w-none text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageJob;