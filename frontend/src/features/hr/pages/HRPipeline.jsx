import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  Building2,
  X,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';

const HRPipeline = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/applications/hr', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch pipeline');

      const enriched = data.map(app => {
        const profileKey = `profile_${app.student_email}`;
        const localProfile = localStorage.getItem(profileKey);
        let studentMeta = {};
        if (localProfile) {
          try {
            const parsed = JSON.parse(localProfile);
            studentMeta = {
              firstName: parsed.textFields?.firstName || '',
              lastName: parsed.textFields?.lastName || '',
              phone: parsed.textFields?.phone || '',
              university: parsed.textFields?.university || 'NIET Greater Noida',
              degree: parsed.textFields?.degree || 'B.Tech CSE',
              resumeName: parsed.resumeName || 'resume.pdf'
            };
          } catch (e) { }
        }
        return {
          ...app,
          studentMeta: {
            fullName: studentMeta.firstName ? `${studentMeta.firstName} ${studentMeta.lastName}` : app.student_email.split('@')[0],
            phone: studentMeta.phone || '+91 98765 43210',
            university: studentMeta.university || 'NIET Greater Noida',
            degree: studentMeta.degree || 'B.Tech CSE',
            resumeName: studentMeta.resumeName || 'resume.pdf'
          }
        };
      });

      setApplications(enriched);
    } catch (err) {
      console.error('Pipeline Error:', err);
      setError('Could not load candidate pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateApplicationStatus = async (appId, newStatus, reason = '') => {
    try {
      const token = localStorage.getItem('token');

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${BACKEND_URL}/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, rejection_reason1: reason }) // Updated key
      });

      if (!response.ok) throw new Error('Failed to update status');

      setApplications(prevApps =>
        prevApps.map(app => app.id === appId ? { ...app, status: newStatus, rejection_reason1: reason } : app)
      );

      if (selectedCandidate && selectedCandidate.id === appId) {
        setSelectedCandidate(prev => ({ ...prev, status: newStatus, rejection_reason1: reason }));
      }

      setRejectingAppId(null);
      setRejectionReasonText('');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update candidate status.');
    }
  };

  const shortlistedApps = applications.filter(app => {
    if (app.status === 'rejected') return false;
    const score = app.ai_score || 0;
    const threshold = app.min_match_score || 70;
    return score >= threshold || app.status === 'accepted';
  });

  const belowThresholdApps = applications.filter(app => {
    if (app.status === 'rejected') return false;
    const score = app.ai_score || 0;
    const threshold = app.min_match_score || 70;
    return score < threshold && app.status !== 'accepted';
  });

  const rejectedApps = applications.filter(app => app.status === 'rejected');

  const PipelineColumn = ({ title, count, apps, colorTheme, icon: Icon }) => (
    <div className="flex-1 min-w-[320px] bg-zinc-50 rounded-2xl border border-zinc-200/80 p-4 flex flex-col h-[750px] shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2 py-1">
        <div className="flex items-center gap-2">
          <Icon size={16} className={colorTheme.iconText} />
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">{title}</h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colorTheme.badgeBg} ${colorTheme.badgeText}`}>
          {count}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {apps.length === 0 ? (
          <div className="text-center py-16 text-xs text-zinc-400 font-medium border border-dashed border-zinc-200 rounded-xl">
            No candidates here.
          </div>
        ) : (
          apps.map(app => {
            const score = app.ai_score || 0;
            const threshold = app.min_match_score || 70;
            const isQualified = score >= threshold;

            return (
              <motion.div
                key={app.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCandidate(app)}
                className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm group-hover:text-blue-600 transition-colors">
                      {app.studentMeta.fullName}
                    </h4>
                    <p className="text-xs font-medium text-zinc-500 mt-0.5">{app.job_title}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shrink-0 ${score >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    score >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                    <Sparkles size={12} />
                    {score}%
                  </div>
                </div>

                <div className="mb-3">
                  {isQualified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                      <CheckCircle2 size={12} /> Auto-Shortlisted (Score: {score}% &ge; Req: {threshold}%)
                    </span>
                  ) : app.status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                      <XCircle size={12} /> Rejected by Recruiter
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                      <AlertTriangle size={12} /> Below Threshold (Score: {score}% &lt; Req: {threshold}%)
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>{app.student_email}</span>
                  {app.status !== 'rejected' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRejectingAppId(app.id);
                      }}
                      className="text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                    >
                      Reject with Reason
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-7xl mx-auto space-y-6">

        <nav className="flex text-sm font-medium text-zinc-500 mb-2">
          <Link to="/hr" className="hover:text-zinc-900 transition-colors flex items-center gap-1.5">
            <ArrowLeft size={16} /> Back to Command Center
          </Link>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Candidate Pipeline</h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Candidates meeting or exceeding the job AI threshold are automatically shortlisted.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 font-medium">{error}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
            <PipelineColumn
              title="Shortlisted (Automated)"
              count={shortlistedApps.length}
              apps={shortlistedApps}
              colorTheme={{ badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700', iconText: 'text-emerald-600' }}
              icon={CheckCircle2}
            />
            <PipelineColumn
              title="Below Threshold"
              count={belowThresholdApps.length}
              apps={belowThresholdApps}
              colorTheme={{ badgeBg: 'bg-amber-100', badgeText: 'text-amber-700', iconText: 'text-amber-600' }}
              icon={Clock}
            />
            <PipelineColumn
              title="Rejected"
              count={rejectedApps.length}
              apps={rejectedApps}
              colorTheme={{ badgeBg: 'bg-zinc-200', badgeText: 'text-zinc-700', iconText: 'text-zinc-600' }}
              icon={XCircle}
            />
          </div>
        )}

      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50 shrink-0">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Candidate Dossier & Resume</h2>
                <button onClick={() => setSelectedCandidate(null)} className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md hover:bg-zinc-200">
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 space-y-6">

                <div className="flex items-start justify-between border-b border-zinc-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white font-bold text-xl flex items-center justify-center">
                      {selectedCandidate.studentMeta.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900">{selectedCandidate.studentMeta.fullName}</h3>
                      <p className="text-sm font-medium text-zinc-500 mt-0.5 flex items-center gap-1.5">
                        <Building2 size={14} /> Applied for: <span className="text-zinc-800 font-bold">{selectedCandidate.job_title}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-zinc-400 uppercase">Contact Information</p>
                    <p className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                      <Mail size={14} className="text-zinc-400" /> {selectedCandidate.student_email}
                    </p>
                    <p className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                      <Phone size={14} className="text-zinc-400" /> {selectedCandidate.studentMeta.phone}
                    </p>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-zinc-400 uppercase">Education</p>
                    <p className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                      <GraduationCap size={14} className="text-zinc-400" /> {selectedCandidate.studentMeta.degree}
                    </p>
                    <p className="text-xs text-zinc-600 font-medium pl-5">{selectedCandidate.studentMeta.university}</p>
                  </div>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">AI Evaluation Score</span>
                    <span className="text-2xl font-extrabold text-emerald-700">{selectedCandidate.ai_score}%</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden mb-3">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${selectedCandidate.ai_score}%` }}></div>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Target baseline required: &ge;{selectedCandidate.min_match_score}%.
                    {selectedCandidate.ai_score >= selectedCandidate.min_match_score
                      ? " This candidate automatically met the threshold and was shortlisted."
                      : " Candidate scored below the target threshold."}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-zinc-900 mb-3">Uploaded Resume</h4>
                  <div className="border border-zinc-200 rounded-xl p-4 bg-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{selectedCandidate.studentMeta.resumeName}</p>
                        <p className="text-xs text-zinc-500 font-medium">Verified PDF Document</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCandidate.status === 'rejected' && selectedCandidate.rejection_reason && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4">
                    <p className="text-xs font-bold text-rose-800 uppercase mb-1">Rejection Reason Provided:</p>
                    <p className="text-sm text-rose-700 font-medium">{selectedCandidate.rejection_reason}</p>
                  </div>
                )}{selectedCandidate.status === 'rejected' && selectedCandidate.rejection_reason1 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4">
                    <p className="text-xs font-bold text-rose-800 uppercase mb-1">Rejection Reason Provided:</p>
                    <p className="text-sm text-rose-700 font-medium">{selectedCandidate.rejection_reason1}</p>
                  </div>
                )}

              </div>

              <div className="p-6 border-t border-zinc-100 bg-zinc-50 shrink-0 flex gap-3">
                {selectedCandidate.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      setSelectedCandidate(null);
                      setRejectingAppId(selectedCandidate.id);
                    }}
                    className="w-full py-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Reject Candidate with Reason
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectingAppId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-md p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-zinc-900">Reason for Rejection</h3>
              <p className="text-xs text-zinc-500">Provide feedback or the specific reason for rejecting this candidate. This will be displayed on their student dashboard.</p>

              <textarea
                rows={4}
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="e.g. Lacks required proficiency in distributed system design and Docker containerization."
                className="w-full p-3 border border-zinc-300 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setRejectingAppId(null); setRejectionReasonText(''); }}
                  className="flex-1 py-2.5 bg-white border border-zinc-300 text-zinc-700 font-bold rounded-xl text-sm hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateApplicationStatus(rejectingAppId, 'rejected', rejectionReasonText)}
                  disabled={!rejectionReasonText.trim()}
                  className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-sm hover:bg-rose-700 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HRPipeline;
