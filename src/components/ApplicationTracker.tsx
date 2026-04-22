import React, { useState } from 'react';
import { SavedApplication, Job } from '../types';

export const ApplicationTracker: React.FC<{
  applications: SavedApplication[];
  onUpdateStatus: (id: string, status: SavedApplication['status']) => void;
  onAddExternal: (app: SavedApplication) => void;
}> = ({ applications, onUpdateStatus, onAddExternal }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState<Partial<SavedApplication>>({ status: 'Saved', source: 'External' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.title || !newApp.company) return;
    onAddExternal({
      ...newApp,
      id: `ext-${Date.now()}`,
      title: newApp.title,
      company: newApp.company,
      location: newApp.location || '',
      type: newApp.type || 'Full-time',
      postedAt: 'Just now',
      source: newApp.source || 'External',
      description: newApp.description || '',
      tags: [],
      status: newApp.status || 'Saved',
      dateAdded: new Date().toISOString()
    } as SavedApplication);
    setShowAddModal(false);
    setNewApp({ status: 'Saved', source: 'External' });
  };

  const statusColors = {
    'Saved': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'Applied': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Interviewing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Offer': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Application Tracker</h1>
          <p className="text-gray-400">Manage your bookmarked jobs and track progress.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Add External Application
        </button>
      </div>

      <div className="bg-[#0d1117] border border-blue-900/30 rounded-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161b22] border-b border-blue-900/30 text-gray-400 text-xs tracking-wider">
                <th className="px-6 py-4 font-bold">Role & Company</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Source</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No applications tracked yet. Bookmark jobs from the Job Board or add manually.
                  </td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">{app.title}</div>
                      <div className="text-sm text-gray-500">{app.company}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{app.location || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      <span className="bg-white/5 px-2 py-1 rounded-md text-xs">{app.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold border tracking-wider ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as SavedApplication['status'])}
                        className="bg-[#05070a] border border-blue-900/30 rounded-md px-3 py-1.5 text-sm text-gray-300 hover:text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offer">Offer</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-blue-900/30 rounded-md p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Add External Application</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">Job Title</label>
                <input required type="text" value={newApp.title || ''} onChange={e => setNewApp({...newApp, title: e.target.value})} className="w-full bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">Company</label>
                <input required type="text" value={newApp.company || ''} onChange={e => setNewApp({...newApp, company: e.target.value})} className="w-full bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">Location</label>
                <input type="text" value={newApp.location || ''} onChange={e => setNewApp({...newApp, location: e.target.value})} className="w-full bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="Remote / NY" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-1.5">Status</label>
                <select value={newApp.status || 'Saved'} onChange={e => setNewApp({...newApp, status: e.target.value as any})} className="w-full bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500">
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer">Offer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors">Add</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-md transition-colors border border-blue-900/30">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
