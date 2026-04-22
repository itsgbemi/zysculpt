import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, CoverLetterData, Job, SavedApplication } from './types';
import { downloadDOCX, downloadTXT, downloadCoverLetterDOCX, downloadCoverLetterTXT } from './utils/exportUtils';
import { generateTailoredContent } from './utils/aiUtils';
import { JobBoard } from './src/components/JobBoard';
import { ApplicationTracker } from './src/components/ApplicationTracker';
import { YourChats } from './src/components/YourChats';
import { Checklist } from './src/components/Checklist';
import { supabase } from './src/lib/supabase';

const INITIAL_RESUME: ResumeData = {
name: "",
email: "",
phone: "",
linkedin: "",
website: "",
summary: "",
experiences: [],
educations: [],
skills: [],
certifications: []
};

const INITIAL_CL: CoverLetterData = {
name: "",
email: "",
phone: "",
linkedin: "",
date: "",
recipientName: "",
recipientTitle: "",
companyName: "",
companyAddress: "",
subject: "",
salutation: "",
body: [],
closing: ""
};

const LANDING_ICON = (className = "w-10 h-10 md:w-16 md:h-16") => (
<svg className={`${className} text-white fill-current inline-block align-middle mr-3`} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
<path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 11.5 12 C 10.671875 12 10 12.671875 10 13.5 C 10 14.328125 10.671875 15 11.5 15 C 12.328125 15 13 14.328125 13 13.5 C 13 12.671875 12.328125 12 11.5 12 Z M 18 13 L 18 15 L 23 15 L 23 13 Z M 20.96875 17.03125 C 20.96875 18.714844 20.292969 19.882813 19.3125 20.71875 C 18.332031 21.554688 17.035156 22 16 22 C 13.878906 22 12.4375 21.140625 11.3125 20.03125 L 9.90625 21.46875 C 11.300781 22.839844 13.320313 24 16 24 C 17.554688 24 19.261719 23.414063 20.625 22.25 C 21.988281 21.085938 22.96875 19.289063 22.96875 17.03125 Z"></path>
</svg>
);

const NEW_CHAT_ICON = (
<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.875 5V5C9.22524 5 7.40037 5 6.24184 6.10301C6.19443 6.14814 6.14814 6.19443 6.10301 6.24184C5 7.40037 5 9.22524 5 12.875V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19H11.125C14.7748 19 16.5996 19 17.7582 17.897C17.8056 17.8519 17.8519 17.8056 17.897 17.7582C19 16.5996 19 14.7748 19 11.125V11.125" stroke="currentColor" strokeWidth="2"></path>
<path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
<path d="M9 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
<path d="M19 8L19 2M16 5H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
);

const CREDIT_ICON = (
<svg className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor">
<path d="M247.355,106.9C222.705,82.241,205.833,39.18,197.46,0c-8.386,39.188-25.24,82.258-49.899,106.917 c-24.65,24.642-67.724,41.514-106.896,49.904c39.188,8.373,82.254,25.235,106.904,49.895c24.65,24.642,41.522,67.72,49.908,106.9 c8.373-39.188,25.24-82.258,49.886-106.917c24.65-24.65,67.724-41.514,106.896-49.904 C315.08,148.422,272.014,131.551,247.355,106.9z"></path>
<path d="M407.471,304.339c-14.714-14.721-24.81-40.46-29.812-63.864c-5.011,23.404-15.073,49.142-29.803,63.872 c-14.73,14.714-40.464,24.801-63.864,29.812c23.408,5.01,49.134,15.081,63.864,29.811c14.73,14.722,24.81,40.46,29.82,63.864 c5.001-23.413,15.081-49.142,29.802-63.872c14.722-14.722,40.46-24.802,63.856-29.82 C447.939,329.14,422.201,319.061,407.471,304.339z"></path>
<path d="M146.352,354.702c-4.207,19.648-12.655,41.263-25.019,53.626c-12.362,12.354-33.968,20.82-53.613,25.027 c19.645,4.216,41.251,12.656,53.613,25.027c12.364,12.362,20.829,33.96,25.036,53.618c4.203-19.658,12.655-41.255,25.023-53.626 c12.354-12.362,33.964-20.82,53.605-25.035c-19.64-4.2-41.251-12.656-53.613-25.019 C159.024,395.966,150.555,374.351,146.352,354.702z"></path>
</svg>
);

const COPY_ICON = (size = "w-4 h-4") => (
<svg className={size} viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
<path d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
);

const SUCCESS_ICON = (size = "w-4 h-4") => (
<svg className={`${size} text-green-500`} viewBox="0 0 24 24" fill="none">
<path fillRule="evenodd" d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M15.2928932,8.29289322 L10,13.5857864 L8.70710678,12.2928932 C8.31658249,11.9023689 7.68341751,11.9023689 7.29289322,12.2928932 C6.90236893,12.6834175 6.90236893,13.3165825 7.29289322,13.7071068 L9.29289322,15.7071068 C9.68341751,16.0976311 10.3165825,16.0976311 10.7071068,15.7071068 L16.7071068,9.70710678 C17.0976311,9.31658249 17.0976311,8.68341751 16.7071068,8.29289322 C16.3165825,7.90236893 15.6834175,7.90236893 15.2928932,8.29289322 Z" fill="currentColor"></path>
</svg>
);

const PROFILE_ICON = (
<svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
</svg>
);

const EXPAND_ICON = (
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
);

const MINIMIZE_ICON = (
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
);

const SIDEBAR_EXPAND_ICON = (
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
);

