import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Zap, Edit2 } from 'lucide-react';

export default function Keywords() {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState({ keyword: '', reply: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = () => {
    fetch('/api/keywords')
      .then(res => res.json())
      .then(data => setKeywords(data))
      .catch(err => console.error(err));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newKeyword.keyword || !newKeyword.reply) return;

    try {
      if (editingId) {
        await fetch('/api/keywords/' + editingId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newKeyword)
        });
      } else {
        await fetch('/api/keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newKeyword)
        });
      }
      setNewKeyword({ keyword: '', reply: '' });
      setIsAdding(false);
      setEditingId(null);
      fetchKeywords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (kw) => {
    setNewKeyword({ keyword: kw.keyword, reply: kw.reply });
    setEditingId(kw.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await fetch("/api/keywords/" + id, { method: 'DELETE' });
      fetchKeywords();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await fetch("/api/keywords/" + id + "/toggle", { method: 'POST' });
      fetchKeywords();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Keyword Auto Replies</h1>
          <p className="text-slate-500 text-sm">Create triggers to automatically respond to common questions.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#1E3A8A]/90 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Keyword
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-[#F97316]" /> {editingId ? 'Edit Trigger' : 'New Trigger'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Keyword/Phrase</label>
              <input
                type="text"
                required
                value={newKeyword.keyword}
                onChange={e => setNewKeyword({...newKeyword, keyword: e.target.value})}
                placeholder="e.g., Price, Location, Hello"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Auto Reply Message</label>
              <textarea
                required
                value={newKeyword.reply}
                onChange={e => setNewKeyword({...newKeyword, reply: e.target.value})}
                placeholder="Type the automatic response here..."
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none h-24 resize-none"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200">Cancel</button>
            <button type="submit" className="bg-[#F97316] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#EA580C]">Save Keyword</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search keywords..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none" />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-medium">Trigger Keyword</th>
              <th className="p-4 font-medium">Auto Reply</th>
              <th className="p-4 font-medium w-32">Status</th>
              <th className="p-4 font-medium w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {keywords.map(kw => (
              <tr key={kw.id} className="hover:bg-slate-100/50 transition-colors">
                <td className="p-4 font-semibold text-slate-900 border-l-4 border-l-transparent hover:border-l-[#F97316]">
                  <span className="bg-slate-200 px-3 py-1 rounded-md">{kw.keyword}</span>
                </td>
                <td className="p-4 text-slate-600 max-w-md truncate">{kw.reply}</td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleStatus(kw.id)}
                    className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none " + (kw.enabled ? 'bg-emerald-500' : 'bg-gray-300')}
                  >
                    <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform " + (kw.enabled ? 'translate-x-6' : 'translate-x-1')}/>
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleEdit(kw)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(kw.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {keywords.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No keywords found. Add one above!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
