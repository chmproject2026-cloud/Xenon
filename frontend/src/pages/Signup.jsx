import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock, ShieldCheck, ArrowRight, Clapperboard, Sparkles, Fingerprint } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { 
                username, 
                password 
            });
            toast.success("Identity Verified. Proceed to Login.");
            navigate('/'); 
        } catch (err) {
            toast.error(err.response?.data || "Vault Registration failed.");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#020617] overflow-hidden selection:bg-primary selection:text-white">
            
            {/* ULTRA-RICH CINEMATIC BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-[0.08] grayscale scale-110 transition-transform duration-[20000ms] hover:scale-100"
                    alt="Space Cinema background"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-[#020617]"></div>
                
                {/* DYNAMIC NEON GLOWS */}
                <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-[150px]"></div>
            </div>

            {/* PREMIUM SIGNUP CHASSIS */}
            <div className="relative z-10 w-full max-w-md p-10 sm:p-16 bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-[3.5rem] mx-4 group animate-in fade-in zoom-in duration-700">
                
                {/* BRANDING SECTION */}
                <div className="flex flex-col items-center mb-14">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-primary to-indigo-600 p-5 rounded-[2.2rem] shadow-2xl transform group-hover:-rotate-12 transition-transform duration-700">
                            <Fingerprint className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Join <span className="text-primary">Archive</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-4 opacity-30">
                        <Sparkles size={10} className="text-primary" />
                        <span className="text-[9px] font-black tracking-[0.5em] text-white uppercase">Initialize Cloud Vault</span>
                    </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-8">
                    {/* USERNAME INPUT */}
                    <div className="relative group/input">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors z-10">
                            <UserPlus size={18} />
                        </div>
                        <input 
                            type="text" 
                            id="username"
                            placeholder=" " 
                            className="peer w-full bg-white/[0.03] border border-white/5 h-16 rounded-2xl pl-16 pr-6 font-bold text-sm tracking-widest focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] focus:ring-[15px] focus:ring-primary/5 transition-all text-white placeholder:opacity-0" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                        <label 
                            htmlFor="username"
                            className="absolute left-16 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] transition-all duration-300 pointer-events-none
                            peer-focus:-top-4 peer-focus:left-6 peer-focus:text-primary 
                            peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-primary"
                        >
                            Unique Identifier
                        </label>
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="relative group/input">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors z-10">
                            <Lock size={18} />
                        </div>
                        <input 
                            type="password" 
                            id="password"
                            placeholder=" "
                            className="peer w-full bg-white/[0.03] border border-white/5 h-16 rounded-2xl pl-16 pr-6 font-bold text-sm tracking-widest focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] focus:ring-[15px] focus:ring-primary/5 transition-all text-white placeholder:opacity-0" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <label 
                            htmlFor="password"
                            className="absolute left-16 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] transition-all duration-300 pointer-events-none
                            peer-focus:-top-4 peer-focus:left-6 peer-focus:text-primary 
                            peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-primary"
                        >
                            Master Security Key
                        </label>
                    </div>

                    {/* REGISTER BUTTON */}
                    <button type="submit" className="group relative w-full h-18 py-5 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)] overflow-hidden active:scale-95">
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Authorize Identity <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="relative flex items-center py-12">
                    <div className="flex-grow border-t border-white/5"></div>
                    <div className="flex items-center gap-2 mx-6">
                        <ShieldCheck size={12} className="text-white/10" />
                        <span className="text-white/10 text-[8px] font-black uppercase tracking-[0.5em]">Identity Gate</span>
                    </div>
                    <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* BACK TO LOGIN */}
                <Link to="/">
                    <button className="group w-full h-14 border border-white/5 hover:border-primary/30 text-white/40 hover:text-white font-black text-[9px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-white/[0.02] flex items-center justify-center gap-2">
                        Return to Access Terminal
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Signup;