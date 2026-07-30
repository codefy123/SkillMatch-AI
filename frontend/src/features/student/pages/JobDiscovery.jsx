import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Briefcase, Clock, Filter, 
  Building2, Banknote, CheckCircle2, ChevronRight, X, ArrowUpRight, FileText
} from 'lucide-react';
import ApplyModal from '../components/ApplyModal';

const JobDiscovery = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [jobsRes, appsRes] = await Promise.all([
          fetch('http://localhost:5000/api/jobs/active', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/applications/me', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (jobsRes.ok) {
          const fetchedJobs = await jobsRes.json();
          setJobs(fetchedJobs);
        }
        
        if (appsRes.ok) {
          const apps = await appsRes.json();
          setAppliedJobIds(new Set(apps.map(app => app.job_id)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyClick = (job, e) => {
    if (e) e.stopPropagation();
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All' || job.type === selectedType; 
    return matchesSearch && matchesType;
  });

  const jobTypes = ['All', 'Full-time', 'Internship', 'Contract'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Job Board</h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium max-w-2xl">
            Discover roles tailored to your stack. Your AI-matched resume ensures you only apply to positions where you meet the threshold.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3 block">Search Roles</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-zinc-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter size={14} /> Job Type
                </label>
                {selectedType !== 'All' && (
                  <button onClick={() => setSelectedType('All')} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {jobTypes.map(type => (
                  <label key={type} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors border border-transparent hover:border-zinc-200">
                    <input 
                      type="radio" 
                      name="jobType" 
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300" 
                    />
                    <span className="text-sm font-medium text-zinc-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm animate-pulse flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-zinc-100 rounded-xl shrink-0"></div>
                    <div className="flex-1 space-y-3 pt-1">
                      <div className="h-5 bg-zinc-200 rounded w-1/3"></div>
                      <div className="h-4 bg-zinc-100 rounded w-1/4"></div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-6 bg-zinc-100 rounded w-20"></div>
                        <div className="h-6 bg-zinc-100 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="w-full md:w-32 h-10 bg-zinc-100 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-full border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
                  <Search size={28} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">No matching roles found</h3>
                <p className="mt-2 text-sm text-zinc-500 max-w-sm">Try adjusting your filters or search terms to find more opportunities.</p>
                <button onClick={() => {setSearchQuery(''); setSelectedType('All');}} className="mt-6 text-sm font-semibold text-zinc-900 bg-white border border-zinc-200 px-6 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                {filteredJobs.map((job) => {
                  const hasApplied = appliedJobIds.has(job.id);

                  return (
                    <motion.div 
                      key={job.id} 
                      variants={itemVariants}
                      whileHover={{ scale: 1.002, borderColor: '#e4e4e7' }}
                      onClick={() => setViewingJob(job)} // <-- Clicking anywhere opens the side panel!
                      className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center shrink-0 text-zinc-400">
                        <Building2 size={28} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <h2 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{job.title}</h2>
                            <p className="text-sm font-medium text-zinc-500 mt-1 flex items-center gap-2">
                              TechCorp Inc. <span className="w-1 h-1 rounded-full bg-zinc-300"></span> 
                              <span className="flex items-center gap-1"><MapPin size={14} /> Remote</span>
                            </p>
                          </div>
                          
                          <div className="shrink-0">
                            {hasApplied ? (
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-200 w-full md:w-auto justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
                                <CheckCircle2 size={16} /> Applied
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => handleApplyClick(job, e)}
                                className="w-full md:w-auto px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-center gap-2"
                              >
                                Apply Now <ChevronRight size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-zinc-600 mt-4 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
                            <Briefcase size={14} /> {job.type || 'Full-time'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
                            <Banknote size={14} /> Competitive
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
                            <Clock size={14} /> Posted {new Date(job.created_at).toLocaleDateString()}
                          </span>
                          
                          {job.min_match_score && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold ml-auto">
                              Req. Match: {job.min_match_score}%
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewingJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingJob(null)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-40 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50 shrink-0">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Job Details</h2>
                <button onClick={() => setViewingJob(null)} className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md hover:bg-zinc-100">
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex gap-5 items-start mb-8 border-b border-zinc-100 pb-8">
                  <div className="w-20 h-20 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0 text-zinc-400 shadow-sm">
                    <Building2 size={36} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{viewingJob.title}</h1>
                    <a href="#" className="mt-2 text-base font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 w-fit transition-colors">
                      TechCorp Inc. <ArrowUpRight size={16} />
                    </a>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-zinc-500">
                      <span className="flex items-center gap-1.5"><MapPin size={16} /> Remote</span>
                      <span className="flex items-center gap-1.5"><Briefcase size={16} /> {viewingJob.type || 'Full-time'}</span>
                      <span className="flex items-center gap-1.5"><Banknote size={16} /> Competitive Salary</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                      <FileText size={18} className="text-zinc-400" /> Description
                    </h3>
                    <p className="text-zinc-600 leading-relaxed whitespace-pre-line text-base">
                      {viewingJob.description || 'No detailed description provided for this role.'}
                    </p>
                  </div>

                  {viewingJob.min_match_score && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-blue-900 mb-1">AI Match Threshold</h3>
                      <p className="text-sm text-blue-700">
                        This role requires a minimum AI Match Score of <span className="font-extrabold text-blue-800">{viewingJob.min_match_score}%</span>. 
                        Your resume will be automatically parsed and scored against the core requirements of this description upon submission.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-zinc-100 bg-zinc-50 shrink-0">
                {appliedJobIds.has(viewingJob.id) ? (
                  <div className="w-full py-3.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-200 flex justify-center items-center gap-2">
                    <CheckCircle2 size={18} /> You have already applied for this role
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      handleApplyClick(viewingJob);
                      setViewingJob(null); 
                    }}
                    className="w-full py-3.5 bg-zinc-900 text-white text-base font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Apply for this Role <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && selectedJob && (
          <ApplyModal 
            job={selectedJob} 
            user={user} 
            onClose={() => {
              setIsModalOpen(false);
              setSelectedJob(null);
              const checkSuccess = localStorage.getItem('lastAppliedJob');
              if (checkSuccess === selectedJob.id.toString()) {
                setAppliedJobIds(prev => new Set(prev).add(selectedJob.id));
                localStorage.removeItem('lastAppliedJob');
              }
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDiscovery;