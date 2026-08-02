import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Languages } from 'lucide-react'
import { useState } from 'react'

const LANG_META = {
  en: { label: 'English',  flag: '🇬🇧', code: 'en-US' },
  hi: { label: 'हिंदी',   flag: '🇮🇳', code: 'hi-IN' },
  gu: { label: 'ગુજરાતી', flag: '🇮🇳', code: 'gu-IN' },
}

export default function TranslationPanel({ prediction, activeLang, setActiveLang }) {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)

  const speak = (text, langCode) => {
    if (!voiceEnabled || !text || text === 'Waiting...' || !window.speechSynthesis) return
    try {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = langCode
      utter.rate = 0.9
      utter.onstart = () => setSpeaking(true)
      utter.onend = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utter)
    } catch (_) {
      setSpeaking(false)
    }
  }


  const hasResult = prediction?.gesture && prediction.gesture !== 'Waiting...'

  return (
    <div className="glass-strong rounded-2xl border border-white/10 overflow-hidden bg-[#13151F] text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Languages size={18} className="text-sky-400" />
          Neural Translation Matrix
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-xl transition-all ${voiceEnabled ? 'text-sky-300 bg-sky-500/10 border border-sky-500/30' : 'text-slate-500 hover:text-white'}`}
          title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
        >
          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Language tabs */}
      <div className="flex border-b border-white/10 bg-black/20">
        {Object.entries(LANG_META).map(([code, meta]) => (
          <button
            key={code}
            onClick={() => setActiveLang(code)}
            className={`flex-1 py-3 text-xs font-semibold transition-all ${
              activeLang === code
                ? 'text-white border-b-2 border-sky-400 bg-white/5 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {meta.flag} {meta.label}
          </button>
        ))}
      </div>

      {/* Main translation display */}
      <div className="p-6">
        {/* Gesture name */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Detected Gesture</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={prediction?.gesture}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-3xl font-extrabold text-white"
            >
              {prediction?.gesture || 'Waiting for hand...'}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Confidence bar */}
        {hasResult && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
              <span>Model Confidence</span>
              <span className="text-sky-400 font-bold">{((prediction?.confidence || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="confidence-bar h-full"
                initial={{ width: 0 }}
                animate={{ width: `${(prediction?.confidence || 0) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        {/* Translation cards */}
        <div className="space-y-3">
          {Object.entries(LANG_META).map(([code, meta]) => {
            const text = prediction?.[code] || '—'
            const isActive = activeLang === code
            return (
              <motion.div
                key={code}
                whileHover={{ scale: 1.01 }}
                onClick={() => speak(text, meta.code)}
                className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border-sky-400/40 shadow-lg'
                    : 'bg-white/5 border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">{meta.flag} {meta.label}</div>
                  <div className={`text-xl font-bold ${isActive ? 'text-white' : 'text-slate-300'} ${code !== 'en' ? 'lang-' + code : ''}`}>
                    {text}
                  </div>
                </div>
                {voiceEnabled && (
                  <Volume2
                    size={18}
                    className={`${isActive ? 'text-sky-400' : 'text-slate-500'} ${speaking && isActive ? 'animate-pulse' : ''}`}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {hasResult && (
          <p className="text-xs text-slate-500 text-center mt-4 font-mono">
            Click any translation card to synthesize speech
          </p>
        )}
      </div>
    </div>
  )
}


