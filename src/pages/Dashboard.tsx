import { useState, useEffect } from 'react';
import { MessageSquare, Users, Zap, Radio, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    activeCustomers: 0,
    aiResponses: 0,
    broadcastsSent: 0
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const cards = [
    { title: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Active Customers', value: stats.activeCustomers, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'AI Responses', value: stats.aiResponses, icon: Zap, color: 'text-[#F97316]', bg: 'bg-[#F97316]/10' },
    { title: 'Broadcasts Sent', value: stats.broadcastsSent, icon: Radio, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Overview</h1>
        <p className="text-slate-500 text-sm">Track your WhatsApp automation performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{card.value.toLocaleString()}</h3>
              </div>
              <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + card.bg + " " + card.color}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium bg-emerald-50 w-fit px-2 py-1 rounded-md">
              <ArrowUpRight size={14} className="mr-1" />
              12% this week
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 hover:bg-slate-100 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white text-xl">🤖</div>
              <div>
                <p className="text-sm font-medium text-slate-900">AI auto-replied to John Doe</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 hover:bg-slate-100 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white text-xl">👤</div>
              <div>
                <p className="text-sm font-medium text-slate-900">Alice Smith triggered "Price" keyword</p>
                <p className="text-xs text-slate-500">15 minutes ago</p>
              </div>
            </div>
          </div>
          <Link to="/chat" className="block mt-4 text-center text-sm font-medium text-[#F97316] hover:text-[#EA580C]">
            View all activity &rarr;
          </Link>
        </div>

        <div className="bg-[#1E3A8A] rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">WhatsApp Connected</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-[280px]">Your business number is active and AI responder is monitoring incoming messages.</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-[280px]">
              <p className="text-xs text-slate-400 mb-1">Connected Number</p>
              <p className="font-mono text-lg">091 3567 077</p>
            </div>
          </div>
          <div className="absolute right-[-40px] bottom-[-40px] opacity-10">
            <MessageSquare size={240} />
          </div>
        </div>
      </div>
    </div>
  );
}
