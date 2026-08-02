import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, AlertCircle, Sparkles } from 'lucide-react'
import WebcamCapture from '../components/WebcamCapture'
import TranslationPanel from '../components/TranslationPanel'
import GestureHistory from '../components/GestureHistory'

const INITIAL_PRED = { gesture: 'Waiting...', confidence: 0, en: '—', hi: '—', gu: '—' }

export default function LiveDetection() {
  const [isRunning, setIsRunning] = useState(false)
  const [prediction, setPrediction] = useState(INITIAL_PRED)
  const [history, setHistory] = useState([])
  const [activeLang, setActiveLang] = useState('en')

  const handlePrediction = useCallback((data) => {
    setPrediction(data)
    setHistory(prev => {
      const entry = { ...data, time: new Date().toLocaleTimeString() }
      return [entry, ...prev].slice(0, 100)
    })
  }, [])

  const toggleRun = () => {
    if (!isRunning) {
      setIsRunning(true)
    } else {
      setIsRunning(false)
      setPrediction(INITIAL_PRED)
    }
  }

  return (
    <div className="pt-24 min-h-screen px-4 md:px-8 py-8 max-w-[1600px] mx-auto bg-[#0C0D12] text-white">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-300 mb-3">
            <Sparkles size={12} /> NEURAL VISION INTERFACE
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Real-Time <span className="text-gradient-cyan">Gesture Recognition</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Position your hand in frame to execute instant multilingual synthesis</p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={toggleRun}
            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isRunning
                ? 'border border-rose-500/40 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                : 'bg-white text-slate-900 hover:bg-slate-100 shadow-[0_4px_25px_rgba(255,255,255,0.15)]'
            }`}
          >
            {isRunning
              ? <><Square size={16} fill="currentColor" /> Terminate Session</>
              : <><Play size={16} fill="currentColor" /> Initialize Vision</>
            }
          </motion.button>
        </div>
      </div>

      {/* Tip banner */}
      {!isRunning && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 glass-strong border border-white/10 rounded-2xl p-4 mb-8 text-sm text-slate-300 bg-[#13151F]"
        >
          <AlertCircle size={18} className="text-sky-400 shrink-0" />
          <span>
            <strong>Camera Authorization</strong>: Grant camera permissions when prompted. Landmark tracking executes locally via WASM for zero latency.
          </span>
        </motion.div>
      )}

      {/* Main 3-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Webcam — 7 cols */}
        <div className="xl:col-span-7 space-y-4">
          <WebcamCapture onPrediction={handlePrediction} isRunning={isRunning} />

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Session Logs', value: history.length },
              { label: 'Model Confidence', value: `${((prediction.confidence || 0) * 100).toFixed(0)}%` },
              { label: 'Active Language', value: activeLang.toUpperCase() },
            ].map((s, i) => (
              <div key={i} className="glass-strong rounded-2xl p-4 border border-white/10 text-center bg-[#13151F]">
                <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Translation panel — 3 cols */}
        <div className="xl:col-span-3">
          <TranslationPanel
            prediction={prediction}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
          />
        </div>

        {/* History — 2 cols */}
        <div className="xl:col-span-2">
          <GestureHistory
            history={history}
            onClear={() => setHistory([])}
          />
        </div>
      </div>
    </div>
  )
}


