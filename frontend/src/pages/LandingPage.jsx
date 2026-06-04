import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Camera, BarChart3, Languages, Mic, Shield, Zap, ArrowRight, Users, Star, Globe } from 'lucide-react'
import Logo from '../components/Logo'


const FEATURES = [
  {
    icon: <Camera className="w-6 h-6" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    title: 'Real-Time Detection',
    desc: 'MediaPipe-powered 21-point hand landmark detection at 30+ FPS with multi-hand tracking.',
  },
  {
    icon: <Languages className="w-6 h-6" />,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    title: 'Multilingual Translation',
    desc: 'Instant gesture-to-text translation in English, Hindi (हिंदी), and Gujarati (ગુજરાતી).',
  },
  {
    icon: <Mic className="w-6 h-6" />,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    title: 'Voice Output',
    desc: 'Speak translations aloud in your preferred language using the Web Speech API.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    title: 'Deep Learning AI',
    desc: 'TensorFlow/Keras CNN trained on 30 gesture classes with 95%+ target accuracy.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    title: 'Live Analytics',
    desc: 'Real-time accuracy charts, gesture frequency heatmaps, and full prediction history.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    title: 'Accessibility First',
    desc: 'Built for speech-impaired and hearing-impaired users. Hospital & emergency ready.',
  },
]

const STATS = [
  { value: '30+', label: 'Gestures Supported', icon: <Star size={16} /> },
  { value: '3', label: 'Languages', icon: <Globe size={16} /> },
  { value: '30fps', label: 'Real-Time Speed', icon: <Zap size={16} /> },
  { value: '95%+', label: 'Target Accuracy', icon: <Users size={16} /> },
]

const GESTURES_DEMO = [
  { gesture: 'Help',   en: 'Help',       hi: 'मदद करो',   gu: 'મદદ કરો',  color: 'border-red-500/40 bg-red-500/5' },
  { gesture: '✌ Peace', en: 'Peace',     hi: 'शांति',     gu: 'શાંતિ',    color: 'border-blue-500/40 bg-blue-500/5' },
  { gesture: 'Thank You',en:'Thank You', hi: 'धन्यवाद',   gu: 'આભાર',     color: 'border-green-500/40 bg-green-500/5' },
  { gesture: 'Water',  en: 'Water',      hi: 'पानी',       gu: 'પાણી',    color: 'border-cyan-500/40 bg-cyan-500/5' },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Glow blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-400/8 rounded-full blur-[100px] pointer-events-none" />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-16 px-6">
        {/* Branding Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="mb-6 filter drop-shadow-[0_0_25px_rgba(34,211,238,0.25)]"
        >
          <Logo size={80} showText={false} />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-cyan-400 border border-cyan-400/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          AI Accessibility Technology · Production Ready
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl"
        >
          Break Communication{' '}
          <span className="text-gradient-cyan">Barriers</span>
          {' '}with{' '}
          <span className="text-gradient-purple">AI Sign Language</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
        >
          Real-time hand gesture & sign language recognition with instant multilingual translation
          into <span className="text-white">English</span>,{' '}
          <span className="text-white">Hindi (हिंदी)</span>, and{' '}
          <span className="text-white">Gujarati (ગુજરાતી)</span>.
          Empowering speech-impaired individuals worldwide.
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
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/30 text-base"
          >
            <Camera size={20} />
            Launch Live Detection
            <ArrowRight size={18} />
          </NavLink>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-base border border-white/10"
          >
            <BarChart3 size={20} />
            View Analytics
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
            <div key={i} className="glass rounded-2xl p-4 border border-white/5 text-center card-hover">
              <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs mb-2">
                {stat.icon} {stat.label}
              </div>
              <div className="text-3xl font-black text-gradient-cyan">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── LIVE TRANSLATION DEMO ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black"
            >
              See the <span className="text-gradient-cyan">Translation</span> in Action
            </motion.h2>
            <p className="text-gray-400 mt-4 text-lg">Every gesture detected → instantly translated into 3 languages</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GESTURES_DEMO.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`glass-strong rounded-2xl p-6 border ${item.color} card-hover`}
              >
                <div className="text-4xl mb-4 text-center">{item.gesture.length <= 5 ? item.gesture : '✋'}</div>
                <div className="text-center mb-4">
                  <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded-md">{item.gesture}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">🇬🇧 EN</span>
                    <span className="text-white font-semibold">{item.en}</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">🇮🇳 HI</span>
                    <span className="text-white font-semibold lang-hi">{item.hi}</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">🇮🇳 GU</span>
                    <span className="text-white font-semibold lang-gu">{item.gu}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black"
            >
              Built for <span className="text-gradient-purple">Real Accessibility</span>
            </motion.h2>
            <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
              Production-grade AI platform designed for hospitals, schools, and everyday communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-strong rounded-2xl p-6 border border-white/5 card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center ${f.color} mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
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
            className="relative glass-strong rounded-3xl p-12 text-center border border-cyan-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="relative">
              <h2 className="text-4xl font-black mb-4">
                Start <span className="text-gradient-cyan">Communicating</span> Today
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                No setup required. Open your webcam and start signing. AI does the rest.
              </p>
              <NavLink
                to="/detect"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/30 hover:opacity-90 transition-all text-lg"
              >
                <Camera size={22} />
                Open Live Detection
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-black/10 dark:bg-black/20 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-10">
          
          {/* Top section: Brand & Statement */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-white/5">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Logo size={42} showText={true} />
              <p className="text-gray-400 text-sm max-w-md text-center md:text-left leading-relaxed font-normal">
                Designing technology to make communication universal. SignLangAI empowers human connection by translating sign language gestures into real-time speech and text.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Accessibility Value</span>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Accessibility is a human right. Built to serve and connect hearing and speech-impaired communities globally.
              </p>
            </div>
          </div>

          {/* Bottom section: Copyright and Links */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <p>Copyright © 2026 SignLangAI Inc. All rights reserved.</p>
              <span className="hidden md:inline text-gray-700">|</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Legal & Regulatory</a>
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-500">
              Designed in California · Built for everyone
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}
