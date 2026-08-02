import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Camera, BarChart3, Languages, Mic, Shield, Zap, ArrowRight, Users, Star, Globe, Sparkles } from 'lucide-react'
import Logo from '../components/Logo'

const FEATURES = [
  {
    icon: <Camera className="w-6 h-6 text-sky-400" />,
    title: 'Real-Time Neural Vision',
    desc: 'MediaPipe-powered 21-point hand landmark tracking running at 30+ FPS with sub-millisecond local WASM execution.',
  },
  {
    icon: <Languages className="w-6 h-6 text-indigo-400" />,
    title: 'Multilingual Synthesis',
    desc: 'Instant gesture-to-text translation in English, Hindi (हिंदी), and Gujarati (ગુજરાતી).',
  },
  {
    icon: <Mic className="w-6 h-6 text-emerald-400" />,
    title: 'Adaptive Speech Engine',
    desc: 'Synthesizes natural voice audio output instantly in your target language using Web Speech API.',
  },
  {
    icon: <Zap className="w-6 h-6 text-[#38BDF8]" />,
    title: 'Deep Learning Model',
    desc: 'TensorFlow/Keras CNN trained on 30 gesture classes with 95%+ target recognition accuracy.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
    title: 'Live Metrics & Telemetry',
    desc: 'Real-time accuracy analytics, gesture frequency distributions, and session logs.',
  },
  {
    icon: <Shield className="w-6 h-6 text-rose-400" />,
    title: 'Accessibility First',
    desc: 'Built specifically for speech and hearing-impaired communities. Emergency & clinical ready.',
  },
]

const STATS = [
  { value: '30+', label: 'Gestures Recognized', icon: <Star size={14} /> },
  { value: '3', label: 'Languages Supported', icon: <Globe size={14} /> },
  { value: '30fps', label: 'Zero-Latency Speed', icon: <Zap size={14} /> },
  { value: '95%+', label: 'Model Accuracy', icon: <Users size={14} /> },
]

const GESTURES_DEMO = [
  { gesture: 'Help',   en: 'Help',       hi: 'मदद करो',   gu: 'મદદ કરો' },
  { gesture: '✌ Peace', en: 'Peace',     hi: 'शांति',     gu: 'શાંતિ' },
  { gesture: 'Thank You',en:'Thank You', hi: 'धन्यवाद',   gu: 'આભાર' },
  { gesture: 'Water',  en: 'Water',      hi: 'पानी',       gu: 'પાણી' },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-[#0C0D12] text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_center,rgba(56,189,248,0.06)_0%,transparent_65%)] pointer-events-none" />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-28 pb-16 px-6">
        {/* Branding Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="mb-6 filter drop-shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        >
          <Logo size={76} showText={false} />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-semibold text-sky-300 border border-white/10 mb-8 shadow-sm bg-white/5"
        >
          <Sparkles size={14} className="text-sky-400" />
          AI Neural Accessibility Platform • 2026 Edition
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black leading-[1.08] tracking-tight max-w-4xl"
        >
          Universal Communication{' '}
          <span className="text-gradient-cyan">Without Barriers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal"
        >
          Real-time neural sign language recognition delivering instant translation into{' '}
          <span className="text-white font-semibold">English</span>,{' '}
          <span className="text-white font-semibold">Hindi (हिंदी)</span>, and{' '}
          <span className="text-white font-semibold">Gujarati (ગુજરાતી)</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <NavLink
            to="/detect"
            className="flex items-center gap-2.5 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-[0_4px_25px_rgba(255,255,255,0.15)] text-base"
          >
            <Camera size={20} />
            Launch Neural Vision
            <ArrowRight size={18} />
          </NavLink>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 px-8 py-4 glass text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-base border border-white/10"
          >
            <BarChart3 size={20} />
            View Telemetry
          </NavLink>

        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="glass-strong rounded-2xl p-4 border border-white/10 text-center card-hover bg-[#13151F]">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-medium mb-1.5">
                {stat.icon} {stat.label}
              </div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── LIVE TRANSLATION DEMO ── */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0C0D12]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black"
            >
              Multilingual <span className="text-gradient-cyan">Synthesis Matrix</span>
            </motion.h2>
            <p className="text-slate-400 mt-3 text-lg">Every gesture translated instantly across three language engines</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GESTURES_DEMO.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className="glass-strong rounded-2xl p-6 border border-white/10 card-hover bg-[#13151F]"
              >
                <div className="text-4xl mb-4 text-center">{item.gesture.length <= 5 ? item.gesture : '✋'}</div>
                <div className="text-center mb-4">
                  <span className="text-xs font-mono text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">{item.gesture}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">EN</span>
                    <span className="text-white font-semibold">{item.en}</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">HI</span>
                    <span className="text-white font-semibold lang-hi">{item.hi}</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">GU</span>
                    <span className="text-white font-semibold lang-gu">{item.gu}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0C0D12]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black"
            >
              Engineered for <span className="text-gradient-cyan">Human Impact</span>
            </motion.h2>
            <p className="text-slate-400 mt-3 text-lg max-w-xl mx-auto">
              Production-ready architecture designed for healthcare, education, and daily conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-strong rounded-2xl p-6 border border-white/10 card-hover group bg-[#13151F]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative glass-strong rounded-3xl p-12 text-center border border-white/10 overflow-hidden bg-[#13151F]"
          >
            <div className="relative">
              <h2 className="text-4xl font-black mb-4 text-white">
                Experience Instant <span className="text-gradient-cyan">Recognition</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                No app installation required. Activate your camera and start signing natively in browser.
              </p>
              <NavLink
                to="/detect"
                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-[0_4px_30px_rgba(255,255,255,0.2)] hover:bg-slate-100 transition-all text-lg"
              >
                <Camera size={22} />
                Open Live Detection
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 bg-[#0C0D12] mt-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-10">
          
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-white/10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Logo size={42} showText={true} />
              <p className="text-slate-400 text-sm max-w-md text-center md:text-left leading-relaxed font-normal">
                Designing technology to make communication universal. SignLangAI empowers human connection by translating sign language gestures into real-time speech and text.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Accessibility Mandate</span>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                Accessibility is a fundamental human right. Built to serve hearing and speech-impaired communities globally.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <p>Copyright © 2026 SignLangAI Inc. All rights reserved.</p>
              <span className="hidden md:inline text-slate-400/30">|</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
              </div>
            </div>
            <div className="text-slate-400 font-mono">
              2026 Modern Pro Design System
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}


