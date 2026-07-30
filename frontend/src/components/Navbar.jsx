import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide this navbar completely on the landing page
  if (location.pathname === '/') {
    return null;
  }

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkBaseStyle = "px-3 py-2 rounded-md text-sm font-bold transition-colors";
  const activeStyle = "bg-slate-100 text-slate-900";
  const inactiveStyle = "text-slate-500 hover:text-slate-900 hover:bg-slate-50";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex items-center">

            <div className="flex-shrink-0 flex items-center mr-8">
              <Link to={user?.role === 'hr' ? '/hr' : '/student'} className="flex items-center gap-1.5 group">
                <span className="font-black text-2xl tracking-tighter text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
                  SkillMatch
                </span>
                <div className="flex items-end h-full pb-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                </div>
              </Link>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-2">
              {user?.role === 'hr' && (
                <>
                  <Link to="/hr" className={`${linkBaseStyle} ${isActive('/hr') ? activeStyle : inactiveStyle}`}>
                    Command Center
                  </Link>
                  <Link to="/hr/pipeline" className={`${linkBaseStyle} ${isActive('/hr/pipeline') ? activeStyle : inactiveStyle}`}>
                    Pipeline
                  </Link>
                </>
              )}

              {user?.role === 'student' && (
                <>
                  <Link to="/student/discover" className={`${linkBaseStyle} ${isActive('/student/discover') ? activeStyle : inactiveStyle}`}>
                    Job Board
                  </Link>
                  <Link to="/student" className={`${linkBaseStyle} ${isActive('/student') ? activeStyle : inactiveStyle}`}>
                    My Applications
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">

            {user?.role === 'hr' && (
              <Link to="/hr/create-job" className="hidden sm:flex px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                Post Role
              </Link>
            )}

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-2"></div>

            <Link
              to="/profile"
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/profile') ? activeStyle : inactiveStyle}`}
            >
              <div className="w-6 h-6 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <span className="text-sm font-semibold">
                Profile
              </span>
            </Link>

            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
            >
              Sign out
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;