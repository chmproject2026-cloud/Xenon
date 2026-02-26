import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Film, Plus, X, Star, Layout, Globe, Calendar, Tv } from 'lucide-react';

const AddMovie = ({ fetchMovies }) => {
  const [movie, setMovie] = useState({
    title: '',
    type: 'Movie',
    genre: '',
    rating: '',
    watchStatus: 'Plan to Watch',
    streamingPlatform: '',
    releaseYear: '',
    posterUrl: '',
    isFavorite: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const movieData = {
        title: movie.title.trim(),
        type: movie.type,
        genre: movie.genre
          .split(',')
          .map(g => g.trim())
          .filter(Boolean),
        rating: movie.rating ? Number(movie.rating) : undefined,
        watchStatus: movie.watchStatus,
        streamingPlatform: movie.streamingPlatform.trim() || undefined,
        releaseYear: movie.releaseYear ? Number(movie.releaseYear) : undefined,
        posterUrl: movie.posterUrl.trim() || undefined,
        isFavorite: movie.isFavorite
      };

      await axios.post(
        'http://localhost:5000/api/movies',
        movieData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Movie added to database!');

      setMovie({
        title: '',
        type: 'Movie',
        genre: '',
        rating: '',
        watchStatus: 'Plan to Watch',
        streamingPlatform: '',
        releaseYear: '',
        posterUrl: '',
        isFavorite: false
      });

      document.getElementById('add_movie_modal').close();
      fetchMovies();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Cloud synchronization failed'
      );
    }
  };

  return (
    <>
      {/* PREMIUM TRIGGER BUTTON */}
      <button
        className="btn btn-primary h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_25px_rgba(59,130,246,0.4)] hover:scale-105 transition-all active:scale-95 border-none group relative overflow-hidden"
        onClick={() => document.getElementById('add_movie_modal').showModal()}
      >
        <span className="relative z-10 flex items-center gap-2">
          <Plus size={18} strokeWidth={3} /> New Entry
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </button>

      <dialog id="add_movie_modal" className="modal backdrop-blur-md">
        <div className="modal-box w-11/12 max-w-2xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 sm:p-14 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 border border-primary/20">
              <Film className="text-primary" size={32} />
            </div>
            <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
              Archival <span className="text-primary">Initiation</span>
            </h3>
            <p className="text-[11px] font-black tracking-[0.4em] text-white/20 uppercase mt-4">
              Update your global movie archive
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Title - Full Width */}
            <div className="form-control md:col-span-2 flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Layout size={12} /> Movie / Series Title
              </label>
              <input
                type="text"
                placeholder="e.g. Inception"
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base tracking-wide focus:border-primary transition-all text-white w-full placeholder:text-white/5"
                value={movie.title}
                onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                required
              />
            </div>

            {/* Type */}
            <div className="form-control flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Media Type</label>
              <select
                className="select bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base text-white focus:border-primary w-full"
                value={movie.type}
                onChange={(e) => setMovie({ ...movie, type: e.target.value })}
              >
                <option value="Movie" className="bg-slate-900">Movie</option>
                <option value="Series" className="bg-slate-900">Series</option>
              </select>
            </div>

            {/* Rating */}
            <div className="form-control flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Star size={12} className="text-amber-400" /> Cloud Rating
              </label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="1 - 10"
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base text-amber-400 focus:border-primary w-full placeholder:text-white/5"
                value={movie.rating}
                onChange={(e) => setMovie({ ...movie, rating: e.target.value })}
              />
            </div>

            {/* Genres - Full Width */}
            <div className="form-control md:col-span-2 flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Genres (Comma separated)</label>
              <input
                type="text"
                placeholder="Action, Sci-Fi, Thriller"
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base tracking-wide focus:border-primary transition-all text-white w-full placeholder:text-white/5"
                value={movie.genre}
                onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
                required
              />
            </div>

            {/* Status */}
            <div className="form-control flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Watch Status</label>
              <select
                className="select bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base text-white focus:border-primary w-full"
                value={movie.watchStatus}
                onChange={(e) => setMovie({ ...movie, watchStatus: e.target.value })}
              >
                <option value="Plan to Watch" className="bg-slate-900">Plan to Watch</option>
                <option value="Watching" className="bg-slate-900">Watching</option>
                <option value="Completed" className="bg-slate-900">Completed</option>
              </select>
            </div>

            {/* Platform */}
            <div className="form-control flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Tv size={12} /> Network / Platform
              </label>
              <input
                type="text"
                placeholder="Netflix / Prime"
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base text-white focus:border-primary w-full placeholder:text-white/5"
                value={movie.streamingPlatform}
                onChange={(e) => setMovie({ ...movie, streamingPlatform: e.target.value })}
              />
            </div>

            {/* Release Year */}
            <div className="form-control flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Calendar size={12} /> Release Year
              </label>
              <input
                type="number"
                placeholder="e.g. 2024"
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base text-white focus:border-primary w-full placeholder:text-white/5"
                value={movie.releaseYear}
                onChange={(e) => setMovie({ ...movie, releaseYear: e.target.value })}
              />
            </div>

            {/* Poster URL */}
            <div className="form-control flex flex-col gap-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Globe size={12} /> Poster Image URL
              </label>
              <input
                type="text"
                placeholder="https://..."
                className="input bg-white/5 border-white/10 h-16 px-7 rounded-2xl font-bold text-base text-white focus:border-primary w-full placeholder:text-white/5"
                value={movie.posterUrl}
                onChange={(e) => setMovie({ ...movie, posterUrl: e.target.value })}
              />
            </div>

            {/* Favorite Toggle - Full Width */}
            <div className="form-control md:col-span-2 bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
              <label className="label cursor-pointer justify-between p-0">
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors flex items-center gap-3">
                  <Star size={16} className="text-amber-400" /> Mark as Top Pick
                </span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary border-white/20 w-8 h-8 rounded-xl"
                  checked={movie.isFavorite}
                  onChange={(e) => setMovie({ ...movie, isFavorite: e.target.checked })}
                />
              </label>
            </div>

            {/* ACTIONS */}
            <div className="md:col-span-2 flex items-center gap-6 mt-6 pt-10 border-t border-white/5">
              <button
                type="submit"
                className="flex-1 h-18 py-5 bg-primary hover:bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-[0_15px_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-all border-none"
              >
                Sync to Cloud
              </button>
              <button
                type="button"
                className="h-18 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] text-white/30 hover:text-white transition-all bg-white/5"
                onClick={() => document.getElementById('add_movie_modal').close()}
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddMovie;