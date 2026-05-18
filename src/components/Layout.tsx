import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, KeyRound, Megaphone, Users, Settings, LogOut, Phone, Smartphone, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
    } else if (user) {
      setUserName(JSON.parse(user).name);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Live Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Keywords', icon: KeyRound, path: '/keywords' },
    { name: 'Broadcast', icon: Megaphone, path: '/broadcast' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Bot Sandbox', icon: Smartphone, path: '/sandbox' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#1E3A8A] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-[#F97316] p-2 rounded-lg text-white shrink-0">
              <Phone size={24} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">AutoReply AI</h1>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 " + (
                  isActive
                    ? 'bg-[#F97316]/10 text-[#F97316] font-medium sidebar-active'
                    : 'hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <item.icon size={20} className="stroke-[1.5]" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 p-4 rounded-xl mb-4">
            <p className="text-xs text-slate-400 mb-1">WhatsApp Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-white">Connected</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 py-4 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-sm text-slate-500 hidden sm:block">Welcome, <span className="font-medium text-slate-900">{userName || 'Admin'}</span></div>
            <div className="text-sm text-slate-900 sm:hidden font-medium">{userName || 'Admin'}</div>
            <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#F97316] flex items-center justify-center text-white font-bold shadow-sm">
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
