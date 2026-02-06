/**
 * Auth Background Component - World-Class Premium Design
 * Deep Navy/Indigo Color Scheme with Advanced Animations
 */
import * as React from 'react';
import { motion } from 'framer-motion';

export function AuthBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep Navy Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
      
      {/* Animated Mesh Gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, hsla(228, 100%, 50%, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(265, 100%, 50%, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(210, 100%, 40%, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsla(280, 100%, 40%, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(220, 100%, 30%, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsla(250, 100%, 40%, 0.1) 0px, transparent 50%)
          `,
        }}
      />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Primary Electric Blue Orb - Top Right */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(220, 100%, 60%, 0.2) 0%, hsla(230, 100%, 40%, 0.1) 30%, transparent 70%)',
          top: '-25%',
          right: '-20%',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary Indigo/Purple Orb - Bottom Left */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(265, 100%, 50%, 0.15) 0%, hsla(280, 100%, 40%, 0.08) 30%, transparent 70%)',
          bottom: '-15%',
          left: '-15%',
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -25, 0],
          scale: [1.05, 1, 1.05],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Tertiary Cyan Accent - Center */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(185, 100%, 50%, 0.1) 0%, transparent 60%)',
          top: '40%',
          left: '30%',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Emerald Success Accent - Hidden by default, used for success states */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, hsla(160, 100%, 45%, 0.15) 0%, transparent 60%)',
          top: '50%',
          right: '20%',
          filter: 'blur(50px)',
        }}
        id="success-orb"
      />
      
      {/* Floating Particles - Electric Blue */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `hsla(${210 + Math.random() * 50}, 100%, 70%, ${0.2 + Math.random() * 0.3})`,
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            y: [0, -40 - Math.random() * 30, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Connecting Lines - Network Effect */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsla(220, 100%, 70%, 0.5)" />
            <stop offset="100%" stopColor="hsla(280, 100%, 70%, 0.5)" />
          </linearGradient>
        </defs>
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${10 + i * 12}%`}
            y1={`${20 + (i % 3) * 25}%`}
            x2={`${30 + i * 8}%`}
            y2={`${60 + (i % 2) * 20}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
      
      {/* Top Light Ray */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[250%] h-[500px] opacity-[0.025]"
        style={{
          background: 'conic-gradient(from 90deg at 50% 0%, transparent, hsla(220, 100%, 70%, 1), transparent 180deg)',
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
