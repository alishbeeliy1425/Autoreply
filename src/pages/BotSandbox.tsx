import { useState, useRef, useEffect } from 'react';
import { Send, Phone, User, Bot, Loader2, ArrowLeft, MoreVertical } from 'lucide-react';

export default function BotSandbox() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm testing the auto-responder.", isBot: false },
    { id: 2, text: "Welcome to our store! How can I assist you today? I am your AI assistant.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/simulate-incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: 999, text: userMsg.text }) // Use 999 as guest/sandbox ID
      });
      const data = await res.json();
      
      if (data.replyMsg) {
        setMessages(prev => [...prev, { id: data.replyMsg.id, text: data.replyMsg.text, isBot: true }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6">
      {/* Left side description - hidden on mobile so chat is full width */}
      <div className="hidden md:flex flex-col w-1/3 space-y-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Bot Sandbox</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Test how customers will experience your AI assistant on WhatsApp. 
            Type anything in the simulator to see exactly how your bot responds based on your Settings & rules.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Bot size={18} className="text-[#1E3A8A]" /> AI Fallback Test
          </h3>
          <p className="text-sm text-slate-600">
            Based on your instructions, if the AI doesn't know an answer, it will direct you to contact human support at <strong>091 3567 077</strong>.
          </p>
          <div className="bg-slate-100 p-4 rounded-xl text-sm italic text-slate-600">
            <strong>Try asking:</strong> "I need to talk to a human" or ask a complex question outside of retail scope!
          </div>
        </div>
      </div>

      {/* Right side Full Screen Chat Simulator */}
      <div className="flex-1 flex flex-col h-full bg-[#efeae2] sm:rounded-3xl sm:border-[8px] sm:border-slate-800 overflow-hidden relative shadow-md w-full">
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white py-3 md:py-4 px-4 shadow-md flex items-center gap-3 z-10 shrink-0">
          <ArrowLeft size={20} className="opacity-90 hidden sm:block" />
          <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
             <Bot size={24} className="text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold truncate">Business Support (Test Mode)</h3>
            <p className="text-xs opacity-80 truncate">Always awake, replies instantly</p>
          </div>
          <MoreVertical size={20} className="opacity-90 shrink-0" />
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 md:gap-4 relative z-0">
           {/* WhatsApp background doodle placeholder - using a light color */}
          <div className="absolute inset-0 bg-[#efeae2] opacity-50 z-[-1]" />
          
          <div className="flex justify-center mb-2">
            <div className="bg-[#e1f3fb] text-[#1f2937] text-[11px] md:text-sm px-3 md:px-4 py-1.5 rounded-lg uppercase tracking-wider font-semibold shadow-sm">
              Today
            </div>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 md:p-4 shadow-sm text-[15px] md:text-base break-words relative pb-6 md:pb-7 
                ${msg.isBot ? 'bg-white rounded-tl-sm text-slate-800' : 'bg-[#dcf8c6] rounded-tr-sm text-slate-900'}
              `}>
                {msg.text}
                <div className="absolute bottom-1.5 md:bottom-2 right-2 md:right-3 text-[10px] md:text-[11px] text-slate-400 font-medium">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-sm p-4 shadow-sm flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* WA Input Area */}
        <div className="p-3 md:p-4 bg-[#f0f0f0] shrink-0 z-10 w-full">
          <form onSubmit={handleSend} className="flex gap-2 items-center max-w-4xl mx-auto">
            <div className="flex-1 bg-white rounded-full flex items-center px-4 md:px-5 py-2 md:py-3 min-h-[48px] md:min-h-[54px] shadow-sm">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message"
                className="flex-1 bg-transparent outline-none text-[15px] md:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#00a884] text-white rounded-full flex items-center justify-center shrink-0 hover:bg-[#008f6f] disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={20} className="mr-0.5 md:mr-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
