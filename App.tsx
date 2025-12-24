
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AIResumeBuilder from './components/AIResumeBuilder';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import JobSearch from './components/JobSearch';
import Settings from './components/Settings';
import Documents from './components/Documents';
import { AppView, ChatSession, Theme } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.RESUME_BUILDER);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('zysculpt-theme') as Theme) || 'dark');

  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'default',
      title: 'New Resume',
      lastUpdated: Date.now(),
      type: 'resume',
      messages: [{
        id: '1',
        role: 'assistant',
        content: "Welcome to Zysculpt! I'm your AI Resume Builder. I'll help you craft a professional resume tailored to your target roles.\n\nTo start, please **paste a job description** or **upload your existing resume** using the paperclip icon.",
        timestamp: Date.now(),
      }],
      jobDescription: '',
      resumeText: '',
      finalResume: null
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('default');

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('zysculpt-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates, lastUpdated: Date.now() } : s));
  };

  const createNewSession = (type: 'resume' | 'cover-letter' = 'resume') => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: type === 'resume' ? 'New Resume' : 'New Cover Letter',
      lastUpdated: Date.now(),
      type: type,
      messages: [{
        id: '1',
        role: 'assistant',
        content: type === 'resume' 
          ? "I'm ready to build your next resume. Paste a job description or upload your current CV to begin." 
          : "Let's write a compelling cover letter. Tell me about the role you're applying for and why you're a great fit.",
        timestamp: Date.now(),
      }],
      jobDescription: '',
      resumeText: '',
      finalResume: null
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setCurrentView(type === 'resume' ? AppView.RESUME_BUILDER : AppView.COVER_LETTER);
  };

  const handleSculptFromJob = (jd: string, type: 'resume' | 'cover-letter') => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'Targeted Document',
      lastUpdated: Date.now(),
      type: type,
      jobDescription: jd,
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: `I've imported the job details. ${type === 'resume' ? "Let's align your resume to these requirements. Should we start with your current resume or build something fresh?" : "Let's draft a cover letter for this role. What specific experience makes you the best candidate?"}`,
          timestamp: Date.now(),
        }
      ],
      resumeText: '',
      finalResume: null
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setCurrentView(type === 'resume' ? AppView.RESUME_BUILDER : AppView.COVER_LETTER);
  };

  const renderView = () => {
    const commonProps = { 
      onToggleMobile: toggleMobileSidebar, 
      theme,
      sessions,
      activeSessionId,
      updateSession,
      setSessions
    };
    
    switch (currentView) {
      case AppView.RESUME_BUILDER:
        return <AIResumeBuilder {...commonProps} />;
      case AppView.COVER_LETTER:
        return <CoverLetterBuilder {...commonProps} />;
      case AppView.DOCUMENTS:
        return (
          <Documents 
            onToggleMobile={toggleMobileSidebar}
            theme={theme}
            sessions={sessions}
            onSelectSession={(id) => {
              const session = sessions.find(s => s.id === id);
              setActiveSessionId(id);
              setCurrentView(session?.type === 'cover-letter' ? AppView.COVER_LETTER : AppView.RESUME_BUILDER);
            }}
          />
        );
      case AppView.FIND_JOB:
        return (
          <JobSearch 
            onToggleMobile={toggleMobileSidebar} 
            theme={theme} 
            onSculptResume={(jd) => handleSculptFromJob(jd, 'resume')}
            onSculptLetter={(jd) => handleSculptFromJob(jd, 'cover-letter')}
          />
        );
      case AppView.SETTINGS:
        return <Settings onToggleMobile={toggleMobileSidebar} theme={theme} />;
      default:
        return <AIResumeBuilder {...commonProps} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        sessions={sessions}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        onNewSession={createNewSession}
      />
      <main className="flex-1 overflow-hidden relative w-full">
        <div className="h-full w-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
