
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { ZysculptLogo } from './Sidebar';
import { 
  Loader2, 
  Mail, 
  Lock, 
  AlertCircle, 
  ChevronRight, 
  User, 
  Eye, 
  EyeOff, 
  Github, 
  Chrome, 
  ArrowLeft
} from 'lucide-react';

type AuthView = 'signin' | 'signup' | 'forgot-password';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<AuthView>('signin');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!isSupabaseConfigured) {
      setError("Supabase configuration is missing.");
      setLoading(false);
      return;
    }

    try {
      if (view === 'signup') {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { 
              full_name: fullName,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff`
            }
          }
        });
        if (error) throw error;
        if (data?.user && data?.session === null) {
          setSuccess("Check your email for confirmation.");
        }
      } else if (view === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-12">
          <ZysculptLogo theme="dark" size={80} />
          <h1 className="text-5xl font-black text-white mt-4 tracking-tighter" style={{ fontFamily: "'DM Sans', sans-serif" }}>zysculpt</h1>
          <p className="text-slate-400 mt-2 text-sm">Your AI Career Copilot.</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">
            {view === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {view === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all text-sm"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3.5 pl-12 pr-12 text-white outline-none focus:border-indigo-500 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">{error}</div>}
            {success && <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Continue'}
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-[#1a1a1a] px-4 text-slate-600">Or</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-2 py-3 bg-[#121212] border border-white/5 rounded-2xl text-xs font-bold text-white hover:bg-white/5 transition-all">
              <Chrome size={18} /> Google
            </button>
            <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-2 py-3 bg-[#121212] border border-white/5 rounded-2xl text-xs font-bold text-white hover:bg-white/5 transition-all">
              <Github size={18} /> GitHub
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => setView(view === 'signin' ? 'signup' : 'signin')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              {view === 'signup' ? 'Back to sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
