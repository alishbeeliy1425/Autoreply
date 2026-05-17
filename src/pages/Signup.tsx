import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    // Simulate Signup
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify({ name: formData.name, email: formData.email }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-[2rem] shadow-xl p-8 border border-slate-200 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-[#F97316] blur-3xl opacity-20"></div>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-[#1E3A8A] p-2 rounded-xl text-white">
            <Phone size={24} />
          </div>
          <h1 className="text-xl font-bold text-[#1E3A8A] tracking-tight">AutoReply AI</h1>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
        <p className="text-slate-500 mb-8 text-sm">Join thousands of businesses automating their WhatsApp.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="you@company.com"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 (555) 000-0000"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none transition-all text-sm"
            />
          </div>

          <button type="submit" className="w-full bg-[#F97316] text-white py-3.5 rounded-xl font-bold hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2 mt-6 group">
            Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 font-medium">
          Already have an account? <Link to="/login" className="text-[#1E3A8A] hover:underline hover:text-[#F97316] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
