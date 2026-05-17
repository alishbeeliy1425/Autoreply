import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-[2rem] shadow-xl p-8 border border-slate-200 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-[#F97316] blur-3xl opacity-20"></div>
        
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-[#1E3A8A] p-2 rounded-xl text-white">
            <Phone size={24} />
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] tracking-tight">AutoReply AI</h1>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
        <p className="text-slate-500 mb-8">Sign in to manage your WhatsApp automations.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none transition-all"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-[#F97316] hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none transition-all"
            />
          </div>

          <button type="submit" className="w-full bg-[#1E3A8A] text-white py-3.5 rounded-xl font-bold hover:bg-[#1E3A8A]/90 transition-colors flex items-center justify-center gap-2 mt-4 group">
            Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 font-medium">
          Don't have an account? <Link to="/signup" className="text-[#1E3A8A] hover:underline hover:text-[#F97316] transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
}
