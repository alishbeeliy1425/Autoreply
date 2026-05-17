import { useState } from 'react';
import { Send, Users, Image as ImageIcon, FileText } from 'lucide-react';

export default function Broadcast() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!message) return;
    
    setIsSending(true);
    // Simulate sending broadcast
    setTimeout(() => {
      setIsSending(false);
      setStatus('Success! Broadcast sent to 215 active customers.');
      setMessage('');
      setTimeout(() => setStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">New Broadcast</h1>
        <p className="text-slate-500 text-sm">Send bulk promotional messages to your audience.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Form area */}
        <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-slate-200">
          <form onSubmit={handleBroadcast}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">Target Audience</label>
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">Select in WhatsApp App</h4>
                    <p className="text-xs text-slate-500">Pick contacts manually</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    if (message.trim()) {
                      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                    } else {
                      alert('Please enter a message first');
                    }
                  }}
                  className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-200 transition"
                  title="Click to open WhatsApp and select broadcast recipients"
                >
                  Forward via WhatsApp
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">Message Content</label>
              <textarea
                required
                rows={6}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Hello {{name}}, we have a special offer for you today..."
                className="w-full border border-slate-300 rounded-2xl p-4 focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none resize-none text-sm"
              ></textarea>
              <div className="flex gap-2 mt-3">
                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition">
                  <ImageIcon size={14} /> Add Image
                </button>
                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition">
                  <FileText size={14} /> Add Document
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSending || !message}
              className="w-full bg-[#1E3A8A] text-white py-3.5 rounded-xl font-bold hover:bg-[#1E3A8A]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSending ? 'Sending Broadcast...' : <><Send size={18} /> Send Broadcast Now</>}
            </button>
            {status && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100 text-center">
                {status}
              </div>
            )}
          </form>
        </div>

        {/* Preview Area */}
        <div className="p-8 md:w-1/3 bg-slate-100 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider w-full text-center">Live Preview</h3>
          
          <div className="w-[260px] h-[480px] bg-white border-[6px] border-gray-800 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col">
            <div className="bg-[#075e54] text-white py-3 px-4 shadow-md flex items-center gap-2 z-10">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="text-sm font-bold">Business Name</div>
            </div>
            
            <div className="flex-1 bg-[#efeae2] p-4 flex flex-col justify-end">
              {message ? (
                <div className="bg-white p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm text-slate-800 overflow-hidden whitespace-pre-wrap break-words border border-slate-200 relative">
                  {message.replace('{{name}}', 'John')}
                  <div className="text-right text-[10px] text-slate-400 mt-1">12:00 PM</div>
                </div>
              ) : (
                <div className="text-center text-xs text-slate-500 italic bg-white/50 py-1 rounded-full w-3/4 mx-auto border border-slate-200">
                  Type to see preview...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
