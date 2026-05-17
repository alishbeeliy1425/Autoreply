import { ShieldCheck, User, CreditCard, Bell, Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    businessName: '',
    industry: 'Retail & E-commerce',
    systemPrompt: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account, billing, and WhatsApp connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <button className="w-full text-left px-4 py-2.5 rounded-xl font-medium bg-[#1E3A8A] text-white flex items-center gap-2 text-sm shadow-sm">
            <User size={16} /> Profile & Business
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 flex items-center gap-2 text-sm">
            <ShieldCheck size={16} /> WhatsApp API
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 flex items-center gap-2 text-sm">
            <CreditCard size={16} /> Billing
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 flex items-center gap-2 text-sm">
            <Bell size={16} /> Notifications
          </button>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Business Profile</h2>
              <p className="text-sm text-slate-500 mt-1">Information displayed to your customers.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                  <input 
                    type="text" 
                    value={settings.businessName} 
                    onChange={e => setSettings({...settings, businessName: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                  <select 
                    value={settings.industry}
                    onChange={e => setSettings({...settings, industry: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none text-sm bg-white"
                  >
                    <option>Retail & E-commerce</option>
                    <option>Services</option>
                    <option>Software / SaaS</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bot Persona / System Prompt (AI)</label>
                <textarea 
                  rows={8}
                  value={settings.systemPrompt}
                  onChange={e => setSettings({...settings, systemPrompt: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none text-sm resize-y"
                ></textarea>
                <p className="text-xs text-slate-500 mt-2">This instructs the Gemini AI how to behave when auto-replying.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <div className="text-emerald-600 text-sm font-medium">{saveMessage}</div>
                <button 
                  onClick={handleSave}
                  disabled={isLoading || isSaving}
                  className="bg-[#F97316] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#EA580C] flex items-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-2xl border border-red-100 mt-8 p-6">
            <h3 className="text-red-800 font-bold mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">Disconnecting WhatsApp will immediately stop all auto-replies and AI responses.</p>
            <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
              Disconnect WhatsApp Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
