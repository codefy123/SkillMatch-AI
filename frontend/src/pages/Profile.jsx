import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Building, UploadCloud, Link as LinkIcon, Phone, BookOpen, Save, Briefcase, X, CheckCircle } from 'lucide-react';

const Profile = ({ user }) => {
  const role = user?.role || 'student'; 
  const isStudent = role === 'student';

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    university: '',
    degree: '',
    portfolio: '',
    github: ''
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem(`profile_${user?.email}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData.textFields || {});
      setSkills(parsedData.skills || []);
      if (parsedData.resumeName) {
        setResumeFile({ name: parsedData.resumeName, size: 1024 * 1024 }); // Mock file object
      }
    }
  }, [user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (isStudent) {
      if (skills.length === 0) {
        alert("Please add at least one core skill to your Tech Stack.");
        return;
      }
      if (!resumeFile) {
        alert("Please upload your resume document.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      const dataToSave = {
        textFields: formData,
        skills: skills,
        resumeName: resumeFile ? resumeFile.name : null
      };
      
      localStorage.setItem(`profile_${user?.email}`, JSON.stringify(dataToSave));
      
      setIsLoading(false);
      setSuccessMessage('Profile details saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 800);
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem(`profile_${user?.email}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData.textFields || {});
      setSkills(parsedData.skills || []);
    } else {
      setFormData({
        firstName: '', lastName: '', phone: '', companyName: '', jobTitle: '', university: '', degree: '', portfolio: '', github: ''
      });
      setSkills([]);
    }
    setSkillInput('');
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      addSkill(value.replace(',', ''));
    } else {
      setSkillInput(value);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const addSkill = (newSkill) => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-zinc-500 mt-2">
            Manage your personal information, {isStudent ? 'resume, and skill profile' : 'company details and preferences'}.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User size={18} className="text-zinc-400" /> Personal Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">First Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                  placeholder="e.g., John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Last Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                  placeholder="e.g., Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                  <input 
                    type="email" 
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-300 text-zinc-500 rounded-lg cursor-not-allowed text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>
          </div>

          {!isStudent && (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Building size={18} className="text-zinc-400" /> Company Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Company Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                    placeholder="e.g., TechCorp Inc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Your Title / Role <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                    <input 
                      type="text"
                      name="jobTitle" 
                      value={formData.jobTitle}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                      placeholder="e.g., Senior Technical Recruiter"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isStudent && (
            <>
              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen size={18} className="text-zinc-400" /> Academic & Skills
                  </h2>
                </div>
                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">University / Institution <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                        placeholder="e.g., Noida Institute of Engineering and Technology (NIET)"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Degree & Major <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                        placeholder="e.g., B.Tech Computer Science Engineering"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Core Tech Stack <span className="text-zinc-400 font-normal">(Press comma or enter to add)</span> <span className="text-red-500">*</span></label>
                    <div className="min-h-[52px] p-2 border border-zinc-300 bg-white rounded-lg focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-all flex flex-wrap gap-2 items-center">
                      
                      {skills.map((skill, index) => (
                        <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-md text-sm font-medium shadow-sm">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="text-zinc-400 hover:text-red-500 transition-colors focus:outline-none">
                            <X size={14} />
                          </button>
                        </span>
                      ))}

                      <input
                        type="text"
                        value={skillInput}
                        onChange={handleSkillInputChange}
                        onKeyDown={handleSkillKeyDown}
                        className="flex-1 min-w-[150px] bg-transparent outline-none text-sm px-2 py-1 placeholder-zinc-400"
                        placeholder={skills.length === 0 ? "e.g. React, Node.js, Tailwind..." : ""}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Portfolio URL <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                        <input 
                          type="url" 
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                          placeholder="e.g., https://writemypdf.online"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">GitHub URL <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                        <input 
                          type="url" 
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-sm"
                          placeholder="https://github.com/yourusername"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden p-6">
                <h3 className="text-sm font-medium text-zinc-700 mb-4">Resume Document <span className="text-red-500">*</span></h3>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-zinc-300 rounded-xl p-10 text-center hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${resumeFile ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'}`}>
                    {resumeFile ? <CheckCircle size={28} /> : <UploadCloud size={28} />}
                  </div>
                  <p className="text-base font-medium text-zinc-900 mb-1">
                    {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {resumeFile ? `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB` : "PDF standard format (Max. 5MB)"}
                  </p>
                  <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 mt-8">
            <div>
              {successMessage && (
                <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <CheckCircle size={16} /> {successMessage}
                </span>
              )}
            </div>
            
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-lg text-sm font-semibold shadow-md transition-all disabled:opacity-70"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                {isLoading ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;