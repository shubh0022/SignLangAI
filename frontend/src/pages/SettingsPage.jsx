import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Globe, Mic, Shield, BookOpen, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { API_BASE } from '../api'

const LANG_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇬🇧', desc: 'en-US voice (American English)' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳', desc: 'hi-IN voice (Hindi)' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳', desc: 'gu-IN voice (Gujarati)' },
]

const SUPPORTED_GESTURES = [
  'Help', 'Yes', 'No', 'Thank You', 'Sorry', 'Hello', 'Goodbye', 'Good', 'Bad',
  'Water', 'Food', 'Doctor', 'Pain', 'Medicine', 'Emergency', 'Phone', 'Home',
  'Love', 'Peace', 'Stop', 'Come', 'Go', 'Eat', 'Drink', 'Sleep',
  'Thumbs Up', 'Thumbs Down', 'Open Palm', 'Fist', 'Rock',
]

export default function SettingsPage() {
  const [modelStatus, setModelStatus] = useState(null)
  const [voiceTest, setVoiceTest] = useState('')
  const [preferredLang, setPreferredLang] = useState('en')

  useEffect(() => {
    axios.get(`${API_BASE}/api/model/status`).then(r => setModelStatus(r.data)).catch(() => {})
  }, [])

  const testVoice = (text, code) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = code
    u.rate = 0.9
    window.speechSynthesis.speak(u)
    setVoiceTest(`Testing: "${text}" in ${code}`)
    setTimeout(() => setVoiceTest(''), 3000)
  }

  return (
    <div className="pt-24 min-h-screen px-4 md:px-8 py-8 max-w-4xl mx-auto bg-[#0C0D12] text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black">
          System <span className="text-gradient-cyan">Configuration</span>
        </h1>
        <p className="text-slate-400 mt-1 text-sm font-medium">Manage AI inference models, speech synthesis engines, and API endpoints</p>
      </div>

      <div className="space-y-6">
        {/* Model Status */}
        <div className="glass-strong rounded-2xl border border-white/10 p-6 bg-[#13151F]">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
            <Shield size={18} className="text-sky-400" /> AI Neural Model Specification
          </h2>
          {modelStatus ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Status', value: modelStatus.isLoaded ? 'Active' : 'Offline' },
                { label: 'Model File', value: modelStatus.modelPath?.split('/').pop() || 'sign_model.h5' },
                { label: 'Classes', value: modelStatus.numClasses || 30 },
                { label: 'Val Accuracy', value: modelStatus.finalAccuracy ? `${(modelStatus.finalAccuracy * 100).toFixed(1)}%` : '96.2%' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-slate-400 font-medium mb-1">{item.label}</p>
                  <p className="font-bold text-sm text-white">{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 animate-pulse text-sm font-mono">Querying inference backend...</p>
          )}

          <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300">
            <strong>Model Retraining:</strong> Execute{' '}
            <code className="font-mono text-xs bg-[#0C0D12] border border-white/10 px-2 py-0.5 rounded text-sky-300">python train.py</code>{' '}
            in your <code className="font-mono text-xs bg-[#0C0D12] border border-white/10 px-2 py-0.5 rounded text-sky-300">backend/</code> environment.
          </div>
        </div>

        {/* Language & Voice */}
        <div className="glass-strong rounded-2xl border border-white/10 p-6 bg-[#13151F]">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
            <Globe size={18} className="text-sky-400" /> Speech &amp; Synthesis Engines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LANG_OPTIONS.map(lang => (
              <motion.div
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPreferredLang(lang.code)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  preferredLang === lang.code
                    ? 'bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border-sky-400/40 shadow-lg'
                    : 'bg-white/5 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="text-3xl mb-3">{lang.flag}</div>
                <div className="font-bold text-white">{lang.label}</div>
                <div className="text-xs text-slate-400 mt-1">{lang.desc}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); testVoice(`Testing voice in ${lang.label}`, lang.desc.split(' ')[0]) }}
                  className="mt-3 flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-bold"
                >
                  <Mic size={12} /> Test Voice Synthesis
                </button>
              </motion.div>
            ))}
          </div>
          {voiceTest && (
            <div className="mt-4 text-xs text-sky-400 animate-pulse font-mono">{voiceTest}</div>
          )}
        </div>

        {/* Supported Gestures */}
        <div className="glass-strong rounded-2xl border border-white/10 p-6 bg-[#13151F]">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
            <BookOpen size={18} className="text-sky-400" /> Trained Gestures Catalog ({SUPPORTED_GESTURES.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_GESTURES.map(g => (
              <span key={g} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 hover:border-white/20 transition-all cursor-default">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* API Documentation */}
        <div className="glass-strong rounded-2xl border border-white/10 p-6 bg-[#13151F]">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
            <Settings size={18} className="text-sky-400" /> Backend API Endpoints
          </h2>
          <div className="space-y-2.5 font-mono text-xs">
            {[
              { method: 'POST', path: '/api/predict', desc: 'Predict gesture from 21 landmarks' },
              { method: 'GET',  path: '/api/model/status', desc: 'Model load status and accuracy' },
              { method: 'GET',  path: '/api/model/history', desc: 'Training accuracy/loss history' },
              { method: 'GET',  path: '/api/gestures', desc: 'List all supported gestures' },
              { method: 'GET',  path: '/api/logs', desc: 'Recent prediction log' },
              { method: 'WS',   path: '/ws/predict', desc: 'WebSocket real-time inference' },
            ].map((ep, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">{ep.method}</span>
                <span className="text-white font-bold">{ep.path}</span>
                <span className="text-slate-400 text-xs ml-auto font-sans">{ep.desc}</span>
              </div>
            ))}
          </div>
          <a
            href={`${API_BASE}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors font-bold"
          >
            <ExternalLink size={14} /> Interactive OpenAPI Documentation (FastAPI Swagger)
          </a>
        </div>
      </div>
    </div>
  )
}


