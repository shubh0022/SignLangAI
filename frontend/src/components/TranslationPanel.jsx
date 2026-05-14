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
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = langCode
    utter.rate = 0.9
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  const hasResult = prediction?.gesture && prediction.gesture !== 'Waiting...'

  return (
    <div className="glass-strong rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Languages size={16} className="text-cyan-400" />
          Translation Output
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-600 hover:text-gray-400'}`}
          title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
        >
          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Language tabs */}
      <div className="flex border-b border-white/5">
        {Object.entries(LANG_META).map(([code, meta]) => (
          <button
            key={code}
            onClick={() => setActiveLang(code)}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              activeLang === code
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                : 'text-gray-500 hover:text-gray-300'
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
          <p className="text-xs text-gray-500 mb-1">Detected Gesture</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={prediction?.gesture}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-2xl font-black text-gradient-cyan"
            >
              {prediction?.gesture || 'Waiting...'}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Confidence bar */}
        {hasResult && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Confidence</span>
              <span className="text-green-400 font-mono">{((prediction?.confidence || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
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
                    ? 'bg-cyan-400/10 border-cyan-400/30 shadow-lg shadow-cyan-400/5'
                    : 'bg-white/3 border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{meta.flag} {meta.label}</div>
                  <div className={`text-lg font-bold ${isActive ? 'text-white' : 'text-gray-300'} ${code !== 'en' ? 'lang-' + code : ''}`}>
                    {text}
                  </div>
                </div>
                {voiceEnabled && (
                  <Volume2
                    size={16}
                    className={`${isActive ? 'text-cyan-400' : 'text-gray-600'} ${speaking && isActive ? 'animate-pulse' : ''}`}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {hasResult && (
          <p className="text-xs text-gray-600 text-center mt-4">
            Click a language card to hear the translation
          </p>
        )}
      </div>
    </div>
  )
}
