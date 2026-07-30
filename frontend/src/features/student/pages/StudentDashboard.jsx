import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Search,
  Activity,
  FileText,
  X,
  Building2,
  Calendar,
  MapPin,
  ChevronRight,
  AlertOctagon
} from 'lucide-react';

const StudentDashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [profileScore, setProfileScore] = useState(0);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/applications/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch applications');
        }

        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Could not load your applications at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();

    if (user?.email) {
      const savedData = localStorage.getItem(`profile_${user.email}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);

        const fields = [
          parsed.textFields?.firstName,
          parsed.textFields?.lastName,
          parsed.textFields?.phone,
          parsed.textFields?.university,
          parsed.textFields?.degree,
          parsed.textFields?.portfolio,
          parsed.textFields?.github,
          parsed.resumeName,
        ];

        const validFields = fields.filter(f => f && f.trim() !== '').length;
        const hasSkills = parsed.skills && parsed.skills.length > 0 ? 1 : 0;

        const totalChecks = fields.length + 1; // +1 for the skills array
        const score = Math.round(((validFields + hasSkills) / totalChecks) * 100);

        setProfileScore(score);
      }
    }
  }, [user]);

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const getStatusUI = (status) => {
    switch (status) {
      case 'accepted':
        return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={14} className="mr-1.5" />, label: 'Shortlisted' };
      case 'rejected':
        return { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle size={14} className="mr-1.5" />, label: 'Rejected' };
      default:
        return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={14} className="mr-1.5" />, label: 'Under Review' };
    }
  };

  const getProfileLevel = (score) => {
    if (score === 100) return 'Expert';
    if (score >= 70) return 'Intermediate';
    return 'Beginner';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Overview
            </h1>
            <p className="mt-1 text-sm text-zinc-500 font-medium flex items-center gap-2">
              Welcome back, {user?.name || user?.email?.split('@')[0] || 'Student'}
              <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
              Profile {profileScore}% Complete
            </p>
          </div>
          <Link to="/student/discover" className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-2">
            <Search size={16} />
            Find New Roles
          </Link>
        </motion.div>
        {/* Analytics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Total */}
          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Briefcase size={20} />
              </div>
              <TrendingUp size={16} className="text-zinc-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{stats.total}</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Total Applications</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{stats.pending}</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Under Review</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{stats.accepted}</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Shortlisted / Selected</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <XCircle size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{stats.rejected}</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Rejected</p>
            </div>
          </motion.div>

        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Activity size={18} className="text-zinc-400" /> Recent Activity
              </h2>
            </div>

            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm animate-pulse flex justify-between items-center">
                  <div className="space-y-3 w-1/2">
                    <div className="h-5 bg-zinc-200 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-100 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-zinc-100 rounded-md w-24"></div>
                </div>
              ))
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-xl text-center text-sm font-medium">
                {error}
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-full border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
                  <FileText size={28} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">No applications yet</h3>
                <p className="mt-2 text-sm text-zinc-500 max-w-sm mb-6">
                  Your pipeline is currently empty. Head over to the Job Board to find roles that match your skill threshold.
                </p>
                <Link to="/student/discover" className="text-sm font-semibold text-zinc-900 bg-white border border-zinc-200 px-6 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm flex items-center gap-2">
                  Explore Job Board <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const ui = getStatusUI(app.status);
                  return (
                    <motion.div
                      key={app.id}
                      whileHover={{ scale: 1.005 }}
                      onClick={() => setSelectedApp(app)}
                      className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center shrink-0 text-zinc-500 font-bold text-lg">
                          {app.job_title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {app.job_title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm font-medium text-zinc-500">
                            <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-300"></span>
                            <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs font-bold border border-blue-100">
                              Match Score: {app.ai_score}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`px-3 py-1.5 rounded-md border text-xs font-bold flex items-center shrink-0 ${ui.color}`}>
                        {ui.icon}
                        {ui.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-zinc-900 mb-4">Profile Strength</h3>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-zinc-900">{getProfileLevel(profileScore)}</span>
                <span className={profileScore === 100 ? "text-emerald-600" : "text-blue-600"}>
                  {profileScore}%
                </span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-2 rounded-full ${profileScore === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                ></motion.div>
              </div>

              {profileScore < 100 ? (
                <>
                  <p className="text-xs text-zinc-500 mb-4">Complete all fields in your account settings to reach 100% and increase your visibility to recruiters.</p>
                  <Link to="/profile" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Complete Profile <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 mt-2">
                  <CheckCircle2 size={16} /> All set for applications!
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-zinc-900 mb-4">Recent Notifications</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 shrink-0"></div>
                  <div>
                    <p className="text-sm text-zinc-900 font-medium">Your resume was parsed successfully.</p>
                    <p className="text-xs text-zinc-500 mt-0.5">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-zinc-300 shrink-0"></div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Welcome to SkillMatch AI.</p>
                    <p className="text-xs text-zinc-400 mt-0.5">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </motion.div>

      <AnimatePresence>
        {selectedApp && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setSelectedApp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 shrink-0">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Application Details</h2>
                <button onClick={() => setSelectedApp(null)} className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md hover:bg-zinc-100">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center shrink-0 text-zinc-400">
                      <Building2 size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900">{selectedApp.job_title}</h3>
                      <p className="text-sm text-zinc-500 font-medium mt-1 flex items-center gap-2">
                        TechCorp Inc. <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> Remote</span>
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center shrink-0 h-fit ${getStatusUI(selectedApp.status).color}`}>
                    {getStatusUI(selectedApp.status).icon}
                    {getStatusUI(selectedApp.status).label}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Applied On</p>
                    <p className="text-sm font-semibold text-zinc-900 flex items-center gap-1">
                      <Calendar size={14} /> {new Date(selectedApp.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">AI Match Score</p>
                    <p className="text-lg font-extrabold text-blue-700">{selectedApp.ai_score}%</p>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 col-span-2">
                    <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Resume Used</p>
                    <p className="text-sm font-semibold text-zinc-900 flex items-center gap-2 truncate">
                      <FileText size={14} /> {localStorage.getItem(`profile_${user?.email}`) ? JSON.parse(localStorage.getItem(`profile_${user?.email}`)).resumeName || 'default_resume.pdf' : 'default_resume.pdf'}
                    </p>
                  </div>
                </div>
{selectedApp.status === 'rejected' && selectedApp.rejection_reason1 && (
  <div className="mb-8 bg-rose-50 border border-rose-200 rounded-xl p-5">
    <div className="flex items-center gap-2 mb-2">
      <AlertOctagon size={18} className="text-rose-600" />
      <h4 className="text-sm font-bold text-rose-900">Feedback / Skill Gaps Identified</h4>
    </div>
    <p className="text-sm text-rose-800 leading-relaxed whitespace-pre-line">
      {selectedApp.rejection_reason1}
    </p>
  </div>
)}

                <div className="mb-8 space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 mb-2 border-b border-zinc-100 pb-2">Role Overview</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                      {selectedApp.description || "The full job description for this role is maintained by the recruiter on the main Job Board."}
                    </p>
                  </div>

                  {selectedApp.min_match_score && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-900 uppercase mb-1">Required Threshold Baseline</p>
                      <p className="text-sm text-blue-700 font-semibold">
                        This role requires a minimum AI Match Score of <span className="font-extrabold text-blue-800">{selectedApp.min_match_score}%</span>. 
                        Your application scored <span className="font-extrabold text-blue-800">{selectedApp.ai_score}%</span>.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">Application Timeline</h4>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-bold text-zinc-900 text-sm">Application Submitted</h5>
                          <time className="text-xs font-medium text-zinc-500">{new Date(selectedApp.created_at).toLocaleDateString()}</time>
                        </div>
                        <p className="text-xs text-zinc-600">Resume parsed and routed to HR pipeline.</p>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                        selectedApp.status === 'pending' ? 'bg-amber-400' : selectedApp.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-bold text-zinc-900 text-sm">
                            {selectedApp.status === 'pending' ? 'Under Review' : selectedApp.status === 'accepted' ? 'Shortlisted' : 'Rejected'}
                          </h5>
                        </div>
                        <p className="text-xs text-zinc-600">
                          {selectedApp.status === 'pending' 
                            ? 'Your application is currently being reviewed by the hiring team.' 
                            : selectedApp.status === 'accepted'
                            ? 'Congratulations! You have been moved forward in the process.'
                            : 'Your application was not selected for this role by the recruiter.'}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentDashboard;