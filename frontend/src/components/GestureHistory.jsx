import { motion, AnimatePresence } from 'framer-motion'
import { History, Download, Trash2 } from 'lucide-react'
import axios from 'axios'
import { API_BASE } from '../api'

export default function GestureHistory({ history, onClear }) {
  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `signlangai-logs-${new Date().toISOString().slice(0,10)}.json`
    a.click()
  }

  const clearRemote = async () => {
    try { await axios.delete(`${API_BASE}/api/logs`) } catch (_) {}
    onClear()
  }

  return (
    <div className="glass-strong rounded-2xl border border-white/10 flex flex-col max-h-[520px] bg-[#13151F] text-white shadow-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <History size={18} className="text-sky-400" />
          Session History
          {history.length > 0 && (
            <span className="ml-1.5 text-xs text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20 font-mono">{history.length}</span>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={exportLogs} title="Export Logs" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <Download size={15} />
          </button>
          <button onClick={clearRemote} title="Clear Session" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto p-3 space-y-2 flex-1">
        {history.length === 0 ? (
          <div className="text-center py-14 text-slate-500">
            <History size={32} className="mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="text-sm font-medium">No gestures logged in current session</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((log, i) => (
              <motion.div
                key={`${log.time}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm text-white truncate">{log.gesture}</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">{log.time}</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-sm font-black text-sky-400">{((log.confidence || 0) * 100).toFixed(0)}%</div>
                  <div className="text-xs text-slate-400 truncate max-w-[80px]">{log.hi}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}


