import React, { useState, useMemo } from 'react';
import { ChatSession } from '../types';

export const YourChats: React.FC<{
  chats: ChatSession[];
  onSelectChat: (id: string | null) => void;
}> = ({ chats, onSelectChat }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const filteredChats = useMemo(() => {
    let result = chats;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q));
    }
    if (sortBy === 'recent') {
      // Assuming they are already kept in recent order in App state, 
      // or we can sort by date if it exists. Since ChatSession doesn't have a date by default in this template, 
      // we'll rely on index.
    } else if (sortBy === 'alphabetical') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [chats, search, sortBy]);

  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);
  const displayedChats = filteredChats.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Your Chats</h1>
          <p className="text-gray-400">Review past conversations and resumes generated.</p>
        </div>
        <button onClick={() => onSelectChat(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          New Chat
        </button>
      </div>

      <div className="bg-[#0d1117] border border-blue-900/30 p-4 rounded-md shadow-lg mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search conversations..." className="w-full bg-[#05070a] border border-blue-900/30 rounded-md pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className="bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 max-w-[150px]">
          <option value="recent">Most Recent</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayedChats.map(chat => (
          <div key={chat.id} onClick={() => onSelectChat(chat.id)} className="bg-[#0d1117] border border-blue-900/20 hover:border-blue-700/50 rounded-md p-6 flex flex-col transition-all cursor-pointer group shadow-md hover:shadow-blue-900/20 hover:shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-900/20 p-3 rounded-md text-blue-500 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-white text-lg truncate" title={chat.title}>{chat.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{chat.messages.length} messages</p>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
               <span className="text-xs text-blue-400 font-bold tracking-wider group-hover:underline">Open Chat</span>
               <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 bg-[#0d1117] border border-blue-900/30 rounded-md text-gray-400 hover:text-white disabled:opacity-50">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span className="text-gray-400 text-sm font-medium px-4">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 bg-[#0d1117] border border-blue-900/30 rounded-md text-gray-400 hover:text-white disabled:opacity-50">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}
      {filteredChats.length === 0 && (
         <div className="text-center text-gray-500 py-12">No conversations found.</div>
      )}
    </div>
  );
};
