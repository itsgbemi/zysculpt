import React, { useState, useMemo } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  date: string;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Update Resume Summary', status: 'todo', date: new Date().toISOString() },
  { id: '2', title: 'Tailor Cover Letter for Google', status: 'doing', date: new Date().toISOString() },
  { id: '3', title: 'Apply to 5 jobs on LinkedIn', status: 'done', date: new Date().toISOString() }
];

export const Checklist: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all');
  const [sort, setSort] = useState<'recent' | 'alphabetical'>('recent');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || task.status === filter;
      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) => {
      if (sort === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [tasks, searchTerm, filter, sort]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle, status: 'todo', date: new Date().toISOString() }]);
    setNewTaskTitle('');
  };

  const updateStatus = (id: string, status: 'todo' | 'doing' | 'done') => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  }

  const renderTaskColumn = (status: 'todo' | 'doing' | 'done', title: string) => {
    const columnTasks = filteredTasks.filter(t => t.status === status);
    return (
      <div className="bg-[#0d1117] border border-blue-900/30 rounded-md p-6 flex flex-col h-full shadow-lg">
        <h3 className="text-xl font-black text-white mb-4 border-b border-white/10 pb-2">{title} <span className="text-gray-500 text-sm font-normal">({columnTasks.length})</span></h3>
        <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
          {columnTasks.length === 0 ? (
            <div className="text-gray-500 text-sm py-4 text-center italic">No tasks.</div>
          ) : (
            columnTasks.map(task => (
              <div key={task.id} className="bg-[#161b22] border border-blue-900/20 rounded-md p-4 group">
                <p className="text-white font-medium mb-3">{task.title}</p>
                <div className="flex justify-between items-center mt-3">
                  <select 
                    value={task.status} 
                    onChange={(e) => updateStatus(task.id, e.target.value as any)}
                    className="bg-[#05070a] border border-blue-900/40 rounded px-2 py-1 flex-1 text-xs text-gray-300 mr-3"
                  >
                    <option value="todo">To Do</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
                  <button onClick={() => deleteTask(task.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 animate-in fade-in duration-500 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Checklist</h1>
        <p className="text-gray-400">Keep track of your job search tasks and preparation.</p>
      </div>

      <div className="bg-[#0d1117] border border-blue-900/30 rounded-md p-6 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full border border-blue-900/40 rounded-md bg-[#05070a] focus-within:border-blue-500 overflow-hidden text-sm flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..." 
                className="w-full bg-transparent pl-10 pr-4 py-3 text-white focus:outline-none"
                />
            </div>
            <div className="flex gap-4 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-2 lg:pb-0 shrink-0">
                <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-[#05070a] border border-blue-900/40 rounded-md px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500"
                >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
                </select>
                
                <select 
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-[#05070a] border border-blue-900/40 rounded-md px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500"
                >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">A-Z</option>
                </select>
            </div>
        </div>
      </div>

      <form onSubmit={addTask} className="mb-10 flex gap-4">
        <input 
          type="text" 
          required 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-[#05070a] border border-blue-900/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-blue-500 shadow-xl" 
          placeholder="New task title..." 
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-lg shadow-blue-900/20 whitespace-nowrap">
          Add Task
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderTaskColumn('todo', 'To Do')}
        {renderTaskColumn('doing', 'Doing')}
        {renderTaskColumn('done', 'Done')}
      </div>
    </div>
  );
};
