import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, AlertCircle } from 'lucide-react'
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
    <div className="pt-20 min-h-screen px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black">
            Live <span className="text-gradient-cyan">Gesture Detection</span>
          </h1>
          <p className="text-gray-400 mt-1">Show your hand to the camera — AI detects and translates instantly</p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={toggleRun}
            className={`flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-white text-sm transition-all shadow-lg ${
              isRunning
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 shadow-red-500/10'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 shadow-blue-500/30'
            }`}
          >
            {isRunning
              ? <><Square size={16} /> Stop Detection</>
              : <><Play size={16} /> Start Detection</>
            }
          </motion.button>
        </div>
      </div>

      {/* Tip banner */}
      {!isRunning && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 glass border border-amber-500/20 rounded-xl p-4 mb-6 text-sm text-amber-300"
        >
          <AlertCircle size={16} className="text-amber-400 shrink-0" />
          <span>
            <strong>Allow camera access</strong> when the browser asks. The model loads from CDN — first detection may take a few seconds.
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
              { label: 'Session Logs', value: history.length, color: 'text-cyan-400' },
              { label: 'Confidence', value: `${((prediction.confidence || 0) * 100).toFixed(0)}%`, color: 'text-green-400' },
              { label: 'Active Language', value: activeLang.toUpperCase(), color: 'text-purple-400' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/5 text-center">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
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
