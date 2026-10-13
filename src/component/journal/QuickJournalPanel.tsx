export default function QuickJournalPanel({isOpen, onClose, context}:{isOpen:boolean; onClose:()=>void; context?: any}) {
  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose}/>
      <aside className="w-full max-w-md h-full bg-slate-900 border-l border-white/10 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">New Journal Entry</div>
          <button onClick={onClose} className="text-white/60">×</button>
        </div>
        <div className="text-xs text-white/50 mb-3">
          Range: {context?.from} → {context?.to} • {context?.symbol || 'All symbols'}
        </div>
        <textarea className="w-full h-36 bg-white/5 border border-white/10 rounded-lg p-2" placeholder="What happened? Setup, context, emotion, rule compliance..." />
        <div className="mt-3">
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2" placeholder="Tags: consistency, news, revenge-trade" />
        </div>
        <button className="mt-4 w-full px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500">Save & Tag</button>
        <div className="mt-4 text-xs text-white/50">
          Suggestions: <button className="underline">Generate pattern ideas</button>
        </div>
      </aside>
    </div>
  );
}


