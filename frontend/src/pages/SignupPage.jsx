import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Mail, Lock, ArrowRight, User } from 'lucide-react'
import Logo from '../components/Logo'


export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-16">
      {/* Background elements */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong p-8 md:p-10 rounded-3xl border border-white/10 w-full max-w-md relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Logo size={64} showText={false} />
          </div>
          <h2 className="text-3xl font-black mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join SignLangAI to access premium features</p>
        </div>

        <form className="space-y-5" onSubmit={e => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Jane Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all mt-4"
          >
            Sign Up <ArrowRight size={18} />
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{' '}
          <NavLink to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Sign in
          </NavLink>
        </p>
      </motion.div>
    </div>
  )
}
