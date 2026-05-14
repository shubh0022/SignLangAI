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
    <div className="glass-strong rounded-2xl border border-white/5 flex flex-col max-h-[520px]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <History size={16} className="text-purple-400" />
          Session Log
          {history.length > 0 && (
            <span className="ml-1 text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{history.length}</span>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={exportLogs} title="Export" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <Download size={14} />
          </button>
          <button onClick={clearRemote} title="Clear" className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto p-3 space-y-2 flex-1">
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <History size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No gestures logged yet</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((log, i) => (
              <motion.div
                key={`${log.time}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white truncate">{log.gesture}</div>
                  <div className="text-xs text-gray-500 mt-0.5 font-mono">{log.time}</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-sm font-bold text-green-400">{((log.confidence || 0) * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-600 truncate max-w-[80px]">{log.hi}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
