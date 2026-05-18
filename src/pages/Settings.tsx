import { ShieldCheck, User, CreditCard, Bell, Save, Loader2, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

type Tab = 'profile' | 'whatsapp' | 'billing' | 'notifications';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [settings, setSettings] = useState({
    businessName: '',
    industry: 'Retail & E-commerce',
    systemPrompt: '',
    whatsappNumber: '',
    autoReplyEnabled: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
           businessName: data.businessName || '',
           industry: data.industry || 'Retail & E-commerce',
           systemPrompt: data.systemPrompt || '',
           whatsappNumber: data.whatsappNumber || '',
           autoReplyEnabled: data.autoReplyEnabled ?? true
        });
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

  const TabButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`w-full text-left px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 text-sm shadow-sm transition-colors ${isActive ? 'bg-[#1E3A8A] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <Icon size={16} /> {label}
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account, billing, and WhatsApp connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <TabButton tab="profile" icon={User} label="Profile & Business" />
          <TabButton tab="whatsapp" icon={ShieldCheck} label="WhatsApp API" />
          <TabButton tab="billing" icon={CreditCard} label="Billing" />
          <TabButton tab="notifications" icon={Bell} label="Notifications" />
        </div>

        <div className="md:col-span-3">
          {activeTab === 'profile' && (
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
          )}

          {activeTab === 'whatsapp' && (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
               <div className="p-6 border-b border-slate-200">
                 <h2 className="text-lg font-bold text-slate-900">WhatsApp Connection</h2>
                 <p className="text-sm text-slate-500 mt-1">Connect your WhatsApp Business API to let AutoReply AI respond to real incoming messages.</p>
               </div>
               
               <div className="p-6 space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                   <div className="flex items-center gap-3">
                     <div className="relative flex-1">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                         <Phone size={16} />
                       </div>
                       <input 
                         type="tel" 
                         placeholder="+1234567890"
                         value={settings.whatsappNumber} 
                         onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                         className="w-full border border-slate-300 rounded-xl pl-10 px-4 py-2.5 focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] outline-none text-sm" 
                       />
                     </div>
                     <span className={`text-xs font-semibold px-2 py-1 rounded-md shrink-0 ${settings.whatsappNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                       {settings.whatsappNumber ? 'Connected' : 'Not Configured'}
                     </span>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number ID</label>
                     <input 
                       type="text" 
                       placeholder="e.g. 1029384756"
                       className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] outline-none text-sm bg-white"
                     />
                     <p className="text-[11px] text-slate-500 mt-1.5 flex flex-wrap">From your Meta App Dashboard under WhatsApp &gt; API Setup.</p>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">System User Access Token</label>
                     <input 
                       type="password" 
                       placeholder="EAABxyz..."
                       className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] outline-none text-sm bg-white"
                     />
                     <p className="text-[11px] text-slate-500 mt-1.5 flex flex-wrap">A permanent token generated in Business Settings.</p>
                   </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100">
                   <label className="block text-sm font-medium text-slate-700 mb-2">Webhook Verify Token</label>
                   <input 
                     type="text" 
                     placeholder="my_custom_verify_token_123"
                     className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] outline-none text-sm bg-white font-mono"
                   />
                   <p className="text-[11px] text-slate-500 mt-1.5">You will need to enter this token when configuring your webhook URL in the Meta Dashboard.</p>
                 </div>

                 <div className="pt-2">
                   <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                     <div className="relative inline-block w-10 h-6 shrink-0">
                       <input 
                         type="checkbox" 
                         className="peer sr-only" 
                         checked={settings.autoReplyEnabled} 
                         onChange={e => setSettings({...settings, autoReplyEnabled: e.target.checked})}
                       />
                       <div className="block bg-slate-300 w-10 h-6 rounded-full peer-checked:bg-[#1E3A8A] transition-colors"></div>
                       <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                     </div>
                     <div>
                       <div className="text-sm font-bold text-slate-900">Enable AI Auto-Responder</div>
                       <div className="text-xs text-slate-500 mt-0.5">When enabled, the AI will automatically reply to incoming messages when you are not online.</div>
                     </div>
                   </label>
                 </div>

                 <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                   <div className="text-emerald-600 text-sm font-medium">{saveMessage}</div>
                   <button 
                     onClick={handleSave}
                     disabled={isLoading || isSaving}
                     className="bg-[#1E3A8A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-900 flex items-center gap-2 disabled:opacity-70"
                   >
                     {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Connection
                   </button>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
               <CreditCard size={48} className="text-slate-300 mb-4" />
               <h2 className="text-lg font-bold text-slate-900 mb-2">Billing Information</h2>
               <p className="text-sm text-slate-500 mb-6 max-w-sm">Manage your subscription, view past invoices, and update your payment method.</p>
               <button className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 text-sm">
                 Manage Billing
               </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
               <Bell size={48} className="text-slate-300 mb-4" />
               <h2 className="text-lg font-bold text-slate-900 mb-2">Notification Preferences</h2>
               <p className="text-sm text-slate-500 mb-6 max-w-sm">Decide how and when you want to be notified about important account activity.</p>
               <button className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 text-sm">
                 Configure Notifications
               </button>
            </div>
          )}
          
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
