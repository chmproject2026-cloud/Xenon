import React, { useState, useEffect, useRef } from 'react';
import { Search, LogOut, ShieldCheck, Clapperboard, History, Timer } from 'lucide-react'; // Added Timer icon
import AnimatedSignalIcon from './AnimatedSignalIcon';

const Navbar = ({ searchTerm, setSearchTerm, handleLogout }) => {
  const [userInitial, setUserInitial] = useState("?");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchHistory, setSearchHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- NEW SESSION TIMER STATE ---
  const [sessionTime, setSessionTime] = useState("00:00");
  const startTimeRef = useRef(Date.now());

  const historyRef = useRef(null);
  const inputRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const hideTimeoutRef = useRef(null);
  const isHoveredRef = useRef(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // --- MOUSE HANDLERS FOR AUTO-HIDE ---
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // Only start timer if we are in floating mode (scrolled down)
    if (window.scrollY > 50) {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        if (window.scrollY > 50 && !isHoveredRef.current) {
          setIsVisible(false);
        }
      }, 2500); // 2.5s inactivity
    }
  };

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    const storedUser = localStorage.getItem('username') || "User";
    setUserInitial(storedUser.charAt(0).toUpperCase());

    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(savedHistory);

    // --- SESSION TIMER LOGIC ---
    const timerInterval = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
      const secs = (secondsElapsed % 60).toString().padStart(2, '0');
      setSessionTime(`${mins}:${secs}`);
    }, 1000);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine visibility direction
      if (currentScrollY < 50) {
        // At top: Always show and clear timer
        setIsVisible(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling DOWN -> Hide immediately
        setIsVisible(false);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      } else {
        // Scrolling UP -> Show
        setIsVisible(true);

        // Start inactivity timer
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          if (window.scrollY > 50 && !isHoveredRef.current) {
            setIsVisible(false);
          }
        }, 2500);
      }

      setIsScrolled(currentScrollY > 20);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) {
        setIsHistoryOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsHistoryOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
      clearInterval(timerInterval); // Cleanup timer
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const saveSearchTerm = (term) => {
    if (!term.trim()) return;
    const updatedHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const clearHistory = (e) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`sticky top-0 z-[100] w-full transition-all duration-500 overflow-visible ${isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled
          ? 'bg-[#020617]/90 backdrop-blur-3xl py-3 border-b border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-6 border-b border-white/5'
        }`}>

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      />

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 md:px-16 flex flex-col md:grid md:grid-cols-3 items-center gap-4 md:gap-0">

        {/* LEFT COLUMN: LOGO */}
        <div className="flex items-center gap-4 group cursor-pointer justify-self-center md:justify-self-start">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-primary to-indigo-600 p-3 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:rotate-[360deg] transition-all duration-700 ease-in-out">
              <Clapperboard className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase leading-none italic">
              Watch<span className="text-primary">List</span>
            </h1>
            <span className="text-[8px] font-black tracking-[0.5em] text-white/20 uppercase">Cloud Archive v2</span>

            {/* CONNECTION STATUS */}
            <div className="flex items-center gap-2 mt-2">
              <div className="relative flex items-center justify-center">
                <div className={`absolute -inset-1 rounded-full blur-sm transition-all duration-500 ${isOnline ? 'bg-emerald-600/40 animate-pulse' : 'bg-red-500/20 animate-pulse'}`}></div>
                <AnimatedSignalIcon size={10} isConnected={isOnline} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-500 ${isOnline ? 'text-emerald-500' : 'text-red-500/80'}`}>
                {isOnline ? "DB CONNECTED" : "OFFLINE"}
              </span>
            </div>

          </div>
        </div>

        {/* CENTER COLUMN: SEARCH & HISTORY */}
        <div className="justify-self-center relative" ref={historyRef}>
          <div className="relative group hidden xl:block">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" strokeWidth={3} />
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH YOUR ARCHIVE..."
              className="input bg-white/[0.03] border border-white/10 w-full sm:w-[300px] md:w-[400px] pl-16 h-14 rounded-2xl font-black text-[10px] tracking-[0.25em] focus:outline-none focus:w-full sm:focus:w-[400px] md:focus:w-[500px] focus:border-primary/50 focus:bg-white/[0.07] focus:ring-[15px] focus:ring-primary/5 transition-all duration-700 placeholder:text-white/10 text-white shadow-2xl relative z-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsHistoryOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && saveSearchTerm(searchTerm)}
            />

            <div className="absolute right-5 inset-y-0 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-0 transition-opacity z-20">
              <span className="border border-white/30 rounded-md px-1.5 py-0.5 text-[8px] font-black text-white uppercase">CTRL + K</span>
            </div>
          </div>

          {/* SEARCH HISTORY DROPDOWN */}
          {isHistoryOpen && searchHistory.length > 0 && (
            <div className="absolute top-16 left-0 w-full bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                  <History size={10} /> Recent Archives
                </span>
                <button
                  onClick={clearHistory}
                  className="text-[8px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest"
                >
                  Wipe Data
                </button>
              </div>
              <div className="space-y-1">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => { setSearchTerm(item); setIsHistoryOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer group/item transition-all"
                  >
                    <Search size={12} className="text-white/10 group-hover/item:text-primary transition-colors" />
                    <span className="text-[11px] font-bold text-white/60 group-hover/item:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTIONS & SESSION BADGE */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 md:gap-6 justify-self-center md:justify-self-end w-full md:w-auto">

          {/* UPDATED PREMIUM USER BADGE WITH TIMER */}
          <div className="flex items-center gap-4 bg-white/[0.02] p-1.5 pr-6 rounded-2xl border border-white/5 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-500 group cursor-default">
            <div className="relative w-12 h-12 rounded-[1rem] bg-slate-800 flex items-center justify-center shadow-2xl overflow-hidden border border-white/10">
              <span className="relative z-10 text-white font-black text-lg italic group-hover:scale-110 transition-transform duration-500">{userInitial}</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ShieldCheck size={10} className="text-primary animate-pulse" />
                  <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] leading-none">Admin</span>
                </div>
                <div className="h-2 w-[1px] bg-white/10" />
                {/* --- SESSION TIMER DISPLAY --- */}
                <div className="flex items-center gap-1">
                  <Timer size={10} className="text-white/30" />
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">Session: {sessionTime}</span>
                </div>
              </div>
              <span className="text-[13px] font-black text-white uppercase tracking-tight opacity-90 mt-1">
                {localStorage.getItem('username') || "Member"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group relative flex items-center gap-3 h-14 px-8 bg-white/[0.03] border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="relative z-10">Sign Out</span>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-500 rounded-bl-md" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;