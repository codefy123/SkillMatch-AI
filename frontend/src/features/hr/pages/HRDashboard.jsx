import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  Search, 
  Building2, 
  Calendar, 
  ArrowRight,
  SlidersHorizontal,
  Activity
} from 'lucide-react';

const HRDashboard = ({ user }) => {
  const companyName = user?.company || 'NexusAI Enterprise';
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch jobs and applications simultaneously
        const [jobsRes, appsRes] = await Promise.all([
          fetch('http://localhost:5000/api/jobs/me', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/applications/hr', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (jobsRes.ok) {
          const fetchedJobs = await jobsRes.json();
          const formattedJobs = fetchedJobs.map(job => ({
            ...job,
            createdDate: new Date(job.created_at).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            })
          }));
          setJobs(formattedJobs);
        }

        if (appsRes.ok) {
          const fetchedApps = await appsRes.json();
          setApplications(fetchedApps);
        }
      } catch (error) {
        console.error("Error fetching HR dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getInitials = (title) => {
    if (!title) return 'NA';
    return title.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const liveCount = jobs.filter(j => j.status === 'active' || !j.status).length;
  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'accepted').length;
  const avgAiScore = totalApplicants > 0 
    ? Math.round(applications.reduce((acc, curr) => acc + (curr.ai_score || 0), 0) / totalApplicants) 
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Command Center Active
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{companyName}</h1>
            <p className="mt-1 text-sm text-zinc-500 font-medium">Manage recruitment pipelines, automated thresholds, and active job postings.</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-3 relative z-10">
            <button 
              onClick={() => navigate('/hr/pipeline')} 
              className="px-5 py-2.5 bg-white text-zinc-700 text-sm font-semibold rounded-xl border border-zinc-300 hover:bg-zinc-50 transition-all shadow-sm flex items-center gap-2"
            >
              <Users size={16} /> View Pipeline
            </button>
            <Link 
              to="/hr/create-job" 
              className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={16} /> Post New Role
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Briefcase size={20} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Live</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{liveCount}</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Active Job Postings</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Users size={20} />
              </div>
              <TrendingUp size={16} className="text-zinc-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{totalApplicants}</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Total Resumes Scanned</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{shortlistedCount}</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Candidates Shortlisted</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Activity size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-zinc-900">{avgAiScore}%</h3>
              <p className="text-sm font-medium text-zinc-500 mt-1">Avg. AI Match Score</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-zinc-900">Job Postings Hub</h3>
              <span className="bg-zinc-200 text-zinc-700 text-xs font-bold px-2 py-0.5 rounded-md">
                {liveCount} Live
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
                <Briefcase size={28} className="text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No job postings found</h3>
              <p className="mt-1 text-sm text-zinc-500 mb-6 max-w-sm">You haven't posted any roles yet. Create your first job listing to start receiving AI-screened applications.</p>
              <Link to="/hr/create-job" className="text-sm font-semibold text-white bg-zinc-900 px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">
                Create First Role
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">AI Target Baseline</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Date Posted</th>
                    <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-100">
                  {jobs.map((job) => (
                    <motion.tr 
                      key={job.id} 
                      whileHover={{ backgroundColor: 'rgba(244, 244, 245, 0.5)' }}
                      className="transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-zinc-700 font-mono">
                            {getInitials(job.title)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-900">{job.title}</div>
                            <div className="text-xs font-medium text-zinc-500 mt-0.5">Full-Time • Remote</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Accepting
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 text-zinc-700 bg-zinc-50 text-xs font-bold">
                          <SlidersHorizontal size={12} /> Target: &ge;{job.min_match_score}%
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-600 flex items-center gap-1.5">
                          <Calendar size={14} className="text-zinc-400" /> {job.createdDate}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => navigate('/hr/pipeline')}
                          className="inline-flex items-center justify-center text-xs font-bold text-zinc-700 hover:text-blue-600 bg-white hover:bg-zinc-50 px-4 py-2 rounded-lg border border-zinc-200 shadow-sm transition-all"
                        >
                          Manage Role <ArrowRight size={14} className="ml-1" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default HRDashboard;