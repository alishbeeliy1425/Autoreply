import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Phone, MessageSquare } from 'lucide-react';

export default function LiveChat() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        if (data.length > 0) setSelectedCustomerId(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      fetch( "/api/chats/" + selectedCustomerId )
        .then(res => res.json())
        .then(data => setChats(data));
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !selectedCustomerId) return;

    setIsSending(true);
    const text = input;
    setInput('');
    setAiSuggestion('');

    try {
      const res = await fetch('/api/chats/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: selectedCustomerId, text })
      });
      const newMsg = await res.json();
      setChats(prev => [...prev, newMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const getAiSuggestion = async () => {
    if (chats.length === 0) return;
    const lastCustomerMsg = [...chats].reverse().find(c => c.sender === 'customer');
    if (!lastCustomerMsg) return;

    setIsSuggesting(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: lastCustomerMsg.text })
      });
      const data = await res.json();
      setAiSuggestion(data.suggestion);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSimulateIncoming = async () => {
    try {
      const res = await fetch('/api/ai/simulate-incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: selectedCustomerId, text: 'Hello, what products do you sell?' })
      });
      const data = await res.json();
      setChats(prev => [...prev, data.customerMsg, data.replyMsg].filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar - Customer List */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-100/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-semibold text-slate-800">Messages</h2>
          <button 
            onClick={handleSimulateIncoming}
            className="mt-2 text-xs w-full bg-emerald-100 text-emerald-700 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-200 transition-colors font-medium"
          >
            Simulate Incoming Message
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {customers.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCustomerId(c.id)}
              className={"w-full text-left p-4 border-b border-gray-50 hover:bg-slate-100 transition-colors flex items-start gap-3 " + (selectedCustomerId === c.id ? 'bg-blue-50/50 border-l-4 border-l-[#F97316]' : 'border-l-4 border-l-transparent')}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-sm text-slate-900 truncate">{c.name}</h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">Just now</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={12} /> {selectedCustomer.phone}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedCustomer.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-200 text-slate-600 rounded-md text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9FAFB]/50">
              {chats.map(msg => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={"flex gap-3 " + (isBot ? 'flex-row-reverse' : '')}>
                    <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm " + (isBot ? 'bg-[#1E3A8A] text-[#F97316]' : 'bg-slate-200 text-slate-600')}>
                      {isBot ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={"max-w-[70%] " + (isBot ? 'text-right' : 'text-left')}>
                      <div className={"inline-block px-4 py-2.5 rounded-2xl text-sm shadow-sm " + (isBot ? 'bg-[#1E3A8A] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm')}>
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={endOfMessagesRef} />
            </div>

            {/* AI Suggestion Box */}
            {aiSuggestion && (
              <div className="px-6 py-3 bg-indigo-50 border-t border-indigo-100">
                <div className="flex items-start gap-2">
                  <Sparkles size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-indigo-900 font-medium mb-1">AI Suggestion</p>
                    <p className="text-sm text-indigo-800 bg-white p-3 rounded-xl border border-indigo-100">{aiSuggestion}</p>
                    <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => { setInput(aiSuggestion); setAiSuggestion(''); }}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 font-medium"
                      >
                        Use this
                      </button>
                      <button 
                        onClick={() => setAiSuggestion('')}
                        className="text-xs bg-white text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="flex gap-2">
                <button
                  type="button"
                  onClick={getAiSuggestion}
                  disabled={isSuggesting || chats.length === 0}
                  className="p-3 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50 group relative"
                  title="Generate AI Reply"
                >
                  {isSuggesting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-shadow text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="bg-[#1E3A8A] text-white p-3 rounded-xl hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