const formatSize = (bytes: number) => {
if (bytes === 0) return '0 B';
const k = 1024;
const sizes = ['B', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

interface FileInfo {
name: string;
type: string;
size: number;
}

interface ChatSession {
id: string;
title: string;
messages: { role: 'user' | 'ai'; text: string; files?: FileInfo[]; hasResume?: boolean; hasCL?: boolean }[];
resumeData: ResumeData;
clData: CoverLetterData;
}

interface DocConfig {
fontFamily: 'serif';
fontSize: '10pt' | '10.5pt' | '11pt' | '12pt';
lineHeight: '1.2' | '1.4' | '1.5';
headingCase: 'titlecase';
clFormat: 'email' | 'letter';
}

const FileDisplay: React.FC<{ file: FileInfo; onRemove?: () => void; loading?: boolean }> = ({ file, onRemove, loading }) => (
<div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-3 rounded-md text-[10px] text-gray-300 group min-w-[180px] max-w-[240px] shrink-0 h-14">
<div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-blue-400 shrink-0">
{loading ? (
<div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
) : (
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
)}
</div>
<div className="flex flex-col flex-1 min-w-0 text-left">
<span className="font-bold text-white truncate" title={file.name}>{file.name}</span>
<span className="text-gray-400 font-sans truncate text-left">
{file.type.includes('wordprocessingml') ? 'DOCX' : (file.type.split('/')[1] || 'DOC')} • {formatSize(file.size)}
</span>
</div>
{onRemove && (
<button onClick={onRemove} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md transition-all text-gray-400 hover:text-white shrink-0">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
</button>
)}
</div>
);

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
const parts = text.split(/(\*\*.*?\*\*|\n)/g);
return (
<>
{parts.map((part, i) => {
if (part.startsWith('**') && part.endsWith('**')) {
return <strong key={i} className="text-white font-black">{part.slice(2, -2)}</strong>;
}
if (part === '\n') {
return <br key={i} />;
}
return part;
})}
</>
);
};

const TemplateCard: React.FC<{ title: string; subtitle: string; mode: 'resume' | 'cl'; data: ResumeData | CoverLetterData; config: DocConfig; setConfig: (c: DocConfig) => void; children: React.ReactNode; showGetTemplate?: boolean }> = ({ title, subtitle, mode, data, config, setConfig, children, showGetTemplate = true }) => {
const [isOpen, setIsOpen] = useState(false);
const [isCustomizing, setIsCustomizing] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);
const customizeRef = useRef<HTMLDivElement>(null);

useEffect(() => {
const handleClick = (e: MouseEvent) => {
if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) setIsCustomizing(false);
};
document.addEventListener('mousedown', handleClick);
return () => document.removeEventListener('mousedown', handleClick);
}, []);

