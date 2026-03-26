import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, CheckCircle, Music, Volume2, SkipForward, LayoutList, Timer } from 'lucide-react';
import YouTube from 'react-youtube';

const App = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('focus-tasks')) || []);
  const [newTask, setNewTask] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null);

  const playlist = [
    { id: 'jfKfPfyJRdk', name: 'Lofi Girl - Study Radio', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500&auto=format&fit=crop' },
    { id: '4xDzrJKXOOY', name: 'Synthwave Nights', cover: 'https://images.unsplash.com/photo-1614850523296-e8c041de239b?q=80&w=500&auto=format&fit=crop' }
  ];

  useEffect(() => { localStorage.setItem('focus-tasks', JSON.stringify(tasks)); }, [tasks]);

  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) interval = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const progress = (seconds / (25 * 60)) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-red-500/30 overflow-x-hidden">
      {/* Dynamic Background Blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />

      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter italic">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
          FOCUS.OS
        </div>
        <div className="text-xs uppercase tracking-[0.2em] opacity-40 font-medium">Est. 2026 / Productivity Suite</div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
        
        {/* PLAYER MODULE (YouTube Music Style) */}
        <section className="lg:col-span-4 group relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 backdrop-blur-2xl hover:bg-white/[0.05] transition-all duration-500">
          <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl shadow-2xl">
            <img src={playlist[currentTrack].cover} alt="Cover" className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Music className="text-white/20" size={80} />
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold tracking-tight mb-1">{playlist[currentTrack].name}</h3>
            <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase">Curated Stream</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentTrack((currentTrack + 1) % playlist.length)} className="p-3 rounded-full hover:bg-white/10 transition text-zinc-400">
                <SkipForward size={24} />
              </button>
              <button onClick={() => isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
              </button>
              <div className="flex items-center gap-2 group/vol">
                <Volume2 size={20} className="text-zinc-500 group-hover/vol:text-white transition" />
                <input type="range" className="w-20 accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" onChange={(e) => { setVolume(e.target.value); playerRef.current.setVolume(e.target.value); }} />
              </div>
            </div>
          </div>

          <div className="hidden">
            <YouTube videoId={playlist[currentTrack].id} opts={{ height: '0', width: '0' }} onReady={(e) => { playerRef.current = e.target; e.target.setVolume(volume); }} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
          </div>
        </section>

        {/* TIMER MODULE (Sleek Circular Progress) */}
        <section className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Timer size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Work Interval</span>
          </div>

          <div className="relative flex items-center justify-center w-full">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/[0.05]" />
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="3" fill="transparent"
                strokeDasharray={754} strokeDashoffset={754 - (754 * (seconds / (25 * 60)))}
                className="text-red-600 transition-all duration-1000 ease-linear shadow-glow" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-mono font-light tracking-tighter">{formatTime(seconds)}</span>
              <button onClick={() => {setIsActive(false); setSeconds(25*60)}} className="mt-4 text-[10px] text-zinc-500 hover:text-white transition flex items-center gap-1 uppercase tracking-widest">
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          <button onClick={() => setIsActive(!isActive)} className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase text-xs transition-all ${isActive ? 'bg-zinc-800 text-white' : 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]'}`}>
            {isActive ? 'Pause Session' : 'Start Focus'}
          </button>
        </section>

        {/* TASKS MODULE (Clean List) */}
        <section className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 min-h-[500px] flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Focus Tasks</h2>
              <p className="text-xs text-zinc-500 mt-1">Remaining: {tasks.filter(t => !t.completed).length}</p>
            </div>
            <LayoutList className="text-zinc-700" size={32} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if(!newTask) return; setTasks([{id:Date.now(), text:newTask, completed:false}, ...tasks]); setNewTask(''); }} className="mb-6">
            <div className="relative flex items-center">
              <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Next milestone..." className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-5 pr-12 focus:outline-none focus:border-red-600/50 transition-all" />
              <button className="absolute right-3 p-2 bg-white text-black rounded-xl hover:scale-105 transition"><Plus size={20} /></button>
            </div>
          </form>

          <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {tasks.map(t => (
              <div key={t.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-4">
                  <button onClick={() => setTasks(tasks.map(tk => tk.id === t.id ? {...tk, completed: !tk.completed} : tk))} className={`${t.completed ? 'text-red-500' : 'text-zinc-600 hover:text-zinc-400'} transition`}>
                    <CheckCircle size={22} fill={t.completed ? "currentColor" : "none"} />
                  </button>
                  <span className={`text-sm font-medium ${t.completed ? 'line-through opacity-30' : 'text-zinc-200'}`}>{t.text}</span>
                </div>
                <button onClick={() => setTasks(tasks.filter(tk => tk.id !== t.id))} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 right-8 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest text-zinc-500 flex gap-4">
        <span>[SPACE] PLAY</span>
        <span>[S] TIMER</span>
        <span>[N] TASK</span>
      </div>
    </div>
  );
};

export default App;
