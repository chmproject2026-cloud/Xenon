import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Film, Star, LayoutGrid, Clock, CheckCircle,
  Play, ShieldAlert, LogOut, ChevronDown,
  BarChart3, Database, TrendingUp, Info,
  ArrowUp, Activity, SearchX, X, Wifi
} from 'lucide-react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import AddMovie from '../components/AddMovie';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const [inspectedMovie, setInspectedMovie] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const drawerRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/'); return; }
      const res = await axios.get('https://backend-ili2.onrender.com', {
        headers: { Authorization: token }
      });
      setMovies(res.data);
    } catch (err) {
      if (!navigator.onLine) {
        toast.error("Network Error: Offline");
        return;
      }
      toast.error("Session expired or Server Error.");
      // check if it's 401 before cleanup
      if (err.response && err.response.status === 401) {
        navigate('/');
      }
    }
  };

  useEffect(() => {
    fetchMovies();

    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setInspectedMovie(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    navigate('/');
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/movies/${movieToDelete._id}`, {
        headers: { Authorization: token }
      });
      toast.success("Entry Purged Successfully");
      setMovieToDelete(null);
      setInspectedMovie(null);
      fetchMovies();
    } catch (err) {
      toast.error("System error during deletion");
    }
  };

  const toggleFavorite = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/movies/${id}`,
        { isFavorite: !currentStatus },
        { headers: { Authorization: token } }
      );
      fetchMovies();
    } catch (err) {
      toast.error("Error updating favorite status");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredMovies = movies.filter(m => {
    const matchesSearch = (m.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === 'All' ||
      (Array.isArray(m.genre) ? m.genre.includes(filterGenre) : m.genre === filterGenre);
    const matchesFavorite = showFavoritesOnly ? m.isFavorite === true : true;
    const matchesStatus = filterStatus === 'All' || m.watchStatus === filterStatus;
    return matchesSearch && matchesGenre && matchesFavorite && matchesStatus;
  });

  const uniqueGenres = ['All', ...new Set(movies.flatMap(m => Array.isArray(m.genre) ? m.genre : []))];
  const totalTitles = movies.length;
  const completedCount = movies.filter(m => m.watchStatus === 'Completed').length;
  const planCount = movies.filter(m => m.watchStatus === 'Plan to Watch').length;
  const completionPercentage = totalTitles > 0 ? Math.round((completedCount / totalTitles) * 100) : 0;

  return (
    <div
      className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-40 selection:bg-primary selection:text-white relative"
      onMouseMove={handleMouseMove}
    >
      {/* SPOTLIGHT EFFECT */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.12), transparent 80%)`
        }}
      />

      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleLogout={handleLogout} />

      <main className="relative z-10 w-full px-8 md:px-16 py-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 gap-8 border-b border-white/5 pb-12">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="bg-primary/20 p-3 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Film className="text-primary w-8 h-8" />
              </div>
              <div>
                <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-white italic uppercase leading-none">
                  Movie <span className="text-primary drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">Archive</span>
                </h2>
                <div className="flex items-center gap-2 mt-2 justify-center lg:justify-start">
                  <div className="h-0.5 w-12 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-1/2"></div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Archive Active</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
              {['All', 'Plan to Watch', 'Watching', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filterStatus === status ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="relative z-50 flex flex-wrap justify-center items-center gap-6 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl">
            <button
              className={`flex items-center gap-2 px-8 h-14 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 ${showFavoritesOnly ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(251,191,36,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star size={14} fill={showFavoritesOnly ? "currentColor" : "none"} />
              {showFavoritesOnly ? 'TOP PICKS' : 'FAVORITES'}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsGenreOpen(!isGenreOpen)}
                className="flex items-center justify-between w-64 h-14 bg-black/40 border border-white/10 px-8 rounded-xl text-white font-black text-[10px] uppercase transition-all hover:bg-black/60"
              >
                <span className={filterGenre === 'All' ? 'opacity-40' : 'text-primary'}>{filterGenre}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${isGenreOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {isGenreOpen && (
                <div className="absolute top-16 left-0 w-full max-h-64 overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl p-2 z-[70] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                  {uniqueGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => { setFilterGenre(genre); setIsGenreOpen(false); }}
                      className={`w-full text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${filterGenre === genre ? 'bg-primary text-white' : 'text-white/40 hover:bg-white/10'}`}
                    >
                      {genre || "UNKNOWN"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:block w-px h-10 bg-white/10"></div>
            <AddMovie fetchMovies={fetchMovies} />
          </div>
        </div>

        {/* GRID */}
        <div className="relative z-10 min-h-[400px]">
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-24">
              {filteredMovies.map(movie => (
                <div key={movie._id} onClick={(e) => { e.stopPropagation(); setInspectedMovie(movie); }} className="relative group transition-all duration-500 cursor-pointer">
                  <MovieCard movie={movie} onDelete={() => setMovieToDelete(movie)} onToggleFavorite={toggleFavorite} fetchMovies={fetchMovies} />
                  <div className="absolute -bottom-12 left-0 right-0 flex justify-between items-center px-6 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex flex-col text-left text-[8px] font-black text-white/20 uppercase">
                      <span>Entry created</span>
                      <span className="text-[10px] font-bold text-primary/80 italic flex items-center gap-1.5"><Info size={10} /> {formatDate(movie.createdAt)}</span>
                    </div>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="flex flex-col text-right text-[8px] font-black text-white/20 uppercase">
                      <span>Last synced</span>
                      <span className="text-[10px] font-bold text-primary/80 italic flex items-center gap-1.5 justify-end">{formatDate(movie.updatedAt)} <Database size={10} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-700">
              <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-primary blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white/[0.03] border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl">
                  <SearchX size={60} className="text-white/10 animate-pulse" strokeWidth={1} />
                </div>
              </div>
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Zero <span className="text-primary">Matches</span> Found</h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] text-center max-w-md">No archived data matches current system filters.</p>
              <button onClick={() => { setSearchTerm(''); setFilterGenre('All'); setFilterStatus('All'); setShowFavoritesOnly(false); }} className="mt-12 px-10 py-4 bg-white/5 border border-white/5 text-white/40 hover:text-primary rounded-2xl font-black text-[10px] uppercase transition-all shadow-xl">Reset Archive Filters</button>
            </div>
          )}
        </div>

        {/* INFO DRAWER */}
        <div ref={drawerRef} className={`fixed top-0 right-0 h-full w-full md:w-[480px] z-[200] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${inspectedMovie ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"></div>
          {inspectedMovie && (
            <div className="relative h-full flex flex-col p-12 overflow-y-auto scrollbar-hide">
              <button onClick={() => setInspectedMovie(null)} className="absolute top-10 right-10 p-3 rounded-full bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-500 transition-all z-20"><X size={20} /></button>
              <div className="relative h-72 w-full rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl border border-white/5">
                <img src={inspectedMovie.posterUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
              </div>
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-primary/20">{inspectedMovie.type}</span>
                  <span className="text-white/20 font-black text-[10px] tracking-widest">// ARCHIVE_ID: {inspectedMovie._id.slice(-8)}</span>
                </div>
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{inspectedMovie.title}</h2>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Watch status</span>
                    <span className={`text-[11px] font-black uppercase tracking-wider ${inspectedMovie.watchStatus === 'Completed' ? 'text-emerald-500' : 'text-amber-400'}`}>{inspectedMovie.watchStatus}</span>
                  </div>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Archive score</span>
                    <span className="text-2xl font-black text-amber-400 italic">{inspectedMovie.rating}<span className="text-xs text-white/20 non-italic ml-1">/10</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BACK TO TOP */}
        <button onClick={scrollToTop} className={`fixed bottom-10 right-10 z-[150] p-4 rounded-2xl bg-primary text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20 transition-all duration-500 transform hover:scale-110 active:scale-95 group ${showTopButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
          <ArrowUp size={24} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
          <div className="absolute inset-0 rounded-2xl bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </button>

        {/* FOOTER HEATMAP */}
        <footer className="mt-40 pt-16 border-t border-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] flex flex-col hover:bg-slate-900/50 transition-all group overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Archive Intelligence</span>
                <TrendingUp size={14} className="text-primary" />
              </div>
              <div className="space-y-5">
                {['Action', 'Drama', 'Sci-Fi'].map((g) => {
                  const count = movies.filter(m => Array.isArray(m.genre) ? m.genre.includes(g) : m.genre === g).length;
                  const percent = totalTitles > 0 ? (count / totalTitles) * 100 : 0;
                  return (
                    <div key={g} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/40"><span>{g}</span><span>{count} Units</span></div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] flex flex-col items-center text-center hover:bg-slate-900/50 transition-all group overflow-hidden relative">
              <TrendingUp className="absolute -right-4 -top-4 w-24 h-24 text-white/[0.02] rotate-12" />
              <div className="bg-primary/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500"><BarChart3 className="text-primary" /></div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Total Library</span>
              <span className="text-4xl font-black text-white italic mt-2 tracking-tighter">{totalTitles} <span className="text-xs text-white/20">items</span></span>
            </div>
            <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] flex flex-col items-center text-center hover:bg-slate-900/50 transition-all group overflow-hidden relative">
              <div className="relative flex items-center justify-center mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={263.8} strokeDashoffset={263.8 - (263.8 * completionPercentage) / 100} strokeLinecap="round" className="text-primary transition-all duration-[2000ms] ease-out" />
                </svg>
                <span className="absolute text-sm font-black text-white tracking-tighter">{completionPercentage}%</span>
              </div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Efficiency</span>
              <span className="text-3xl font-black text-white italic mt-2 tracking-tighter">{completedCount} Completed</span>
            </div>
            <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] flex flex-col items-center text-center hover:bg-slate-900/50 transition-all group">
              <div className="bg-amber-400/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500"><Clock className="text-amber-400" /></div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Archiving</span>
              <span className="text-4xl font-black text-white italic mt-2 tracking-tighter">{planCount} <span className="text-xs text-white/20">waiting</span></span>
            </div>
          </div>
        </footer>

        {movieToDelete && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-500"></div>
            <div className="relative bg-[#0f172a] border border-red-500/20 w-full max-w-lg rounded-[3.5rem] p-16 text-center shadow-[0_0_100px_rgba(239,68,68,0.1)] animate-in zoom-in-95 duration-300">
              <div className="bg-red-500/10 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-red-500/20"><ShieldAlert className="text-red-500 w-12 h-12 animate-pulse" /></div>
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Deletation <span className="text-red-500">Alert</span></h3>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.3em] mt-6 mb-12 leading-relaxed">You are about to purge <br /> <span className="text-white font-black italic">"{movieToDelete.title}"</span> <br /> from cloud storage.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={confirmDelete} className="flex-1 h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-[1.02]">Confirm Purge</button>
                <button onClick={() => setMovieToDelete(null)} className="flex-1 h-16 bg-white/5 hover:bg-white/10 text-white/50 rounded-2xl font-black uppercase text-xs transition-all">Abort Action</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
