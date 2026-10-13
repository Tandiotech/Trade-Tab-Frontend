export default function CommandPalette({open, onClose}:{open:boolean; onClose:()=>void}) {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="max-w-xl mx-auto mt-24 bg-slate-900 border border-white/10 rounded-xl p-3">
        <input autoFocus placeholder="Search or type a command…" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        <div className="mt-2 text-sm text-white/60">Try: “add note”, “switch to volume”, “open calculator”, “journal last week”</div>
      </div>
    </div>
  );
}


