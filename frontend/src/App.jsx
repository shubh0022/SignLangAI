import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Camera, BarChart3, Settings, Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LiveDetection from './pages/LiveDetection'
import Dashboard from './pages/Dashboard'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LiveClock from './components/LiveClock'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { Moon, Sun, UserCircle } from 'lucide-react'
import Logo from './components/Logo'


const NAV_ITEMS = [
  { to: '/',         icon: <Zap size={18} />,      label: 'Home',      exact: true },
  { to: '/detect',   icon: <Camera size={18} />,    label: 'Detect' },
  { to: '/dashboard',icon: <BarChart3 size={18} />, label: 'Analytics' },
  { to: '/settings', icon: <Settings size={18} />,  label: 'Settings' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isHome ? '' : 'glass border-b border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center group">
          <Logo size={34} showText={true} />
        </NavLink>

        {/* Live Clock (Hidden on very small screens) */}
        <div className="hidden lg:block ml-8 mr-auto">
          <LiveClock />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-white/10 text-cyan-400 border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 ml-4 pl-4 border-l border-white/10 dark:border-white/10 border-gray-200">
          <ThemeToggle />
          
          <NavLink 
            to="/login"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-cyan-500 transition-colors"
          >
            <UserCircle size={18} />
            Sign In
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-500">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-white/5 px-6 pb-4 space-y-1"
          >
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive ? 'bg-white/10 text-cyan-400' : 'text-gray-400 hover:text-white'}`
                }
              >
                {item.icon}{item.label}
              </NavLink>
            ))}
            <div className="pt-2 mt-2 border-t border-white/5">
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:text-cyan-500 transition-all"
              >
                <UserCircle size={18} /> Sign In
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors border border-gray-200 dark:border-white/5"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="h-full"
      >
        <Routes location={location}>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/detect"    element={<LiveDetection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings"  element={<SettingsPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/signup"    element={<SignupPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
    </ThemeProvider>
  )
}
