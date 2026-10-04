import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Droplets, BrainCircuit, FileText, Cpu, ShieldAlert, X } from 'lucide-react';

const CommandMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: <Home className="w-4 h-4 text-zinc-400" /> },
    { name: 'Water Quality Telemetry', path: '/quality', icon: <Droplets className="w-4 h-4 text-blue-400" /> },
    { name: 'Aqua Intelligence (AI)', path: '/intelligence', icon: <BrainCircuit className="w-4 h-4 text-indigo-400" /> },
    { name: 'Hardware & Sensors', path: '/sensors', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
    { name: 'Compliance Reports', path: '/reports', icon: <FileText className="w-4 h-4 text-zinc-400" /> },
    { name: 'Active Alerts', path: '/reporting', icon: <ShieldAlert className="w-4 h-4 text-red-400" /> },
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-2xl border border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden animate-spring-up">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-200/50">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search commands, sensors, or AI insights..." 
            className="flex-1 bg-transparent border-none outline-none text-zinc-800 placeholder-zinc-400 text-lg font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-700 bg-zinc-100 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 font-medium">No results found for "{query}"</div>
          ) : (
            filteredCommands.map((cmd, i) => (
              <button 
                key={i}
                className="w-full flex items-center px-4 py-3 hover:bg-zinc-100/80 rounded-xl transition-colors text-left group"
                onClick={() => handleSelect(cmd.path)}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center mr-4 group-hover:border-zinc-300 shadow-sm">
                  {cmd.icon}
                </div>
                <span className="font-semibold text-zinc-700 group-hover:text-zinc-900">{cmd.name}</span>
                <span className="ml-auto text-xs text-zinc-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Jump to <Search className="w-3 h-3" />
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50/80 px-4 py-3 border-t border-zinc-200/50 flex justify-between items-center text-[11px] font-semibold text-zinc-500">
          <span className="flex items-center gap-1.5"><BrainCircuit className="w-3 h-3 text-indigo-500" /> Aqua Intelligence Search Engine</span>
          <span>Press <kbd className="font-mono bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-700">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;