const roleTitle = mode === 'resume' ? (data as ResumeData).experiences[0]?.role || "" : (data as CoverLetterData).subject.replace(/RE:\s*/i, "").split(' - ')[0] || "";
const cleanRole = roleTitle ? ` - ${roleTitle}` : "";
const filename = `${data.name || "Candidate"}${cleanRole} - ${mode === 'resume' ? 'Resume' : 'Cover Letter'}`.replace(/[<>:"/\\|?*]/g, "");

return (
<div className="flex flex-col gap-8 mb-24 border-b border-gray-900 pb-16 last:border-0">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
<div className="space-y-2">
<h2 className="text-white text-3xl font-black italic tracking-tighter">{title}</h2>
<p className="text-gray-500 text-[11px] font-sans tracking-wide leading-relaxed max-w-md">{subtitle}</p>
</div>
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
{mode !== 'resume' && (
<div className="relative" ref={customizeRef}>
<button onClick={() => setIsCustomizing(!isCustomizing)} className="w-full sm:w-auto bg-black text-white px-6 py-3 text-xs font-black tracking-widest hover:bg-gray-900 border border-white/20 flex items-center justify-center gap-4">
Format options <svg className={`w-4 h-4 transition-transform ${isCustomizing ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
</button>
{isCustomizing && (
<div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-64 bg-[#0d1117] border border-blue-900/30 rounded-lg z-50 shadow-2xl p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
<div className="space-y-4">
<div>
<p className="text-[10px] font-black text-gray-500 tracking-widest mb-2">Send as</p>
<div className="grid grid-cols-2 gap-2">
<button onClick={() => setConfig({...config, clFormat: 'email'})} className={`py-1.5 text-[10px] font-bold border rounded-md transition-all ${config.clFormat === 'email' ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>Email</button>
<button onClick={() => setConfig({...config, clFormat: 'letter'})} className={`py-1.5 text-[10px] font-bold border rounded-md transition-all ${config.clFormat === 'letter' ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>Letter</button>
</div>
</div>
</div>
</div>
)}
</div>
)}
{showGetTemplate && (
<div className="relative" ref={dropdownRef}>
<button onClick={() => setIsOpen(!isOpen)} className="w-full sm:w-auto bg-white text-black px-6 py-3 text-xs font-black tracking-widest hover:bg-gray-200 border border-white flex items-center justify-center gap-4">
Get Template <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
</button>
{isOpen && (
<div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-56 bg-[#0d1117] border border-blue-900/30 rounded-lg z-50 shadow-2xl overflow-hidden p-1">
<button onClick={() => { mode === 'resume' ? downloadDOCX(data as ResumeData, filename, title) : downloadCoverLetterDOCX(data as CoverLetterData, filename, title); setIsOpen(false); }} className="w-full px-4 py-3 text-left text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-md mb-1 transition-colors">Export DOCX</button>
<button onClick={() => { mode === 'resume' ? downloadTXT(data as ResumeData, filename) : downloadTXT(data as ResumeData, filename); setIsOpen(false); }} className="w-full px-4 py-3 text-left text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">Export TXT</button>
</div>
)}
</div>
)}
</div>
</div>
<div className="w-full flex justify-center bg-[#0d0d0d] py-20 border border-gray-900/50">
<div className="origin-top scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100">
<div className="ats-document-container" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
{children}
</div>
</div>
</div>
</div>
);
};

const SectionHeader: React.FC<{ title: string; mode?: 'dark' | 'light'; headingCase?: 'titlecase' }> = ({ title, mode = 'light', headingCase = 'titlecase' }) => {
const displayTitle = title;
return (
<h2 className={`font-bold tracking-widest border-b-[1.5pt] mb-3 mt-4 pb-0.5 text-[11pt] ${mode === 'light' ? 'border-black text-black' : 'border-blue-900/40 text-white'}`}>{displayTitle}</h2>
);
};const AuthPage: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          setMessage('Check your email to verify your account!');
          // Send welcome email via our backend
          fetch('/api/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          }).catch(console.error);
        }
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('Password reset instructions sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans text-white selection:bg-white selection:text-black">
      <div className="max-w-md w-full bg-[#0d1117] border border-blue-900/30 rounded-md p-8 shadow-2xl relative overflow-hidden text-left">
        <div className="flex items-center justify-start gap-3 mb-8">
          <div className="text-blue-500 w-10 h-10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" fill="currentColor" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 11.5 12 C 10.671875 12 10 12.671875 10 13.5 C 10 14.328125 10.671875 15 11.5 15 C 12.328125 15 13 14.328125 13 13.5 C 13 12.671875 12.328125 12 11.5 12 Z M 18 13 L 18 15 L 23 15 L 23 13 Z M 20.96875 17.03125 C 20.96875 18.714844 20.292969 19.882813 19.3125 20.71875 C 18.332031 21.554688 17.035156 22 16 22 C 13.878906 22 12.4375 21.140625 11.3125 20.03125 L 9.90625 21.46875 C 11.300781 22.839844 13.320313 24 16 24 C 17.554688 24 19.261719 23.414063 20.625 22.25 C 21.988281 21.085938 22.96875 19.289063 22.96875 17.03125 Z"></path></g></svg>
          </div>
          <span className="text-blue-500 font-bold tracking-wide text-3xl font-delius lowercase">zysculpt</span>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-black mb-1">
            {mode === 'login' && 'Welcome back'}
            {mode === 'signup' && 'Create an account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-sm text-gray-400">
            {mode === 'login' && <>Don't have an account? <button onClick={() => {setMode('signup'); setError(''); setMessage('');}} className="text-blue-500 font-bold hover:text-blue-400 hover:underline">Sign up for free</button></>}
            {mode === 'signup' && <>Already have an account? <button onClick={() => {setMode('login'); setError(''); setMessage('');}} className="text-blue-500 font-bold hover:text-blue-400 hover:underline">Sign in instead</button></>}
            {mode === 'forgot' && <>Remembered your password? <button onClick={() => {setMode('login'); setError(''); setMessage('');}} className="text-blue-500 font-bold hover:text-blue-400 hover:underline">Sign in</button></>}
          </p>
        </div>

        {error && <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md text-sm">{error}</div>}
        {message && <div className="mb-4 bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-md text-sm">{message}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-gray-400">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.9717 8C20.9717 8 16.9505 13 12.0005 13C7.05051 13 3.0293 8 3.0293 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#05070a] border border-blue-900/30 rounded-md pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="you@example.com" />
            </div>
          </div>
          {mode !== 'forgot' && (
             <div className="space-y-2 relative">
              <div className="flex justify-between items-center w-full">
                <label className="text-xs font-bold text-gray-400">Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => {setMode('forgot'); setError(''); setMessage('');}} className="text-xs font-bold text-blue-500 hover:text-blue-400 hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#05070a] border border-blue-900/30 rounded-md pl-10 pr-12 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md py-3 transition-colors mt-6 shadow-xl disabled:opacity-50 flex items-center justify-center gap-1">
            {loading ? (
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            ) : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
const [user, setUser] = useState<any>(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    setIsAuthenticated(!!session?.user);
    if (session?.user) {
      loadChats(session.user.id);
    }
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    setIsAuthenticated(!!session?.user);
    if (session?.user) {
      loadChats(session.user.id);
    } else {
      setChats([]);
    }
  });

  return () => subscription.unsubscribe();
}, []);

const loadChats = async (userId: string) => {
  const { data: chatData, error: chatError } = await supabase
    .from('chats')
    .select('*, messages(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (chatError) {
    console.error('Error loading chats:', chatError);
    return;
  }

  setChats(chatData.map(chat => ({
    id: chat.id,
    title: chat.title,
    messages: chat.messages.map(msg => ({
      role: msg.role as 'user' | 'ai',
      text: msg.text,
      files: msg.files,
      // For hasResume and hasCL, we might need a better way to store them.
      // Currently, they are not in the messages table, so we'll leave as undefined for now.
    })),
    resumeData: chat.resume_data,
    clData: chat.cl_data
  })));
};

const trackAction = async (action: string) => {
  if (!user) return;
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, userEmail: user.email, action })
  }).catch(console.error);
};
const [view, setView] = useState<'chat' | 'job_board' | 'application_tracker' | 'your_chats' | 'checklist'>('chat');
const [savedApplications, setSavedApplications] = useState<SavedApplication[]>([]);
const [activeTab, setActiveTab] = useState<'resume' | 'cl'>('resume');
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
const [isExpandedViewOpen, setIsExpandedViewOpen] = useState(false);
const [credits, setCredits] = useState(35.00);

const [chats, setChats] = useState<ChatSession[]>([]);
const [currentChatId, setCurrentChatId] = useState<string | null>(null);

const [docConfig, setDocConfig] = useState<DocConfig>({
fontFamily: 'serif',
fontSize: '10.5pt',
lineHeight: '1.4',
headingCase: 'titlecase',
clFormat: 'letter'
});

const [input, setInput] = useState('');
const [isTyping, setIsTyping] = useState(false);
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [loadingFileNames, setLoadingFileNames] = useState<Set<string>>(new Set());

const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
const [renameId, setRenameId] = useState<string | null>(null);
const [renameValue, setRenameValue] = useState('');

const chatEndRef = useRef<HTMLDivElement>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

const [resumeCopied, setResumeCopied] = useState(false);
const [clCopied, setClCopied] = useState(false);
const [clEmailSubjectCopied, setClEmailSubjectCopied] = useState(false);
const [clEmailBodyCopied, setClEmailBodyCopied] = useState(false);

const currentChat = chats.find(c => c.id === currentChatId);
const messages = currentChat?.messages || [];
const resumeData = currentChat?.resumeData || INITIAL_RESUME;
const clData = currentChat?.clData || INITIAL_CL;

useEffect(() => {
if (view === 'chat') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, isTyping, view]);

const fileToPart = async (file: File) => {
setLoadingFileNames(prev => new Set(prev).add(file.name));
try {
const isBinaryInlineSupported = file.type === 'application/pdf' || file.type.startsWith('image/');
if (isBinaryInlineSupported) {
return await new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve) => {
const reader = new FileReader();
reader.onload = () => {
const base64 = (reader.result as string).split(',')[1];
resolve({ inlineData: { data: base64, mimeType: file.type } });
};
reader.readAsDataURL(file);
});
} else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
try {
const arrayBuffer = await file.arrayBuffer();
const mammoth = await import('https://esm.sh/mammoth@1.8.0');
const result = await mammoth.extractRawText({ arrayBuffer });
return { text: `--- DOCX CONTENT: ${file.name} ---\n${result.value}\n--- END ---` };
} catch (docxErr) {
console.error("DOCX extraction failed", docxErr);
return { text: `--- FILE: ${file.name} (Could not extract text from DOCX) ---` };
}
} else {
const text = await file.text();
return { text: `--- FILE CONTENT: ${file.name} ---\n${text}\n--- END ---` };
}
} catch (e) {
return { text: `--- FILE: ${file.name} (Error reading content) ---` };
} finally {
setLoadingFileNames(prev => {
const next = new Set(prev);
next.delete(file.name);
return next;
});
}
};

const handleSend = async () => {
if ((!input.trim() && selectedFiles.length === 0) || isTyping || loadingFileNames.size > 0 || !user) return;
const userText = input;
const fileInfos: FileInfo[] = selectedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }));
let activeId = currentChatId;
const isNewChat = !activeId;

if (!activeId) {
activeId = Date.now().toString();
const newChat: ChatSession = {
id: activeId,
title: userText.length > 30 ? userText.slice(0, 30) + '...' : userText || "New Resume Chat",
messages: [],
resumeData: INITIAL_RESUME,
clData: INITIAL_CL
};
setChats(prev => [newChat, ...prev]);
setCurrentChatId(activeId);

// Save to Supabase
await supabase.from('chats').insert({
id: activeId,
user_id: user.id,
title: newChat.title,
resume_data: newChat.resumeData,
cl_data: newChat.clData
});
}

// Add User Message
const newUserMessage = { role: 'user' as const, text: userText, files: fileInfos };
setChats(prev => prev.map(c => c.id === activeId ? {
...c,
messages: [...c.messages, newUserMessage]
} : c));

await supabase.from('messages').insert({
chat_id: activeId,
role: 'user',
text: userText,
files: fileInfos
});

setInput('');
const filesToProcess = [...selectedFiles];
setSelectedFiles([]);
setIsTyping(true);
try {
const parts = await Promise.all(filesToProcess.map(fileToPart));
const result = await generateTailoredContent(userText, parts, resumeData, clData);
const creditCost = (userText.length + (result.explanation?.length || 0)) / 4000;
setCredits(prev => Math.max(0, prev - creditCost));

const newResume = result.resume || resumeData;
const newCL = result.cl || clData;

// Update chat in local state
setChats(prev => prev.map(c => {
if (c.id === activeId) {
let newTitle = c.title;
if (c.messages.length <= 1 && result.resume?.name) { // Updated check
newTitle = `${result.resume.name}'s Resume`;
}
return {
...c,
title: newTitle,
resumeData: newResume,
clData: newCL,
messages: [...c.messages, { role: 'ai', text: result.explanation || "Updates applied successfully." }]
};
}
return c;
}));

// Update Supabase
await supabase.from('chats').update({
  title: chats.find(c => c.id === activeId)?.title || "New Resume Chat", // This might be stale
  resume_data: newResume,
  cl_data: newCL
}).eq('id', activeId);

await supabase.from('messages').insert({
chat_id: activeId,
role: 'ai',
text: result.explanation || "Updates applied successfully."
});

} catch (error) {
console.error(error);
setChats(prev => prev.map(c => c.id === activeId ? {
...c,
messages: [...c.messages, { role: 'ai', text: "Oops! We hit a snag while processing your request. Please check your file and try sending that again." }]
} : c));
await supabase.from('messages').insert({
chat_id: activeId,
role: 'ai',
text: "Oops! We hit a snag while processing your request. Please check your file and try sending that again."
});
} finally {
setIsTyping(false);
}
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files) {
const newFiles = Array.from(e.target.files) as File[];
setSelectedFiles(prev => [...prev, ...newFiles]);
}
};

