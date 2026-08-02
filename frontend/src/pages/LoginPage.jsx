import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-16 bg-[#0C0D12] text-white">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong p-8 md:p-10 rounded-3xl border border-white/10 w-full max-w-md relative z-10 shadow-2xl bg-[#13151F]"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Logo size={64} showText={false} />
          </div>
          <h2 className="text-3xl font-black mb-2 text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm font-medium">Sign in to your SignLangAI portal</p>
        </div>

        <form className="space-y-5" onSubmit={e => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-slate-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-sky-400 hover:underline font-medium">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-slate-500 text-sm font-medium"
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:bg-slate-100 transition-all mt-4 text-sm"
          >
            Sign In <ArrowRight size={18} />
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8 font-medium">
          Don't have an account?{' '}
          <NavLink to="/signup" className="text-sky-400 font-bold hover:underline transition-colors">
            Create Account
          </NavLink>
        </p>
      </motion.div>
    </div>
  )
}


