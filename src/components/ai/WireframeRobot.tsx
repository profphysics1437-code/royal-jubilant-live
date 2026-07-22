'use client';

import { motion } from 'framer-motion';

// === Wireframe AI Robot — based on reference image ===
// Electric blue wireframe body, rectangular visor, glowing circle eyes
// Triangular chest pattern, stubby arms/legs, floating above neon platform

interface RobotProps {
  size?: number;
  animate?: boolean;
}

export function WireframeRobot({ size = 40, animate = false }: RobotProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      style={{ filter: 'drop-shadow(0 0 3px rgba(74, 144, 226, 0.6))' }}
    >
      <defs>
        <linearGradient id="robotBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a90e2" />
          <stop offset="50%" stopColor="#2c6cb0" />
          <stop offset="100%" stopColor="#1a4a80" />
        </linearGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#4a90e2" />
          <stop offset="100%" stopColor="#2c6cb0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="platformGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4a90e2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* === HEAD === Rounded oval with wireframe */}
      <motion.g animate={animate ? { y: [0, -0.5, 0] } : {}} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        {/* Head outline */}
        <ellipse cx="25" cy="12" rx="8" ry="7" fill="url(#robotBody)" opacity="0.3" stroke="#4a90e2" strokeWidth="0.6" />
        
        {/* Wireframe mesh on head */}
        <line x1="19" y1="9" x2="31" y2="9" stroke="#4a90e2" strokeWidth="0.3" opacity="0.5" />
        <line x1="18" y1="12" x2="32" y2="12" stroke="#4a90e2" strokeWidth="0.3" opacity="0.5" />
        <line x1="19" y1="15" x2="31" y2="15" stroke="#4a90e2" strokeWidth="0.3" opacity="0.5" />
        <line x1="22" y1="6" x2="22" y2="18" stroke="#4a90e2" strokeWidth="0.3" opacity="0.5" />
        <line x1="25" y1="5" x2="25" y2="19" stroke="#4a90e2" strokeWidth="0.3" opacity="0.5" />
        <line x1="28" y1="6" x2="28" y2="18" stroke="#4a90e2" strokeWidth="0.3" opacity="0.5" />

        {/* === VISOR === Rectangular, semi-transparent */}
        <rect x="17" y="9" width="16" height="5" rx="1.5" fill="#0A0F1E" opacity="0.9" stroke="#4a90e2" strokeWidth="0.3" />

        {/* === EYES === Glowing circles */}
        <circle cx="21" cy="11.5" r="1.5" fill="url(#eyeGlow)">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
          {animate && <animate attributeName="r" values="1.5;0.5;1.5" dur="0.8s" repeatCount="indefinite" />}
        </circle>
        <circle cx="29" cy="11.5" r="1.5" fill="url(#eyeGlow)">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
          {animate && <animate attributeName="r" values="1.5;0.5;1.5" dur="0.8s" repeatCount="indefinite" />}
        </circle>
        {/* Eye rings (outer glow) */}
        <circle cx="21" cy="11.5" r="2" fill="none" stroke="#4a90e2" strokeWidth="0.3" opacity="0.4" />
        <circle cx="29" cy="11.5" r="2" fill="none" stroke="#4a90e2" strokeWidth="0.3" opacity="0.4" />

        {/* Antenna */}
        <line x1="25" y1="5" x2="25" y2="2.5" stroke="#4a90e2" strokeWidth="0.5" />
        <circle cx="25" cy="2" r="0.8" fill="#4a90e2">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </motion.g>

      {/* === BODY === Teardrop torso with wireframe */}
      <motion.g animate={animate ? { y: [0, -0.5, 0] } : {}} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}>
        {/* Body outline — teardrop shape */}
        <path d="M16 22 Q16 18 25 18 Q34 18 34 22 L32 38 Q32 42 25 42 Q18 42 18 38 Z" 
              fill="url(#robotBody)" opacity="0.3" stroke="#4a90e2" strokeWidth="0.6" />

        {/* Triangular chest pattern (V shape) */}
        <path d="M19 24 L25 36 L31 24" fill="none" stroke="#4a90e2" strokeWidth="0.5" opacity="0.7" />
        <path d="M21 24 L25 33 L29 24" fill="none" stroke="#4a90e2" strokeWidth="0.3" opacity="0.5" />

        {/* Wireframe mesh on body */}
        <line x1="18" y1="25" x2="32" y2="25" stroke="#4a90e2" strokeWidth="0.3" opacity="0.4" />
        <line x1="19" y1="29" x2="31" y2="29" stroke="#4a90e2" strokeWidth="0.3" opacity="0.4" />
        <line x1="20" y1="33" x2="30" y2="33" stroke="#4a90e2" strokeWidth="0.3" opacity="0.4" />
        <line x1="21" y1="37" x2="29" y2="37" stroke="#4a90e2" strokeWidth="0.3" opacity="0.4" />
        
        {/* Central vertical line */}
        <line x1="25" y1="18" x2="25" y2="42" stroke="#4a90e2" strokeWidth="0.3" opacity="0.4" />

        {/* Chest LED (glowing dot) */}
        <circle cx="25" cy="28" r="1.5" fill="#4a90e2" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="25" cy="28" r="2.5" fill="none" stroke="#4a90e2" strokeWidth="0.3" opacity="0.3" />

        {/* === ARMS === Stubby, rounded */}
        {/* Left arm */}
        <path d="M16 24 Q12 27 11 31" fill="none" stroke="#4a90e2" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <circle cx="11" cy="31" r="1.5" fill="url(#robotBody)" opacity="0.4" stroke="#4a90e2" strokeWidth="0.4" />
        
        {/* Right arm (waving if animate) */}
        {animate ? (
          <motion.g
            animate={{ rotate: [0, 25, -5, 25, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ transformOrigin: '34px 24px' }}
          >
            <path d="M34 24 Q38 21 39 17" fill="none" stroke="#4a90e2" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <circle cx="39" cy="16.5" r="1.5" fill="url(#robotBody)" opacity="0.4" stroke="#4a90e2" strokeWidth="0.4" />
          </motion.g>
        ) : (
          <>
            <path d="M34 24 Q38 27 39 31" fill="none" stroke="#4a90e2" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <circle cx="39" cy="31" r="1.5" fill="url(#robotBody)" opacity="0.4" stroke="#4a90e2" strokeWidth="0.4" />
          </>
        )}

        {/* === LEGS === Stubby, merged with torso */}
        <path d="M21 42 L20 47" fill="none" stroke="#4a90e2" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M29 42 L30 47" fill="none" stroke="#4a90e2" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        {/* Feet */}
        <ellipse cx="20" cy="48" rx="1.5" ry="0.8" fill="url(#robotBody)" opacity="0.4" stroke="#4a90e2" strokeWidth="0.4" />
        <ellipse cx="30" cy="48" rx="1.5" ry="0.8" fill="url(#robotBody)" opacity="0.4" stroke="#4a90e2" strokeWidth="0.4" />
      </motion.g>

      {/* === FLOATING PARTICLES === */}
      {[
        { x: 8, y: 8, delay: 0 },
        { x: 42, y: 10, delay: 0.5 },
        { x: 6, y: 35, delay: 1 },
        { x: 43, y: 38, delay: 1.5 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="0.8"
          fill="#4a90e2"
          animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </motion.svg>
  );
}

// === Larger version for AI Powered page ===
export function WireframeRobotLarge({ size = 80 }: { size?: number }) {
  return <WireframeRobot size={size} animate={false} />;
}