const handlePaste = (e: React.ClipboardEvent) => {
const items = e.clipboardData.items;
for (let i = 0; i < items.length; i++) {
if (items[i].type.indexOf('image') !== -1 || items[i].kind === 'file') {
const file = items[i].getAsFile();
if (file) {
setSelectedFiles(prev => [...prev, file]);
}
}
}
};

const handleDrop = (e: React.DragEvent) => {
e.preventDefault();
if (e.dataTransfer.files) {
const droppedFiles = Array.from(e.dataTransfer.files) as File[];
setSelectedFiles(prev => [...prev, ...droppedFiles]);
}
};

const deleteChat = async (id: string) => {
setChats(prev => prev.filter(c => c.id !== id));
if (currentChatId === id) setCurrentChatId(null);
setConfirmDeleteId(null);
await supabase.from('chats').delete().eq('id', id);
};

const renameChat = async (id: string) => {
setChats(prev => prev.map(c => c.id === id ? { ...c, title: renameValue } : c));
setRenameId(null);
await supabase.from('chats').update({ title: renameValue }).eq('id', id);
};

const getFullResumeText = (data: ResumeData) => {
let text = `${data.name}\n${data.email}, ${data.phone}, ${data.linkedin}\n\n`;
text += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`;
if (data.experiences.length > 0) {
text += `WORK EXPERIENCE\n`;
data.experiences.forEach(e => {
text += `${e.role} @ ${e.company} (${e.dates})\n${e.location}\n`;
e.description.forEach(desc => text += `• ${desc}\n`);
text += `\n`;
});
}
if (data.educations.length > 0) {
text += `EDUCATION\n`;
data.educations.forEach(edu => {
text += `${edu.school} - ${edu.degree} (${edu.dates})\n`;
});
text += `\n`;
}
if (data.skills.length > 0) {
text += `SKILLS\n`;
data.skills.forEach(s => {
text += `${s.category}: ${s.items.join(', ')}\n`;
});
text += `\n`;
}
return text;
};

const getFullCLText = (data: CoverLetterData) => {
const displayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
let text = `${data.name}\n${data.email} | ${data.phone} | ${data.linkedin}\n\n`;
text += `${displayDate}\n\n`;
text += `${data.recipientName}\n${data.recipientTitle}\n${data.companyName}\n${data.companyAddress}\n\n`;
text += `RE: ${data.subject}\n\n`;
text += `${data.salutation}\n\n`;
text += `${data.body.join('\n\n')}\n\n`;
text += `${data.closing}\n${data.name}`;
return text;
};

const copyToClipboard = (text: string, type: 'resume' | 'cl') => {
navigator.clipboard.writeText(text);
if (type === 'resume') {
setResumeCopied(true);
setTimeout(() => setResumeCopied(false), 2000);
} else {
setClCopied(true);
setTimeout(() => setClCopied(false), 2000);
}
};

const copyClEmailSubject = () => {
navigator.clipboard.writeText(clData.subject);
setClEmailSubjectCopied(true);
setTimeout(() => setClEmailSubjectCopied(false), 2000);
};

const copyClEmailBody = () => {
const bodyText = `${clData.salutation}\n\n${clData.body.join('\n\n')}\n\n${clData.closing}\n${clData.name}`;
navigator.clipboard.writeText(bodyText);
setClEmailBodyCopied(true);
setTimeout(() => setClEmailBodyCopied(false), 2000);
};

const openExpandedView = () => {
setIsExpandedViewOpen(true);
setIsSidebarMinimized(true);
};

const Sidebar = () => (
<>
{isSidebarOpen && (
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
)}
{isSidebarMinimized && !isExpandedViewOpen && (
<div className="fixed top-4 left-4 z-[110] bg-[#0d1117]/90 backdrop-blur-lg border border-blue-900/40 rounded-md px-4 py-2 flex items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-left duration-300 pointer-events-auto">
<button onClick={() => setIsSidebarMinimized(false)} className="text-blue-400 hover:text-white p-1 transition-colors">
{SIDEBAR_EXPAND_ICON}
</button>
<div className="w-px h-4 bg-blue-900/30"></div>
<button onClick={() => { setCurrentChatId(null); setView('chat'); setIsSidebarMinimized(false); setIsExpandedViewOpen(false); }} className="text-gray-400 hover:text-white p-1 transition-colors">
{NEW_CHAT_ICON}
</button>
</div>
)}
<div className={`fixed inset-y-0 left-0 z-[100] w-72 bg-[#05070a] border-r border-blue-900/20 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : (isSidebarMinimized ? '-translate-x-full' : '-translate-x-full lg:translate-x-0')}`}>
<div className="p-6 flex flex-col h-full">
<div className="flex items-center justify-between mb-10">
<div className="flex items-center gap-2">
  <div className="text-blue-500 w-8 h-8 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 11.5 12 C 10.671875 12 10 12.671875 10 13.5 C 10 14.328125 10.671875 15 11.5 15 C 12.328125 15 13 14.328125 13 13.5 C 13 12.671875 12.328125 12 11.5 12 Z M 18 13 L 18 15 L 23 15 L 23 13 Z M 20.96875 17.03125 C 20.96875 18.714844 20.292969 19.882813 19.3125 20.71875 C 18.332031 21.554688 17.035156 22 16 22 C 13.878906 22 12.4375 21.140625 11.3125 20.03125 L 9.90625 21.46875 C 11.300781 22.839844 13.320313 24 16 24 C 17.554688 24 19.261719 23.414063 20.625 22.25 C 21.988281 21.085938 22.96875 19.289063 22.96875 17.03125 Z"></path></g></svg>
  </div>
  <span className="text-blue-500 font-bold tracking-wide text-xl font-delius lowercase">zysculpt</span>
</div>
<div className="flex items-center gap-1">
<button onClick={() => setIsSidebarMinimized(true)} className="hidden lg:flex text-gray-500 hover:text-white p-1.5 transition-colors">
{MINIMIZE_ICON}
</button>
<button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white p-1.5 border border-blue-900/30 rounded-md flex items-center justify-center">
<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 3v18"></path></svg>
</button>
</div>
</div>
<div className="relative mb-10 overflow-hidden rounded-md">
<button onClick={() => { setCurrentChatId(null); setView('chat'); setIsSidebarOpen(false); setIsExpandedViewOpen(false); }} className="relative w-full flex items-center justify-center gap-3 bg-blue-600 border-none text-white hover:bg-blue-700 rounded-md py-3 px-4 transition-all font-bold text-sm tracking-normal shadow-xl active:scale-95">
<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z" fill="currentColor"></path> <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" fill="currentColor"></path> <path d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z" fill="currentColor"></path> <path fillRule="evenodd" clipRule="evenodd" d="M22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 13.7183 1.65371 15.3445 2.37213 16.7869C2.47933 17.0021 2.50208 17.2219 2.4526 17.4068L1.857 19.6328C1.44927 21.1566 2.84337 22.5507 4.3672 22.143L6.59324 21.5474C6.77814 21.4979 6.99791 21.5207 7.21315 21.6279C8.65553 22.3463 10.2817 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12ZM12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C10.5189 21.25 9.12121 20.9025 7.88191 20.2852C7.38451 20.0375 6.78973 19.9421 6.20553 20.0984L3.97949 20.694C3.57066 20.8034 3.19663 20.4293 3.30602 20.0205L3.90163 17.7945C4.05794 17.2103 3.96254 16.6155 3.7148 16.1181C3.09752 14.8788 2.75 13.4811 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75Z" fill="currentColor"></path> </g></svg>
<span>New Chat</span>
</button>
</div>
<div className="flex-1 overflow-y-auto scrollbar-hide">
<div className="mb-6 space-y-1">
<button onClick={() => setView('your_chats')} className={`w-full text-left px-4 py-3 text-sm rounded-md transition-all font-bold ${view === 'your_chats' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Your Chats</button>
<button onClick={() => setView('job_board')} className={`w-full text-left px-4 py-3 text-sm rounded-md transition-all font-bold ${view === 'job_board' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Job Board</button>
<button onClick={() => setView('application_tracker')} className={`w-full text-left px-4 py-3 text-sm rounded-md transition-all font-bold ${view === 'application_tracker' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Application Tracker</button>

<button onClick={() => setView('checklist')} className={`w-full text-left px-4 py-3 text-sm rounded-md transition-all font-bold ${view === 'checklist' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Checklist</button>
</div>
<h3 className="text-base font-bold text-white tracking-normal mb-4 px-4">Recent Chats</h3>
<div className="space-y-1.5 px-2">
{chats.length > 0 ? chats.map(c => (
<div key={c.id} className="relative group/item">
<button onClick={() => { setCurrentChatId(c.id); setView('chat'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 text-sm transition-all truncate pr-10 border ${c.id === currentChatId ? 'bg-white/10 text-white font-bold border-white/20 rounded-md' : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5 rounded-md'}`}>
{c.title}
</button>
<button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === c.id ? null : c.id); }} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-opacity ${c.id === currentChatId ? 'opacity-100 text-white' : 'opacity-0 group-hover/item:opacity-100 text-gray-500 hover:text-white'}`}>
<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
</button>
{activeMenuId === c.id && (
<div className="absolute right-0 top-full mt-1 bg-[#0d1117] border border-blue-900/30 rounded-lg shadow-xl z-[110] w-32 p-1">
<button onClick={(e) => { e.stopPropagation(); setRenameId(c.id); setRenameValue(c.title); setActiveMenuId(null); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white rounded-md transition-colors mb-0.5">Rename</button>
<button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(c.id); setActiveMenuId(null); }} className="w-full text-left px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-colors">Delete</button>
</div>
)}
</div>
)) : (
<div className="px-3 py-2 opacity-50">
<p className="text-xs text-gray-500">Nothing yet. Click the "New Chat" button to begin</p>
</div>
)}
</div>
</div>
<div className="pt-6 border-t border-blue-900/20 mt-auto relative" ref={(node) => {
  // simple outside click logic for profile menu could be added here
}}>
{isProfileMenuOpen && (
<div className="absolute bottom-full left-0 mb-2 w-full bg-[#0d1117] border border-blue-900/30 rounded-lg shadow-xl z-[110] p-1">
<button onClick={async () => { await supabase.auth.signOut(); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-colors">
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 3.25C12.4142 3.25 12.75 3.58579 12.75 4C12.75 4.41421 12.4142 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C12.4142 19.25 12.75 19.5858 12.75 20C12.75 20.4142 12.4142 20.75 12 20.75C7.16751 20.75 3.25 16.8325 3.25 12C3.25 7.16751 7.16751 3.25 12 3.25Z" fill="currentColor"></path> <path d="M16.4697 9.53033C16.1768 9.23744 16.1768 8.76256 16.4697 8.46967C16.7626 8.17678 17.2374 8.17678 17.5303 8.46967L20.5303 11.4697C20.8232 11.7626 20.8232 12.2374 20.5303 12.5303L17.5303 15.5303C17.2374 15.8232 16.7626 15.8232 16.4697 15.5303C16.1768 15.2374 16.1768 14.7626 16.4697 14.4697L18.1893 12.75H10C9.58579 12.75 9.25 12.4142 9.25 12C9.25 11.5858 9.58579 11.25 10 11.25H18.1893L16.4697 9.53033Z" fill="currentColor"></path> </g></svg>
Logout
</button>
</div>
)}
<button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors group">
<div className="flex items-center gap-3">
<img src="https://res.cloudinary.com/dibudvaqm/image/upload/v1776790504/images3_fykbsf.png" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-blue-900/30" />
<div className="flex flex-col items-start gap-0 text-left">
  <span className="text-gray-300 text-sm font-bold group-hover:text-white transition-colors">You</span>
  <span className="text-gray-500 text-[10px] font-sans">Free plan</span>
</div>
</div>
<svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
</button>
</div>
</div>
</div>
</>
);

const renderMessageInput = (isCentered = false) => (
<div className={isCentered ? "w-full max-w-2xl mt-4 pointer-events-auto" : `fixed bottom-0 left-0 right-0 p-4 md:p-6 z-[80] pointer-events-none transition-[margin] duration-300 ${!isSidebarMinimized ? 'lg:ml-72' : 'lg:ml-0'} ${isExpandedViewOpen ? 'lg:mr-[450px] xl:mr-[600px]' : ''}`}>
<div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="max-w-2xl mx-auto w-full bg-[#0d1117] border border-blue-900/30 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-3 md:p-4 space-y-2 pointer-events-auto transition-all hover:border-blue-700/40 overflow-hidden flex flex-col box-border">
{selectedFiles.length > 0 && (
<div className="flex flex-nowrap overflow-x-auto gap-3 px-3 pb-2 custom-scrollbar w-full max-w-full min-w-0">
{selectedFiles.map((f, i) => (
<FileDisplay key={i} file={{ name: f.name, type: f.type, size: f.size }} loading={loadingFileNames.has(f.name)} onRemove={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}/>
))}
</div>
)}
<div className="flex flex-col w-full min-w-0">
<textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} onPaste={handlePaste} placeholder="Ask Zysculpt to tailor resume, letter..." className="w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-white text-base resize-none h-12 md:h-14 px-4 py-2 font-normal placeholder:text-gray-500" />
<div className="flex items-center justify-between px-3 pb-1">
<div className="flex items-center gap-2 bg-blue-900/10 rounded-md px-3 py-1.5 border border-blue-900/30 no-print">
<div className="text-blue-500">{CREDIT_ICON}</div>
<span className="text-gray-400 text-[10px] font-light tracking-wide">{credits.toFixed(2)} Credits Left</span>
</div>
<div className="flex items-center gap-1">
<input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
<button onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-white transition-all transform hover:scale-110 p-2">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
</button>
<button onClick={handleSend} disabled={isTyping || (!input.trim() && selectedFiles.length === 0) || loadingFileNames.size > 0} className={`p-3 rounded-md transition-all shadow-xl ${isTyping || (!input.trim() && selectedFiles.length === 0) || loadingFileNames.size > 0 ? 'bg-gray-800 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'}`}>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
</button>
</div>
</div>
</div>
</div>
</div>
);

const ResumeTemplates = () => (
<div className="flex flex-row gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scroll-container px-4">
<div className="snap-center shrink-0 w-full lg:w-[800px]">
<TemplateCard title="CLASSIC RESUME" subtitle="ATS-optimized format globally approved by recruiters." mode="resume" data={resumeData} config={docConfig} setConfig={setDocConfig}>
<div className="resume-paper">
<div className="resume-body" style={{ fontSize: docConfig.fontSize, lineHeight: docConfig.lineHeight }}>
<header className="mb-6 text-left">
<h1 className="text-[22pt] font-bold text-black leading-none mb-1">{resumeData.name || "YOUR NAME"}</h1>
<p className="text-[10pt] text-gray-700">{resumeData.email}, {resumeData.phone}, {resumeData.linkedin}</p>
</header>
<SectionHeader title="Professional Summary" headingCase={docConfig.headingCase} />
<p className="text-justify">{resumeData.summary}</p>
<SectionHeader title="Work Experience" headingCase={docConfig.headingCase} />
{resumeData.experiences.map(exp => (
<div key={exp.id} className="mb-4">
<div className="flex justify-between font-bold"><span>{exp.role}</span><span>{exp.dates}</span></div>
<p className="italic mb-1">{exp.company}, {exp.location}</p>
<ul className="list-disc ml-5 space-y-0.5">{exp.description.map((l, idx) => <li key={idx}>{l}</li>)}</ul>
</div>
))}
<SectionHeader title="Education" headingCase={docConfig.headingCase} />
{resumeData.educations.map(edu => (
<div key={edu.id} className="mb-3">
<div className="flex justify-between font-bold"><span>{edu.school}</span><span>{edu.dates}</span></div>
<p className="text-[10pt]">{edu.degree}{edu.concentration ? `, ${edu.concentration}` : ''}</p>
</div>
))}
<SectionHeader title="Skills" headingCase={docConfig.headingCase} />
{resumeData.skills.map((s, idx) => (
<p key={idx} className="text-[10pt] mb-1">
<span className="font-bold">{s.category}:</span> {s.items.join(', ')}
</p>
))}
</div>
</div>
</TemplateCard>
</div>
</div>
);

const CoverLetterTemplates = () => {
const isEmail = docConfig.clFormat === 'email';
const currentDay = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
return (
<div className="flex flex-col">
<TemplateCard title="CLASSIC COVER" subtitle="Optimized layout designed to get the attention of recruiters." mode="cl" data={clData} config={docConfig} setConfig={setDocConfig} showGetTemplate={!isEmail}>
<div className="resume-paper">
<div className={`resume-body px-8`} style={{ fontSize: docConfig.fontSize, lineHeight: docConfig.lineHeight }}>
{!isEmail ? (
<>
<header className={`text-center border-b-2 border-black pb-4 mb-8`}>
<h1 className={`text-[22pt] font-bold tracking-tighter text-black`}>{clData.name || "YOUR NAME"}</h1>
<p className={`text-[9pt] text-black tracking-widest`}>{clData.email}, {clData.phone}, {clData.linkedin}</p>
</header>
<div className={`space-y-6`}>
<p>{currentDay}</p>
<div><p className="font-bold">{clData.recipientName}</p><p>{clData.recipientTitle}</p><p>{clData.companyName}</p><p>{clData.companyAddress}</p></div>
<p className="font-bold">RE: {clData.subject}</p>
<p>{clData.salutation}</p>
{clData.body.map((p, i) => <p key={i} className="text-justify">{p}</p>)}
<div className="pt-4"><p>{clData.closing}</p><p className="font-bold mt-2">{clData.name}</p></div>
</div>
</>
) : (
<div className="space-y-10 pt-4 text-left font-serif">
  <div className="bg-[#0d1117] border border-blue-900/20 rounded-md overflow-hidden relative group">
    <div className="bg-[#161b22] px-6 py-3 flex justify-between items-center border-b border-blue-900/20">
      <span className="text-[10px] font-sans font-black text-gray-400 tracking-widest">Email Subject Line</span>
      <button onClick={copyClEmailSubject} className="font-sans text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 bg-[#161b22] border border-blue-900/30 px-3 py-1.5 rounded-md shadow-sm">
        {clEmailSubjectCopied ? SUCCESS_ICON("w-3.5 h-3.5") : COPY_ICON("w-3.5 h-3.5")}
        {clEmailSubjectCopied ? 'Copied' : 'Copy Subject'}
      </button>
    </div>
    <div className="p-6">
      <p className="text-[12pt] font-bold text-white selection:bg-blue-900/50">{clData.subject}</p>
    </div>
  </div>
  
  <div className="bg-[#0d1117] border border-blue-900/20 rounded-md overflow-hidden shadow-sm relative group">
    <div className="bg-[#161b22] px-6 py-3 flex justify-between items-center border-b border-blue-900/20">
      <span className="text-[10px] font-sans font-black text-gray-400 tracking-widest">Email Message Content</span>
      <button onClick={copyClEmailBody} className="font-sans text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 bg-[#161b22] border border-blue-900/30 px-3 py-1.5 rounded-md shadow-sm">
        {clEmailBodyCopied ? SUCCESS_ICON("w-3.5 h-3.5") : COPY_ICON("w-3.5 h-3.5")}
        {clEmailBodyCopied ? 'Copied' : 'Copy Body'}
      </button>
    </div>
    <div className="p-8 text-[10.5pt] text-gray-300 space-y-4 leading-relaxed selection:bg-blue-900/50">
      <p>{clData.salutation}</p>
      {clData.body.map((p, i) => <p key={i} className="text-justify">{p}</p>)}
      <div className="pt-6 border-t border-blue-900/20">
        <p>{clData.closing}</p>
        <p className="font-bold mt-1 text-white">{clData.name}</p>
        <p className="text-[9pt] text-gray-500 mt-2">{clData.email} | {clData.phone} | {clData.linkedin}</p>
      </div>
    </div>
  </div>
</div>
)}
</div>
</div>
</TemplateCard>
</div>
);
};



if (!isAuthenticated) {
  return <AuthPage onLogin={(newUser) => { setUser(newUser); setIsAuthenticated(true); }} />;
}

return (
<div className="h-screen bg-[#020617] flex font-sans selection:bg-white selection:text-black overflow-hidden relative">
<Sidebar />
<div className={`flex-1 flex flex-row transition-[margin] duration-300 relative overflow-hidden ${!isSidebarMinimized ? 'lg:ml-72' : 'lg:ml-0'}`}>
<div className="flex-1 flex flex-col relative overflow-hidden">
<div className="bg-[#020617]/80 backdrop-blur-xl z-[90] flex items-center justify-between p-4 lg:p-6 shrink-0">
<button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white lg:hidden">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
</button>
<div className="flex-1 hidden lg:block"></div>
</div>
<div className={`flex-1 overflow-y-scroll scroll-container px-6 md:px-12 ${view === 'chat' && messages.length > 0 ? 'pb-[200px]' : ''}`}>
{view === 'chat' && (
  messages.length === 0 ? (
    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
    <div className="text-white max-w-2xl text-center px-4 w-full">
    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight block mb-2">
    {LANDING_ICON()}
    Let's get you hired!
    </h1>
    <p className="text-gray-500 text-lg md:text-xl font-medium">Share the job you want and your experience.</p>
    {renderMessageInput(true)}
    </div>
    </div>
  ) : (
    <div className="max-w-3xl mx-auto space-y-12 py-10 w-full">

{messages.map((msg, i) => (
<div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
<span className="text-[10px] font-sans text-gray-600 mb-3 tracking-[0.2em]">{msg.role === 'user' ? 'YOU' : 'Zysculpt'}</span>
<div className={`p-5 md:p-7 text-sm leading-relaxed max-w-[95%] rounded-md ${msg.role === 'user' ? 'bg-[#0f172a] border border-blue-900/30 text-white font-medium' : 'bg-[#0d1117] text-gray-400 border border-blue-900/20 shadow-lg'}`}>
{msg.role === 'ai' ? <FormattedMessage text={msg.text} /> : msg.text}
{msg.files && msg.files.length > 0 && (
<div className="mt-6 flex flex-wrap gap-3 overflow-x-auto pb-2 custom-scrollbar">
{msg.files.map((f, j) => <FileDisplay key={j} file={f} />)}
</div>
)}
{(msg.hasResume || msg.hasCL) && (
<div className="mt-8 space-y-6">
{msg.hasResume && (
<div className="bg-[#05070a] border border-blue-900/30 rounded-md overflow-hidden">
<div className="bg-[#0d1117] px-5 py-4 flex items-center justify-between border-b border-blue-900/30">
<span className="text-xs font-bold text-white tracking-wider">Resume</span>
<div className="flex items-center gap-0.5">
<button onClick={() => copyToClipboard(getFullResumeText(resumeData), 'resume')} className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">{resumeCopied ? SUCCESS_ICON("w-6 h-6") : COPY_ICON("w-6 h-6")}</button>
<button onClick={() => {
const role = resumeData.experiences[0]?.role || "Candidate";
const fname = `${resumeData.name || "User"} - ${role} - Resume`.replace(/[<>:"/\\|?*]/g, "");
downloadDOCX(resumeData, fname, "CLASSIC RESUME");
}} className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
<button onClick={openExpandedView} className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">
{EXPAND_ICON}
</button>
</div>
</div>
<div className="bg-[#05070a] text-gray-300 p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
<header className="mb-4 text-left">
<h1 className="text-lg font-bold text-white">{resumeData.name || "YOUR NAME"}</h1>
<p className="text-[9pt] text-gray-500 mt-1">{resumeData.email}, {resumeData.phone}, {resumeData.linkedin}</p>
</header>
<SectionHeader title="Professional Summary" mode="dark" />
<p className="text-[10pt] text-gray-400 leading-relaxed text-left">{resumeData.summary}</p>
<SectionHeader title="Work Experience" mode="dark" />
{resumeData.experiences.map(e => (
<div key={e.id} className="mb-4">
<div className="flex justify-between font-bold text-white text-[10pt]"><span>{e.role}</span><span>{e.dates}</span></div>
<p className="italic text-gray-500 text-[9pt]">{e.company}, {e.location}</p>
<ul className="list-disc ml-4 mt-1 space-y-0.5">{e.description.map((l, idx) => <li key={idx} className="text-[9pt] text-gray-400">{l}</li>)}</ul>
</div>
))}
<SectionHeader title="Education" mode="dark" />
{resumeData.educations.map(edu => (
<div key={edu.id} className="mb-3">
<div className="flex justify-between font-bold text-white text-[10pt]"><span>{edu.school}</span><span>{edu.dates}</span></div>
<p className="text-gray-400 text-[9pt]">{edu.degree}{edu.concentration ? `, ${edu.concentration}` : ''}</p>
</div>
))}
<SectionHeader title="Skills" mode="dark" />
{resumeData.skills.map((s, idx) => (
<p key={idx} className="text-[9pt] text-gray-400 mb-1">
<span className="font-bold text-white">{s.category}:</span> {s.items.join(', ')}
</p>
))}
</div>
</div>
)}
{msg.hasCL && (
<div className="bg-[#05070a] border border-blue-900/30 rounded-md overflow-hidden">
<div className="bg-[#0d1117] px-5 py-4 flex items-center justify-between border-b border-blue-900/30">
<span className="text-xs font-bold text-white tracking-wider">Cover Letter</span>
<div className="flex items-center gap-0.5">
<button onClick={() => copyToClipboard(getFullCLText(clData), 'cl')} className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">{clCopied ? SUCCESS_ICON("w-6 h-6") : COPY_ICON("w-6 h-6")}</button>
<button onClick={() => {
const role = clData.subject.replace(/RE:\s*/i, "").split(' - ')[0] || "Candidate";
const fname = `${clData.name || "User"} - ${role} - Cover Letter`.replace(/[<>:"/\\|?*]/g, "");
downloadCoverLetterDOCX(clData, fname, "CLASSIC COVER");
}} className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
<button onClick={openExpandedView} className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">
{EXPAND_ICON}
</button>
</div>
</div>
<div className="bg-[#05070a] text-gray-400 p-8 max-h-[400px] overflow-y-auto custom-scrollbar font-sans text-[10pt] leading-relaxed">
<p className="mb-6">{clData.name}<br/>{clData.email}<br/>{clData.phone}</p>
<p className="mb-6">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
<p className="mb-6">{clData.recipientName}<br/>{clData.recipientTitle}<br/>{clData.companyName}</p>
<p className="mb-6 font-bold">RE: {clData.subject}</p>
<p className="mb-4">{clData.salutation}</p>
{clData.body.map((p, i) => <p key={i} className="mb-4 text-justify">{p}</p>)}
<p className="mt-6">{clData.closing}<br/>{clData.name}</p>
</div>
</div>
)}
</div>
)}
</div>
{msg.role === 'ai' && i === messages.length - 1 && (msg.hasResume || msg.hasCL) && (
<button onClick={openExpandedView} className="mt-5 flex items-center gap-3 text-sm font-black text-white hover:text-gray-300 transition-all group tracking-[0.2em]">
<span className="font-sans">Switch Template</span> 
<svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
</button>
)}
</div>
))}
{isTyping && (
<div className="flex flex-col items-start animate-pulse">
<span className="text-[10px] font-sans text-gray-600 mb-3 tracking-[0.2em]">Zysculpt</span>
<div className="p-5 bg-[#0d1117] border border-blue-900/30 rounded-md flex items-center gap-4">
<div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-900/40 border-t-white"></div>
<span className="font-sans text-[10px] text-gray-500 tracking-widest">Processing...</span>
</div>
</div>
)}
<div ref={chatEndRef} />
</div>
)
)}

{view === 'your_chats' && <YourChats chats={chats} onSelectChat={(id) => { setCurrentChatId(id); setView('chat'); setIsSidebarOpen(false); }} />}
{view === 'job_board' && <JobBoard savedApplications={savedApplications} onBookmark={(job) => { setSavedApplications([...savedApplications, { ...job, status: 'Saved', dateAdded: new Date().toISOString() } as SavedApplication]); trackAction('first_job'); }} />}
{view === 'application_tracker' && <ApplicationTracker applications={savedApplications} onUpdateStatus={(id, status) => setSavedApplications(savedApplications.map(a => a.id === id ? { ...a, status } : a))} onAddExternal={(app) => { setSavedApplications([...savedApplications, app]); trackAction('first_job'); }} />}

{view === 'checklist' && <Checklist onTaskComplete={() => trackAction('first_task')} />}

</div>
{view === 'chat' && messages.length > 0 && renderMessageInput()}
</div>
{isExpandedViewOpen && (
<div className="fixed inset-0 z-[120] bg-[#020617] w-full animate-in fade-in duration-300">
<TemplateSelectionPanel />
</div>
)}
</div>
{confirmDeleteId && (
<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
<div className="bg-[#0d1117] border border-blue-900/30 rounded-md p-8 max-sm w-full shadow-2xl text-center">
<h2 className="text-xl font-bold text-white mb-4">Delete this chat?</h2>
<p className="text-gray-400 text-sm mb-8">This will permanently remove your conversation and any generated documents. You can't undo this action.</p>
<div className="flex flex-col gap-3">
<button onClick={() => deleteChat(confirmDeleteId)} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold transition-all">Delete Permanently</button>
<button onClick={() => setConfirmDeleteId(null)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-md font-bold transition-all border border-blue-900/20">Keep Chat</button>
</div>
</div>
</div>
)}
{renameId && (
<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
<div className="bg-[#0d1117] border border-blue-900/30 rounded-md p-8 max-sm w-full shadow-2xl">
<h2 className="text-xl font-bold text-white mb-4 text-center">Rename Chat</h2>
<input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && renameChat(renameId)} className="w-full bg-white/5 border border-blue-900/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-blue-500 mb-6" autoFocus />
<div className="flex flex-col gap-3">
<button onClick={() => renameChat(renameId)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-all">Rename</button>
<button onClick={() => setRenameId(null)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-md font-bold transition-all border border-blue-900/20">Cancel</button>
</div>
</div>
</div>
)}
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap');
.font-sans, font-family-sans { font-family: 'Google Sans', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scroll-container::-webkit-scrollbar { width: 6px; }
.scroll-container::-webkit-scrollbar-track { background: transparent; }
.scroll-container::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
.scroll-container::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.4); }
.ats-document-container { width: 210mm; min-height: 297mm; background: white; box-shadow: 0 0 100px rgba(0,0,0,0.4); }
.resume-paper { width: 100%; min-height: 297mm; padding: 0.75in; color: black; background: white; box-sizing: border-box; }
.resume-body { color: #1a1a1a; font-family: "Times New Roman", Times, serif; }
h1, h2, h3, h4, p, li { margin: 0; padding: 0; }
.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.2); }
`}</style>
</div>
);
};

export default App;