/**
 * Auth Background Component - Enterprise Premium Animation
 */
import * as React from 'react';
import { motion } from 'framer-motion';

export function AuthBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep Corporate Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#0d1526] to-[#080c14]" />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Primary Gradient Orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[150px]"
        style={{
          background: 'radial-gradient(circle, hsl(220 100% 20% / 0.25) 0%, transparent 70%)',
          top: '-20%',
          right: '-15%',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Accent Gradient Orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, hsl(35 85% 45% / 0.12) 0%, transparent 70%)',
          bottom: '-10%',
          left: '-10%',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, -15, 0],
          scale: [1.05, 1, 1.05],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Tertiary Orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, hsl(190 100% 30% / 0.1) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/10"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Light rays */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[400px] opacity-[0.02]"
        style={{
          background: 'conic-gradient(from 90deg at 50% 0%, transparent, hsl(35 85% 50%), transparent 180deg)',
        }}
      />
    </div>
  );
}
