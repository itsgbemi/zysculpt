
import React from 'react';
import { User, Bell, Shield, CreditCard, ExternalLink, Menu } from 'lucide-react';

interface SettingsProps {
  onToggleMobile?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onToggleMobile }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Responsive Header */}
      <header className="p-4 md:p-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#191919] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMobile} className="md:hidden text-[#a0a0a0]">
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">Settings</h2>
            <p className="text-[10px] md:text-xs text-[#a0a0a0]">Manage your account preferences</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 hidden md:block">Account Settings</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-[10px] md:text-xs font-bold text-[#555] uppercase tracking-widest mb-4">Profile</h2>
            <div className="p-4 md:p-6 bg-[#121212] border border-[#2a2a2a] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 flex-shrink-0">
                  <User size={24} md:size={32} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold">John Doe</h3>
                  <p className="text-[#a0a0a0] text-sm">john.doe@example.com</p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 border border-[#2a2a2a] rounded-lg hover:bg-[#1f1f1f] transition-colors text-sm">Edit Profile</button>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] md:text-xs font-bold text-[#555] uppercase tracking-widest mb-4">Preferences</h2>
            <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden">
              <button className="w-full p-4 flex items-center justify-between hover:bg-[#1f1f1f] transition-colors">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-[#a0a0a0]" />
                  <span className="font-medium text-sm md:text-base">Notifications</span>
                </div>
                <div className="w-10 h-5 bg-white rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full"></div>
                </div>
              </button>
              <button className="w-full p-4 border-t border-[#2a2a2a] flex items-center justify-between hover:bg-[#1f1f1f] transition-colors">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[#a0a0a0]" />
                  <span className="font-medium text-sm md:text-base">Privacy & Security</span>
                </div>
                <ExternalLink size={16} className="text-[#555]" />
              </button>
              <button className="w-full p-4 border-t border-[#2a2a2a] flex items-center justify-between hover:bg-[#1f1f1f] transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-[#a0a0a0]" />
                  <span className="font-medium text-sm md:text-base">Billing & Subscription</span>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-[#a0a0a0]">Pro Plan</span>
              </button>
            </div>
          </section>

          <div className="p-6 md:p-8 border border-white/10 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-dashed">
            <h3 className="text-base md:text-lg font-bold mb-2">Need help?</h3>
            <p className="text-[#a0a0a0] text-xs md:text-sm mb-6">Our support team is available 24/7 to help you with your resume building journey.</p>
            <button className="w-full sm:w-auto px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-[#e0e0e0] transition-colors text-sm">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
