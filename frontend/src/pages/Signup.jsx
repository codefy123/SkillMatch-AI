import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, User, AlertCircle, ArrowRight, Building, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    companyName: '',
    jobTitle: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.role === 'hr' && (!formData.companyName || !formData.jobTitle)) {
      setError('Please provide your company name and job title.');
      return;
    }

    setIsLoading(true);

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const signupResponse = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          companyName: formData.companyName 
        }),
      });

      const contentType = signupResponse.headers.get("content-type");
      let signupData;
      if (contentType && contentType.includes("application/json")) {
        signupData = await signupResponse.json();
      } else {
        throw new Error("Server Error: Endpoint not found or backend is offline.");
      }

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Failed to register account');
      }

      const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Failed to auto-login after signup');
      }

      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
      
      setUser(loginData.user);
      
      navigate(loginData.user.role === 'hr' ? '/hr' : '/student');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="mx-auto w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-4 shadow-md">
          <span className="text-white font-bold text-xl leading-none">S</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Join SkillMatch to automate screening and get skill-gap insights.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-sm border border-zinc-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSignup}>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="flex gap-2 p-1.5 bg-zinc-100 rounded-lg border border-zinc-200 relative">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-md transition-all z-10 ${formData.role === 'student' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                I am a Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'hr' })}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-md transition-all z-10 ${formData.role === 'hr' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                I am an HR/Recruiter
              </button>
              
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-md shadow-sm border border-zinc-200 transition-transform duration-300 ease-in-out ${formData.role === 'hr' ? 'translate-x-[calc(100%+0.25rem)]' : 'translate-x-0'}`} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                    placeholder="First Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {formData.role === 'hr' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-zinc-400" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        required={formData.role === 'hr'}
                        value={formData.companyName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                        placeholder="Nexora Solutions"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Job Title</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-zinc-400" />
                      </div>
                      <input
                        type="text"
                        name="jobTitle"
                        required={formData.role === 'hr'}
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                        placeholder="Senior Recruiter"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                    placeholder="you@gmail.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                    placeholder="Min. 8 characters"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm outline-none transition-all"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 mt-4 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-zinc-100 pt-6">
            <p className="text-sm text-zinc-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
