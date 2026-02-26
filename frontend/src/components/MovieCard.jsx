import { useState } from 'react'; // Added useState for tilt logic
import { Trash2, Pencil, Radio, Star, CheckCircle2, PlayCircle, Clock } from 'lucide-react'; 
import EditMovie from './EditMovie';

const MovieCard = ({ movie, onDelete, onToggleFavorite, fetchMovies }) => {
  const fallbackImage = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop";

  // --- TILT LOGIC START ---
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    // Lower divisor = more aggressive tilt. 20-30 is usually the sweet spot.
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };
  // --- TILT LOGIC END ---

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={12} strokeWidth={3} />;
      case 'Watching': return <PlayCircle size={12} strokeWidth={3} />;
      default: return <Clock size={12} strokeWidth={3} />;
    }
  };

  return (
    <div 
      className="relative group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.6rem] blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
      
      <div 
        className="relative card w-full bg-[#1e293b]/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-transform duration-200 ease-out rounded-[2.5rem] overflow-hidden"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        
        {/* POSTER SECTION */}
        <figure className="relative h-80 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60"></div>
          
          <img 
            src={movie.posterUrl || fallbackImage} 
            alt={movie.title} 
            className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
            onError={(e) => { e.target.src = fallbackImage; }} 
          />
          
          {/* STATUS PILL */}
          <div className="absolute top-6 left-6 z-20 transition-all duration-500 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
              <div className={`px-5 py-1.5 rounded-2xl text-[10px] font-black tracking-[0.25em] uppercase shadow-2xl backdrop-blur-xl border border-white/20 flex items-center gap-2 ${
                movie.watchStatus === 'Completed' ? 'bg-emerald-500/80 text-white' : 
                movie.watchStatus === 'Watching' ? 'bg-amber-400/80 text-black' : 'bg-white/80 text-black'
              }`}>
                {getStatusIcon(movie.watchStatus)} {movie.watchStatus}
              </div>
          </div>

          {/* FAVORITE STAR */}
          <button 
            onClick={() => onToggleFavorite(movie._id, movie.isFavorite)} 
            className={`btn btn-circle btn-sm absolute top-6 right-6 z-20 border border-white/20 transition-all duration-500 shadow-xl ${
              movie.isFavorite 
              ? 'bg-yellow-400 text-black scale-110' 
              : 'bg-black/40 backdrop-blur-2xl text-white hover:bg-white hover:text-black'
            }`}
          >
            <Star size={16} fill={movie.isFavorite ? "currentColor" : "none"} />
          </button>
        </figure>

        {/* CONTENT BODY */}
        <div className="card-body p-8 gap-0 bg-slate-950/20">
          
          {/* TITLE & META */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white leading-tight mb-2 uppercase tracking-tighter italic group-hover:text-primary transition-colors duration-500 line-clamp-1">
                {movie.title}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg uppercase tracking-[0.15em]">
                  {movie.type}
              </span>
              <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">
                // {movie.releaseYear}
              </span>
            </div>
          </div>

          {/* GENRE TAGS */}
          <div className="flex flex-wrap gap-2 mb-8 min-h-[40px]">
              {Array.isArray(movie.genre) && movie.genre.map((g, index) => (
                  <span 
                    key={index} 
                    className="bg-white/[0.03] text-white/50 border border-white/5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-500 hover:text-white"
                  >
                      {g}
                  </span>
              ))}
          </div>

          {/* STATS BAR */}
          <div className="flex justify-between items-center py-5 px-6 bg-gradient-to-r from-white/[0.05] to-transparent rounded-[2rem] border border-white/5 shadow-inner mb-2">
              <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5">
                    <Star size={10} className="text-amber-400" /> Rating
                  </span>
                  <span className="text-lg font-black text-amber-400">
                      {movie.rating > 0 ? `${movie.rating}.0` : "N/A"}
                  </span>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5">
                    <Radio size={10} className="text-primary" /> Streaming Platform
                  </span>
                  <span className="text-[11px] font-black text-white tracking-wider uppercase italic bg-white/5 px-3 py-1 rounded-md">
                      {movie.streamingPlatform || "OFFLINE"}
                  </span>
              </div>
          </div>

          {/* ACTION BAR */}
          <div className="flex justify-between items-center mt-6 pt-5 border-t border-white/5">
            <div className="hover:scale-110 transition-transform duration-300">
              <EditMovie 
                movie={movie} 
                fetchMovies={fetchMovies} 
                trigger={
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">
                    <Pencil size={16} /> Edit
                  </div>
                } 
              />
            </div>
            
            <button 
              className="flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-rose-500 hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.4)] uppercase tracking-widest transition-all duration-300 transform active:scale-90" 
              onClick={() => onDelete(movie)} 
            >
              <Trash2 size={16} /> Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;