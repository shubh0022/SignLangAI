import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Mail, Lock, ArrowRight, User } from 'lucide-react'
import Logo from '../components/Logo'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-16 bg-[#0C0D12] text-white">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

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
          <h2 className="text-3xl font-black mb-2 text-white">Create Account</h2>
          <p className="text-slate-400 text-sm font-medium">Join SignLangAI to access real-time neural vision</p>
        </div>

        <form className="space-y-5" onSubmit={e => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Jane Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-slate-500 text-sm font-medium"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Password</label>
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
            Create Account <ArrowRight size={18} />
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8 font-medium">
          Already have an account?{' '}
          <NavLink to="/login" className="text-sky-400 font-bold hover:underline transition-colors">
            Sign in
          </NavLink>
        </p>
      </motion.div>
    </div>
  )
}


