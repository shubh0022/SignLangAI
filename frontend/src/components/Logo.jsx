import React from 'react'

export default function Logo({ size = 32, showText = true, className = '' }) {
  // We compute dimensions based on size.
  // Standard aspect ratio for full logo is 320:80 = 4:1.
  // Standard aspect ratio for icon only is 80:80 = 1:1.
  const width = showText ? size * 4 : size
  const height = size

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height }}>
      <svg
        viewBox={showText ? "0 0 320 80" : "0 0 80 80"}
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Main Gradient for Hand and Text Brand Mark */}
          <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
            <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
          </linearGradient>

          {/* Autofocus Brackets Gradient */}
          <linearGradient id="bracket-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
            <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
          </linearGradient>

          {/* Mask to cut out the 4-point star/diamond negative space in the hand gesture */}
          <mask id="hand-star-mask">
            {/* White background: keep everything */}
            <rect x="0" y="0" width="80" height="80" fill="#ffffff" />
            {/* Black star: cut out the star shape at the center of the gesture loop (58, 52) */}
            <path
              d="M 58,45 C 58,52 58,52 51,52 C 58,52 58,52 58,59 C 58,52 58,52 65,52 C 58,52 58,52 58,45 Z"
              fill="#000000"
            />
          </mask>
        </defs>

        {/* ========================================================= */}
        {/* ICON COMPONENT (Left Profile Head + Brackets + Hand)      */}
        {/* ========================================================= */}
        <g id="logo-icon">
          {/* Tech Profile Face Outline (Facing Right) */}
          <path
            d="M 14,24 
               C 21,24 23,28 22,33 
               C 21.3,36.5 23.5,39 25.5,40 
               C 27.5,41 25.5,43 24,44 
               C 25,45.2 24.5,46.8 23,47.2 
               C 24,48.5 23.5,50 22,50.5 
               C 23,52 23,54.5 21,56 
               C 17.5,58.5 15,61 15,66"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-slate-400/40 dark:text-slate-500/40"
          />

          {/* Brain Circuit Connections inside Head */}
          <path
            d="M 8,28 H 15 L 18,31"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-slate-400/25 dark:text-slate-500/25"
          />
          <circle cx="18" cy="31" r="1.2" fill="currentColor" className="text-slate-400/40 dark:text-slate-500/40" />

          <path
            d="M 6,39 H 14 L 17,42"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-slate-400/25 dark:text-slate-500/25"
          />
          <circle cx="17" cy="42" r="1.2" fill="currentColor" className="text-slate-400/40 dark:text-slate-500/40" />

          <path
            d="M 7,50 H 13 L 15,48"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-slate-400/25 dark:text-slate-500/25"
          />
          <circle cx="15" cy="48" r="1.2" fill="currentColor" className="text-slate-400/40 dark:text-slate-500/40" />

          {/* Camera Autofocus Brackets [ ] */}
          <g stroke="url(#bracket-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
            {/* Top-Left Bracket */}
            <path d="M 36,33 V 24 H 45" />
            {/* Bottom-Left Bracket */}
            <path d="M 36,51 V 60 H 45" />
            {/* Top-Right Bracket */}
            <path d="M 72,33 V 24 H 63" />
            {/* Bottom-Right Bracket */}
            <path d="M 72,51 V 60 H 63" />
          </g>

          {/* OK Hand Gesture with Star/Diamond Negative Space Cutout */}
          <path
            d="M 43,65 
               C 42,60 41,51 41,47 
               L 41,31 
               C 41,29 44,29 44,31 
               L 44,45 
               M 44,45
               L 47,24 
               C 47,22 50,22 50,24 
               L 50,43 
               M 50,43
               L 53,19 
               C 53,17 56,17 56,19 
               L 56,43 
               C 58,41 62,41 65,43 
               C 68,46 70,50 70,54 
               C 70,59 66,63 60,63 
               C 55,63 50,60 47,65 
               L 45,68"
            fill="url(#brand-grad)"
            mask="url(#hand-star-mask)"
          />
        </g>

        {/* ========================================================= */}
        {/* TEXT BRANDING COMPONENT ("SignLangAI" + Wavy Line)        */}
        {/* ========================================================= */}
        {showText && (
          <g id="logo-text">
            {/* Typography */}
            <text
              x="84"
              y="47"
              fontFamily="Inter, system-ui, -apple-system, sans-serif"
              fontSize="28"
              fontWeight="700"
              letterSpacing="-0.03em"
            >
              <tspan fill="currentColor" className="text-slate-800 dark:text-white">SignLang</tspan>
              <tspan fill="url(#brand-grad)" fontWeight="900">AI</tspan>
            </text>

            {/* Glowing Double-Helix / Signal Waves under Text */}
            <path
              d="M 85,58 Q 110,50 135,58 T 185,58 T 235,58 T 285,58"
              fill="none"
              stroke="url(#brand-grad)"
              strokeWidth="1.5"
              strokeDasharray="1 6"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 95,62 Q 120,70 145,62 T 195,62 T 245,62 T 295,62"
              fill="none"
              stroke="url(#brand-grad)"
              strokeWidth="1"
              strokeDasharray="1 8"
              strokeLinecap="round"
              opacity="0.45"
            />
          </g>
        )}
      </svg>
    </div>
  )
}
