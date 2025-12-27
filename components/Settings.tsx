
import React, { useRef, useState, useEffect } from 'react';
import { User, Bell, Shield, CreditCard, ExternalLink, Menu, LogOut, ChevronRight, CheckCircle, Save, FileText, Mail, Phone, MapPin, Linkedin, Loader2 } from 'lucide-react';
import { Theme, UserProfile } from '../types';

interface SettingsProps {
  onToggleMobile?: () => void;
  theme: Theme;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Settings: React.FC<SettingsProps> = ({ onToggleMobile, theme, userProfile, setUserProfile }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-[#0F172A]';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBg = theme === 'dark' ? 'bg-[#121212] border-[#2a2a2a]' : 'bg-white border-slate-200 shadow-sm';
  const sectionTitle = `text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-[#555]' : 'text-slate-400'}`;
  const inputBg = theme === 'dark' ? 'bg-[#191919] border-white/5' : 'bg-slate-50 border-slate-200';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (field: keyof UserProfile, value: string) => {
    setIsSaving(true);
    setUserProfile(prev => ({ ...prev, [field]: value }));
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0);
      const reader = new FileReader();
      
      reader.onprogress = (data) => {
        if (data.lengthComputable) {
          setUploadProgress(Math.round((data.loaded / data.total) * 100));
        }
      };

      reader.onload = (ev) => {
        setUploadProgress(100);
        setTimeout(() => {
          handleUpdate('baseResumeText', ev.target?.result as string);
          setUploadProgress(null);
        }, 500);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`flex flex-col h-full transition-colors ${theme === 'dark' ? 'bg-[#191919]' : 'bg-[#F8FAFC]'}`}>
      <header className={`p-4 md:p-6 border-b flex items-center justify-between sticky top-0 z-10 transition-colors ${theme === 'dark' ? 'bg-[#191919] border-[#2a2a2a]' : 'bg-white border-[#e2e8f0]'}`}>
        <div className="flex items-center gap-3">
          <button onClick={onToggleMobile} className="md:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={textPrimary}>
              <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h2 className={`text-lg md:text-xl font-bold ${textPrimary}`}>Account Settings</h2>
        </div>
        <div className="flex items-center gap-2">
          {isSaving ? (
            <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold animate-pulse">
               <Loader2 size={14} className="animate-spin" /> Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
               <CheckCircle size={14} /> All changes saved
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="space-y-12 pb-24">
          {/* Profile Section */}
          <section>
            <h2 className={sectionTitle}><User size={14} /> Professional Information</h2>
            <div className={`p-8 rounded-[32px] border ${cardBg}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50 ml-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                    <input 
                      value={userProfile.fullName}
                      onChange={(e) => handleUpdate('fullName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:border-indigo-500 ${inputBg} ${textPrimary}`}
                      placeholder="e.g. Alex Johnson"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50 ml-1">Job Title</label>
                  <input 
                    value={userProfile.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:border-indigo-500 ${inputBg} ${textPrimary}`}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50 ml-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                    <input 
                      value={userProfile.email}
                      onChange={(e) => handleUpdate('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:border-indigo-500 ${inputBg} ${textPrimary}`}
                      placeholder="alex@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50 ml-1">Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                    <input 
                      value={userProfile.phone}
                      onChange={(e) => handleUpdate('phone', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:border-indigo-500 ${inputBg} ${textPrimary}`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50 ml-1">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                    <input 
                      value={userProfile.location}
                      onChange={(e) => handleUpdate('location', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:border-indigo-500 ${inputBg} ${textPrimary}`}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50 ml-1">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                    <input 
                      value={userProfile.linkedIn}
                      onChange={(e) => handleUpdate('linkedIn', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:border-indigo-500 ${inputBg} ${textPrimary}`}
                      placeholder="linkedin.com/in/alexj"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Base Resume Section */}
          <section>
            <h2 className={sectionTitle}><FileText size={14} /> Master Professional History</h2>
            <div className={`p-8 rounded-[32px] border ${cardBg}`}>
              <p className={`text-sm mb-6 ${textSecondary} leading-relaxed`}>
                Upload your latest resume. This becomes the primary source of information for the AI, ensuring your history and details are automatically used in every new document you create.
              </p>
              
              <div className="flex flex-col gap-4">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".txt,.pdf,.docx" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-3 p-12 border-2 border-dashed rounded-3xl transition-all relative overflow-hidden ${
                    userProfile.baseResumeText ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-indigo-500/20 hover:border-indigo-500 bg-indigo-500/5'
                  }`}
                >
                  {uploadProgress !== null && (
                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                       <div className="w-1/2 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                       </div>
                    </div>
                  )}
                  {userProfile.baseResumeText ? <CheckCircle className="text-emerald-500" size={32} /> : <FileText size={32} className="text-indigo-500" />}
                  <span className={`font-bold ${textPrimary}`}>
                    {userProfile.baseResumeText ? 'Master Resume Updated' : 'Click to upload your Master CV'}
                  </span>
                </button>
                
                {userProfile.baseResumeText && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Preview</p>
                    <div className={`p-4 rounded-2xl text-[10px] font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border ${inputBg} opacity-50`}>
                      {userProfile.baseResumeText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
