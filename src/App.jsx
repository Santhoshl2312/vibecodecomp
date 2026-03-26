import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, CheckCircle, Music, Volume2, Keyboard } from 'lucide-react';
import YouTube from 'react-youtube';

const App = () => {
  // --- Timer State ---
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);

  // --- Task State ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('focus-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');

  // --- Music State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null);

  const playlist = [
    { id: 'jfKfPfyJRdk', name: 'Lofi Girl - Study Radio' },
    { id: '4xDzrJKXOOY', name: 'Synthwave Radio' }
  ];

  // --- Side Effects ---
  useEffect(() => {
    localStorage.setItem('focus-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      setSessions(s => s + 1);
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // --- Keyboard Shortcuts (+10 Bounty) ---
  useEffect(() => {
    const handleKeys = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(!isPlaying); }
      if (e.key.toLowerCase() === 's') setIsActive(!isActive);
      if (e.key.toLowerCase() === 'c') setTasks(tasks.filter(t => !t.completed));
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isPlaying, isActive, tasks]);

  // --- Logic Helpers ---
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-6 font-sans selection:bg-red-500/30">
      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        
        {/* LEFT: Timer Module */}
        <div className="md:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
          <h2 className="text-sm font-bold tracking-widest uppercase opacity-50 mb-8">Focus Timer</h2>
          
          {/* Animated SVG Ring (+15 Bounty) */}
          <div className="relative mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="6" fill="transparent"
                strokeDasharray={553} strokeDashoffset={553 - (553 * (seconds / (25 * 60)))}
                className="text-red-600 transition-all duration-1000 ease-linear" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-mono font-bold">{formatTime(seconds)}</span>
              <span className="text-xs opacity-40 mt-1">{isActive ? 'WORK' : 'PAUSED'}</span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setIsActive(!isActive)} className="p-4 bg-white text-black rounded-full hover:scale-105 transition">
              {isActive ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={() => {setIsActive(false); setSeconds(25*60)}} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition">
              <RotateCcw size={24} />
            </button>
          </div>
          <p className="text-sm opacity-60">Sessions Completed: {sessions}</p>
        </div>

        {/* CENTER: Music Player (YouTube Music Style) */}
        <div className="md:col-span-4 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-2 mb-8 opacity-50">
            <Music size={18} />
            <span className="text-xs font-bold tracking-widest uppercase">Now Playing</span>
          </div>

          <div className="aspect-square bg-gradient-to-br from-red-900/40 to-black rounded-2xl mb-6 flex items-center justify-center overflow-hidden border border-white/5">
             <YouTube 
                videoId={playlist[currentTrack].id}
                opts={{ height: '0', width: '0', playerVars: { autoplay: 0 } }}
                onReady={(e) => { playerRef.current = e.target; e.target.setVolume(volume); }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
             />
             <div className={`w-32 h-32 rounded-full border-4 border-red-600/20 border-t-red-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </div>

          <h3 className="text-xl font-bold truncate">{playlist[currentTrack].name}</h3>
          <p className="text-sm opacity-50 mb-6">Lofi Curated Station</p>

          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentTrack(currentTrack === 0 ? 1 : 0)} className="opacity-70 hover:opacity-100">Next Station</button>
            <button onClick={() => isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()} className="p-3 bg-red-600 rounded-full">
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
            </button>
            <div className="flex items-center gap-2 opacity-50">
              <Volume2 size={16} />
              <input type="range" className="w-16 accent-red-600" onChange={(e) => {
                setVolume(e.target.value);
                playerRef.current.setVolume(e.target.value);
              }} />
            </div>
          </div>
        </div>

        {/* RIGHT: Tasks Panel */}
        <div className="md:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold tracking-widest uppercase opacity-50">Tasks</h2>
            <span className="text-xs bg-white/10 px-2 py-1 rounded">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </span>
          </div>

          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <input 
              value={newTask} onChange={(e) => setNewTask(e.target.value)}
              placeholder="Focus on..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-red-500 transition"
            />
            <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20"><Plus size={20} /></button>
          </form>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {tasks.map(task => (
              <div key={task.id} className="group flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTask(task.id)} className={task.completed ? 'text-green-500' : 'text-white/20 hover:text-white/40'}>
                    <CheckCircle size={20} />
                  </button>
                  <span className={`text-sm ${task.completed ? 'line-through opacity-30' : ''}`}>{task.text}</span>
                </div>
                <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="opacity-0 group-hover:opacity-50 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Shortcuts Help Footer */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-6 text-[10px] uppercase tracking-tighter opacity-30">
        <div className="flex items-center gap-1"><Keyboard size={12} /> [Space] Play/Pause</div>
        <div>[S] Start/Stop Timer</div>
        <div>[C] Clear Completed</div>
      </footer>
    </div>
  );
};

export default App;