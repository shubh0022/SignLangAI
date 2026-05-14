import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Globe, Mic, Shield, BookOpen, ExternalLink } from 'lucide-react'
import axios from 'axios'

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
    axios.get('/api/model/status').then(r => setModelStatus(r.data)).catch(() => {})
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
    <div className="pt-20 min-h-screen px-4 md:px-8 py-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black">
          Settings &amp; <span className="text-gradient-cyan">Configuration</span>
        </h1>
        <p className="text-gray-400 mt-1">Manage AI model, language preferences, and system configuration</p>
      </div>

      <div className="space-y-6">
        {/* Model Status */}
        <div className="glass-strong rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Shield size={18} className="text-cyan-400" /> AI Model Configuration
          </h2>
          {modelStatus ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Status', value: modelStatus.isLoaded ? '✅ Loaded' : '❌ Not Loaded', color: modelStatus.isLoaded ? 'text-green-400' : 'text-red-400' },
                { label: 'Model File', value: modelStatus.modelPath?.split('/').pop() || '—', color: 'text-white' },
                { label: 'Classes', value: modelStatus.numClasses || 30, color: 'text-cyan-400' },
                { label: 'Val Accuracy', value: modelStatus.finalAccuracy ? `${(modelStatus.finalAccuracy * 100).toFixed(1)}%` : '—', color: 'text-green-400' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/3 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 animate-pulse text-sm">Connecting to backend...</p>
          )}

          <div className="mt-5 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm text-amber-300">
            <strong>To retrain the model:</strong> Run{' '}
            <code className="font-mono text-xs bg-black/40 px-2 py-0.5 rounded">python train.py</code>{' '}
            in the <code className="font-mono text-xs bg-black/40 px-2 py-0.5 rounded">backend/</code> directory.
            The model trains on synthetic data by default — replace with real ISL/ASL datasets for production accuracy.
          </div>
        </div>

        {/* Language & Voice */}
        <div className="glass-strong rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Globe size={18} className="text-blue-400" /> Language &amp; Voice Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LANG_OPTIONS.map(lang => (
              <motion.div
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPreferredLang(lang.code)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  preferredLang === lang.code
                    ? 'bg-cyan-400/10 border-cyan-400/40'
                    : 'bg-white/3 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="text-3xl mb-3">{lang.flag}</div>
                <div className="font-bold text-white">{lang.label}</div>
                <div className="text-xs text-gray-500 mt-1">{lang.desc}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); testVoice(`Hello, this is a test in ${lang.label}`, lang.desc.split(' ')[0]) }}
                  className="mt-3 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Mic size={12} /> Test Voice
                </button>
              </motion.div>
            ))}
          </div>
          {voiceTest && (
            <div className="mt-4 text-xs text-cyan-400 animate-pulse">{voiceTest}</div>
          )}
        </div>

        {/* Supported Gestures */}
        <div className="glass-strong rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <BookOpen size={18} className="text-purple-400" /> Supported Gestures ({SUPPORTED_GESTURES.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_GESTURES.map(g => (
              <span key={g} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-sm text-gray-300 hover:border-cyan-400/30 hover:text-white transition-all cursor-default">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* API Documentation */}
        <div className="glass-strong rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Settings size={18} className="text-green-400" /> API Endpoints
          </h2>
          <div className="space-y-3 font-mono text-sm">
            {[
              { method: 'POST', path: '/api/predict', desc: 'Predict gesture from 21 landmarks' },
              { method: 'GET',  path: '/api/model/status', desc: 'Model load status and accuracy' },
              { method: 'GET',  path: '/api/model/history', desc: 'Training accuracy/loss history' },
              { method: 'GET',  path: '/api/gestures', desc: 'List all supported gestures' },
              { method: 'GET',  path: '/api/logs', desc: 'Recent prediction log' },
              { method: 'WS',   path: '/ws/predict', desc: 'WebSocket real-time inference' },
            ].map((ep, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  ep.method === 'POST' ? 'bg-blue-500/20 text-blue-400'
                  : ep.method === 'WS' ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-green-500/20 text-green-400'
                }`}>{ep.method}</span>
                <span className="text-cyan-300">{ep.path}</span>
                <span className="text-gray-500 text-xs ml-auto">{ep.desc}</span>
              </div>
            ))}
          </div>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={14} /> Open Interactive API Docs (FastAPI Swagger)
          </a>
        </div>
      </div>
    </div>
  )
}
