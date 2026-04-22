import React, { useState, useMemo } from 'react';
import { Job, SavedApplication } from '../types';

const INITIAL_JOBS: Job[] = [
  { id: 'j1', title: 'Senior Frontend Engineer', company: 'TechNova', location: 'Remote', type: 'Full-time', postedAt: '2 days ago', source: 'LinkedIn', description: 'We are looking for an experienced frontend engineer with deep knowledge of React, Tailwind, and TypeScript.', tags: ['React', 'TypeScript', 'Tailwind'] },
  { id: 'j2', title: 'Product Designer', company: 'DesignCo', location: 'New York, NY', type: 'Contract', postedAt: '5 hours ago', source: 'Dribbble', description: 'Join our creative team to work on core product features. Experience with Figma is required.', tags: ['Figma', 'UI/UX', 'Product'] },
  { id: 'j3', title: 'Backend Developer', company: 'DataFlow', location: 'San Francisco, CA', type: 'Full-time', postedAt: '1 week ago', source: 'Indeed', description: 'Seeking a strong backend developer. Node.js, PostgreSQL, and AWS experience preferred.', tags: ['Node.js', 'AWS', 'SQL'] },
  { id: 'j4', title: 'Full Stack Engineer', company: 'StartupX', location: 'Austin, TX (Hybrid)', type: 'Full-time', postedAt: '3 days ago', source: 'AngelList', description: 'Fast-paced startup looking for a full stack engineer. MERN stack, Next.js, Vercel.', tags: ['Next.js', 'React', 'Node.js'] },
  { id: 'j5', title: 'UX Researcher', company: 'GlobalCorp', location: 'London, UK', type: 'Full-time', postedAt: '1 day ago', source: 'Direct', description: 'Conduct user testing and journey mapping for our global platform.', tags: ['Research', 'Testing', 'UX'] },
  { id: 'j6', title: 'DevOps Engineer', company: 'CloudSys', location: 'Remote', type: 'Contract', postedAt: '4 days ago', source: 'LinkedIn', description: 'Looking for experts in Docker, Kubernetes, and CI/CD pipelines.', tags: ['Docker', 'K8s', 'AWS'] },
  { id: 'j7', title: 'React Developer', company: 'FinanceOrg', location: 'Remote', type: 'Full-time', postedAt: 'Just now', source: 'LinkedIn', description: 'Build next-gen financial tools using React and Redux.', tags: ['React', 'Redux', 'Finance'] },
  { id: 'j8', title: 'UI Engineer', company: 'StreamingPlus', location: 'Los Angeles, CA', type: 'Full-time', postedAt: '2 weeks ago', source: 'Indeed', description: 'Create beautiful, accessible interfaces for our millions of users.', tags: ['CSS', 'Accessibility', 'React'] },
];

export const JobBoard: React.FC<{
  savedApplications: SavedApplication[];
  onBookmark: (job: Job) => void;
}> = ({ savedApplications, onBookmark }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const filteredJobs = useMemo(() => {
    let result = INITIAL_JOBS;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
    }
    if (filterType !== 'All') {
      result = result.filter(j => j.type === filterType);
    }
    if (sortBy === 'recent') {
      // Mock sort (in reality, parse dates)
    } else if (sortBy === 'alphabetical') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [search, filterType, sortBy]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const displayedJobs = filteredJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Job Board</h1>
        <p className="text-gray-400">Discover and save tailored opportunities.</p>
      </div>
      
      <div className="bg-[#0d1117] border border-blue-900/30 p-4 rounded-md shadow-lg mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search jobs or companies..." className="w-full bg-[#05070a] border border-blue-900/30 rounded-md pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className="bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 max-w-[150px]">
          <option value="All">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
        </select>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className="bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 max-w-[150px]">
          <option value="recent">Most Recent</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayedJobs.map(job => {
          const isSaved = savedApplications.some(sa => sa.id === job.id);
          return (
            <div key={job.id} className="bg-[#0d1117] border border-blue-900/20 hover:border-blue-700/50 rounded-md p-5 flex flex-col transition-all group shadow-md hover:shadow-blue-900/20 hover:shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight mb-1">{job.title}</h3>
                  <p className="text-gray-400 text-sm font-medium">{job.company}</p>
                </div>
                <button 
                  onClick={() => !isSaved && onBookmark(job)}
                  disabled={isSaved}
                  className={`p-2 rounded-md transition-colors ${isSaved ? 'text-blue-500 bg-blue-900/20' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                  title={isSaved ? "Saved to Tracker" : "Bookmark Job"}
                >
                  <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-md">{job.location}</span>
                <span className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-md">{job.type}</span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{job.description}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500">{job.postedAt} • {job.source}</span>
                {isSaved && <span className="text-xs font-bold text-blue-500 tracking-wider">Bookmarked</span>}
              </div>
            </div>
          );
        })}
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
      {filteredJobs.length === 0 && (
         <div className="text-center text-gray-500 py-12">No jobs match your search criteria.</div>
      )}
    </div>
  );
};
