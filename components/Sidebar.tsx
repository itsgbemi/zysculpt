
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Search, 
  Settings as SettingsIcon, 
  ChevronDown,
  Plus,
  Sun,
  Moon,
  Mail,
  DoorOpen,
  LayoutDashboard,
  Compass,
  MoreHorizontal,
  FolderOpen,
  Zap,
  LogOut,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Menu
} from 'lucide-react';
import { AppView, ChatSession, Theme } from '../types';

const LOGO_URL = "https://res.cloudinary.com/dqhawdcol/image/upload/v1767362945/fotwdvuacn4du6yeldq9.svg";

export const ZysculptLogo = ({ theme, size = 24 }: { theme: Theme, size?: number }) => (
  <div 
    className="flex-shrink-0 transition-transform duration-500 hover:scale-110"
    style={{ width: size, height: size }}
  >
    <img 
      src={LOGO_URL} 
      alt="Zysculpt" 
      className="w-full h-full object-contain"
    />
  </div>
);

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  onNewSession: (type?: 'resume' | 'cover-letter' | 'resignation-letter' | 'career-copilot') => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, setView, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, 
  theme, toggleTheme, sessions, activeSessionId, setActiveSessionId, onNewSession, onDeleteSession, onRenameSession,
  onLogout
}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    resume: true,
    letter: true,
    resignation: false,
    copilot: false
  });
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const toggleSubmenu = (key: string) => {
    if (isCollapsed && !isMobileOpen) {
      setIsCollapsed(false);
      setOpenSubmenus(prev => ({ ...prev, [key]: true }));
    } else {
      setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const startRename = (id: string, currentTitle: string) => {
    setRenamingId(id);
    setRenameValue(currentTitle);
    setActiveMenuId(null);
  };

  const submitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRenameSession(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteSession(deletingId);
      setDeletingId(null);
    }
  };

  const renderNavButton = (id: AppView, label: string, icon: React.ReactNode, typeKey?: string, onPlusClick?: () => void) => {
    const isActive = currentView === id;
    const hasSubmenu = typeKey !== undefined;
    const isOpen = openSubmenus[typeKey || ''];
    
    const filteredSessions = sessions.filter(s => {
      if (typeKey === 'resume') return s.type === 'resume';
      if (typeKey === 'copilot') return s.type === 'career-copilot';
      if (typeKey === 'letter') return s.type === 'cover-letter';
      if (typeKey === 'resignation') return s.type === 'resignation-letter';
      return false;
    });

    return (
      <div className="space-y-1">
        <div 
          className={`flex items-center group rounded-xl transition-all ${
            isActive && !hasSubmenu
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : theme === 'dark' ? 'text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white' : 'text-[#64748b] hover:bg-slate-50 hover:text-[#0F172A]'
          } ${isCollapsed && !isMobileOpen ? 'md:justify-center' : ''}`}
        >
          <button
            onClick={() => {
              if (hasSubmenu) toggleSubmenu(typeKey!);
              setView(id);
              if (isMobileOpen && !hasSubmenu) setIsMobileOpen(false);
            }}
            className="flex-1 flex items-center gap-4 p-3 overflow-hidden"
          >
            <span className="flex-shrink-0">{icon}</span>
            {(!isCollapsed || isMobileOpen) && <span className="font-semibold text-sm truncate">{label}</span>}
            {hasSubmenu && (!isCollapsed || isMobileOpen) && (
              <ChevronDown size={14} className={`ml-auto transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </button>
          
          {hasSubmenu && onPlusClick && (!isCollapsed || isMobileOpen) && (
            <button 
              onClick={(e) => { e.stopPropagation(); onPlusClick(); }}
              className="p-3 hover:text-indigo-500 transition-colors"
            >
              <Plus size={16} />
            </button>
          )}
        </div>

        {hasSubmenu && isOpen && (!isCollapsed || isMobileOpen) && (
          <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 dark:border-white/10 pl-3">
            {filteredSessions.map(s => (
              <div key={s.id} className="group/item flex items-center relative pr-2">
                {renamingId === s.id ? (
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                    className={`flex-1 bg-transparent border-b border-indigo-500 outline-none text-[11px] py-1 text-white`}
                  />
                ) : (
                  <>
                    <button 
                      onClick={() => { setActiveSessionId(s.id); setView(id); if(isMobileOpen) setIsMobileOpen(false); }}
                      className={`flex-1 text-left p-2 rounded-md text-[11px] truncate transition-all ${activeSessionId === s.id && currentView === id ? 'text-white bg-white/5 font-semibold' : 'text-[#a0a0a0] hover:text-white'}`}
                    >
                      {s.title}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === s.id ? null : s.id); }}
                      className={`p-1 text-slate-400 hover:text-indigo-500 transition-all ${activeMenuId === s.id ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 md:relative md:translate-x-0 flex flex-col no-print ${theme === 'dark' ? 'bg-[#121212] border-[#2a2a2a]' : 'bg-white border-[#e2e8f0]'} border-r ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'} ${isCollapsed && !isMobileOpen ? 'md:w-20' : 'md:w-72'}`}>
      <div className={`p-6 flex items-center justify-between ${isCollapsed && !isMobileOpen ? 'md:justify-center' : ''}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.OVERVIEW)}>
          <ZysculptLogo theme={theme} size={32} />
          {(!isCollapsed || isMobileOpen) && <span className="text-2xl font-black tracking-tighter" style={{ fontFamily: "'DM Sans', sans-serif" }}>zysculpt</span>}
        </div>
      </div>
      
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2">
        {renderNavButton(AppView.OVERVIEW, 'Overview', <LayoutDashboard size={20} />)}
        {renderNavButton(AppView.CAREER_COPILOT, 'Roadmap', <Compass size={20} />, 'copilot', () => onNewSession('career-copilot'))}
        {renderNavButton(AppView.RESUME_BUILDER, 'Resume Builder', <FileText size={20} />, 'resume', () => onNewSession('resume'))}
        {renderNavButton(AppView.COVER_LETTER, 'Cover Letter', <Mail size={20} />, 'letter', () => onNewSession('cover-letter'))}
        {renderNavButton(AppView.RESIGNATION_LETTER, 'Resignation', <DoorOpen size={20} />, 'resignation', () => onNewSession('resignation-letter'))}
        <div className="h-px my-3 mx-2 bg-[#2a2a2a]" />
        {renderNavButton(AppView.KNOWLEDGE_HUB, 'Skill Lab', <Zap size={20} />)}
        {renderNavButton(AppView.DOCUMENTS, 'My Documents', <FolderOpen size={20} />)}
        {renderNavButton(AppView.FIND_JOB, 'Job Search', <Search size={20} />)}
        {renderNavButton(AppView.SETTINGS, 'Settings', <SettingsIcon size={20} />)}
      </nav>

      <div className="p-4 space-y-2 border-t border-white/5">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`hidden md:flex w-full items-center gap-4 p-3 rounded-xl transition-all text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white ${isCollapsed ? 'justify-center' : ''}`}>
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          {!isCollapsed && <span className="font-medium text-sm">Minimize</span>}
        </button>
        <button onClick={onLogout} className={`w-full flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all ${isCollapsed && !isMobileOpen ? 'md:justify-center' : ''}`}>
          <LogOut size={20} />
          {(!isCollapsed || isMobileOpen) && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
