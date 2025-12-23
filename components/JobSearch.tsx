
import React from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowUpRight, Menu } from 'lucide-react';

interface JobSearchProps {
  onToggleMobile?: () => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ onToggleMobile }) => {
  const jobs = [
    { id: 1, title: 'Senior Frontend Engineer', company: 'TechFlow', location: 'Remote', salary: '$140k - $180k', match: '98%' },
    { id: 2, title: 'Product Designer', company: 'Nexus AI', location: 'San Francisco, CA', salary: '$120k - $160k', match: '92%' },
    { id: 3, title: 'Full Stack Developer', company: 'CloudScale', location: 'New York, NY', salary: '$130k - $170k', match: '85%' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Responsive Header */}
      <header className="p-4 md:p-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#191919] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMobile} className="md:hidden text-[#a0a0a0]">
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">Find Jobs</h2>
            <p className="text-[10px] md:text-xs text-[#a0a0a0]">Tailored to your profile</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full">
        <div className="mb-10 hidden md:block">
          <h1 className="text-3xl font-bold mb-2">Find your next role</h1>
          <p className="text-[#a0a0a0]">Powered by your freshly sculpted resume.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={20} />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company"
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-colors text-sm md:text-base"
            />
          </div>
          <div className="w-full lg:w-64 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={20} />
            <input 
              type="text" 
              placeholder="Location"
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-colors text-sm md:text-base"
            />
          </div>
          <button className="w-full lg:w-auto px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2">
            <Search size={20} />
            Search
          </button>
        </div>

        <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg text-xs md:text-sm border border-[#333] whitespace-nowrap">
            <Filter size={16} /> Filters
          </button>
          <button className="px-4 py-2 bg-[#2a2a2a] rounded-lg text-xs md:text-sm border border-[#333] whitespace-nowrap">Salary</button>
          <button className="px-4 py-2 bg-[#2a2a2a] rounded-lg text-xs md:text-sm border border-[#333] whitespace-nowrap">Job Type</button>
        </div>

        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="p-4 md:p-6 bg-[#121212] border border-[#2a2a2a] rounded-2xl hover:border-white transition-all cursor-pointer group">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {job.company[0]}
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <p className="text-[#a0a0a0] flex items-center gap-2 mt-1 text-xs md:text-sm">
                      <Briefcase size={14} /> {job.company} • <MapPin size={14} /> {job.location}
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                  <div className="text-xs md:text-sm font-medium text-green-400">{job.match} Match</div>
                  <div className="text-xs md:text-sm text-[#a0a0a0] mt-1">{job.salary}</div>
                </div>
              </div>
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 md:pt-6 border-t border-[#1f1f1f] gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 md:px-3 py-1 bg-[#1f1f1f] rounded-full text-[8px] md:text-[10px] text-[#888] uppercase tracking-wider">Full-time</span>
                  <span className="px-2 md:px-3 py-1 bg-[#1f1f1f] rounded-full text-[8px] md:text-[10px] text-[#888] uppercase tracking-wider">React</span>
                  <span className="px-2 md:px-3 py-1 bg-[#1f1f1f] rounded-full text-[8px] md:text-[10px] text-[#888] uppercase tracking-wider">Node.js</span>
                </div>
                <button className="flex items-center gap-1 text-xs md:text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                  Apply with Zysculpt <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
