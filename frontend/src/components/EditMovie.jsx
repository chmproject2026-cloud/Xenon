import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  PencilLine, Save, X, Film, Star, Layers, Activity, History, Loader2 // Added Loader2
} from 'lucide-react';

const EditMovie = ({ movie, fetchMovies, trigger }) => {
  const [updatedMovie, setUpdatedMovie] = useState({ 
    ...movie,
    genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre 
  });

  // --- NEW SYNCING STATE ---
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSyncing(true); // Start animation
    try {
      const token = localStorage.getItem('token');
      const finalData = {
        ...updatedMovie,
        genre: updatedMovie.genre.split(',').map(g => g.trim()).filter(g => g !== "")
      };

      await axios.put(`http://localhost:5000/api/movies/${movie._id}`, finalData, {
        headers: { Authorization: token }
      });
      
      toast.success(`${movie.title} Synchronized!`);
      document.getElementById(`edit_modal_${movie._id}`).close();
      fetchMovies(); 
    } catch (err) {
      toast.error("Cloud update failed.");
    } finally {
      setIsSyncing(false); // Stop animation
    }
  };

  return (
    <>
      <div onClick={() => document.getElementById(`edit_modal_${movie._id}`).showModal()}>
        {trigger || (
          <button className="text-[10px] font-black text-primary/60 hover:text-primary uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 group">
            <PencilLine size={14} className="group-hover:rotate-12 transition-transform" /> EDIT
          </button>
        )}
      </div>
      
      <dialog id={`edit_modal_${movie._id}`} className="modal backdrop-blur-md">
        <div className="modal-box w-11/12 max-w-xl bg-[#0f172a]/95 border border-white/10 rounded-[3rem] p-10 sm:p-14 shadow-[0_0_100px_rgba(0,0,0,0.8)] scrollbar-hide">
          
          <div className="text-center mb-12">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <Activity className={`text-primary ${isSyncing ? 'animate-spin' : ''}`} size={28} />
            </div>
            <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                Update <span className="text-primary">Metadata</span>
            </h3>
            <div className="flex items-center justify-center gap-2 mt-4">
               <History size={10} className="text-white/20" />
               <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
                 ID: {movie._id.slice(-8)}
               </p>
            </div>
          </div>
          
          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-x-8 gap-y-10">
            {/* ... inputs stay exactly the same ... */}
            <div className="col-span-2 flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                <Film size={12} className="text-primary" /> Movie/Series Title
              </label>
              <input 
                type="text" 
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-sm tracking-wide focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-white w-full outline-none" 
                value={updatedMovie.title} 
                onChange={(e) => setUpdatedMovie({...updatedMovie, title: e.target.value})} 
                required
              />
            </div>

            <div className="col-span-2 flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                <Layers size={12} className="text-primary" /> Categories
              </label>
              <input 
                type="text" 
                placeholder="Action, Sci-Fi..."
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-sm tracking-wide focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-white w-full outline-none" 
                value={updatedMovie.genre} 
                onChange={(e) => setUpdatedMovie({...updatedMovie, genre: e.target.value})} 
                required
              />
            </div>

            <div className="col-span-1 flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-2">Status</label>
              <select 
                className="select bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-xs text-white focus:border-primary w-full outline-none" 
                value={updatedMovie.watchStatus} 
                onChange={(e) => setUpdatedMovie({...updatedMovie, watchStatus: e.target.value})}
              >
                  <option value="Plan to Watch" className="bg-[#0f172a]">Plan to Watch</option>
                  <option value="Watching" className="bg-[#0f172a]">Watching</option>
                  <option value="Completed" className="bg-[#0f172a]">Completed</option>
              </select>
            </div>

            <div className="col-span-1 flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                <Star size={12} className="text-amber-400" /> Score
              </label>
              <input 
                type="number" 
                min="1" max="10"
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-sm text-amber-400 focus:border-primary transition-all w-full outline-none" 
                value={updatedMovie.rating} 
                onChange={(e) => setUpdatedMovie({...updatedMovie, rating: e.target.value})} 
              />
            </div>

            {/* BUTTONS WITH NEW SYNCING LOGIC */}
            <div className="col-span-2 flex items-center gap-6 mt-6 pt-10 border-t border-white/5">
              <button 
                type="submit" 
                disabled={isSyncing}
                className={`flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all border-none flex items-center justify-center gap-3 shadow-2xl ${
                    isSyncing 
                    ? 'bg-slate-800 text-white/40 cursor-wait' 
                    : 'bg-primary hover:bg-blue-600 text-white hover:scale-[1.02] active:scale-95 shadow-primary/30'
                }`}
              >
                {isSyncing ? (
                    <>
                        <Loader2 size={18} className="animate-spin text-primary" />
                        UPLOADING...
                    </>
                ) : (
                    <>
                        <Save size={18} /> Sync Changes
                    </>
                )}
              </button>
              <button 
                type="button" 
                disabled={isSyncing}
                className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white/20 hover:text-white transition-all bg-white/5 flex items-center justify-center gap-2 disabled:opacity-30" 
                onClick={() => document.getElementById(`edit_modal_${movie._id}`).close()}
              >
                <X size={16} /> Discard
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditMovie;