/**
 * Cyber Security Background - Enterprise Grade
 * Advanced animated cyber grid with network nodes and code fragments
 */
import * as React from 'react';
import { motion } from 'framer-motion';

// Floating code fragments
const codeSnippets = [
  '0x7F3A9B2C',
  'SHA-256',
  'RSA-4096',
  'AES-256',
  '::VERIFIED::',
  'AUTH_OK',
  'ENCRYPTED',
  '>>> SECURE',
  'TLS 1.3',
  'HMAC',
];

// Network node component
function NetworkNode({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.g>
      {/* Connection lines */}
      <motion.circle
        cx={x}
        cy={y}
        r="3"
        fill="url(#nodeGradient)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.8, 0.4, 0.8, 0],
          scale: [0, 1, 0.8, 1, 0],
        }}
        transition={{
          duration: 4,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Pulse ring */}
      <motion.circle
        cx={x}
        cy={y}
        r="3"
        fill="none"
        stroke="url(#nodeGradient)"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ 
          opacity: [0.6, 0],
          scale: [1, 3],
        }}
        transition={{
          duration: 2,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.g>
  );
}

// Code fragment component
function CodeFragment({ snippet, index }: { snippet: string; index: number }) {
  const startX = 5 + Math.random() * 90;
  const startY = 100 + Math.random() * 20;
  
  return (
    <motion.div
      className="absolute text-[10px] sm:text-xs font-mono pointer-events-none select-none whitespace-nowrap"
      style={{
        left: `${startX}%`,
        color: `hsla(${180 + Math.random() * 40}, 100%, 70%, 0.4)`,
        textShadow: '0 0 10px currentColor',
      }}
      initial={{ y: startY, opacity: 0 }}
      animate={{
        y: [startY, -50],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: 12 + Math.random() * 8,
        delay: index * 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {snippet}
    </motion.div>
  );
}

// Hex grid pattern
function HexGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
      <defs>
        <pattern id="hexPattern" width="50" height="43.4" patternUnits="userSpaceOnUse">
          <path 
            d="M25,0 L50,14.4 L50,43.4 L25,57.8 L0,43.4 L0,14.4 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexPattern)" className="text-cyan-400" />
    </svg>
  );
}

export function CyberBackground() {
  // Generate network nodes
  const nodes = React.useMemo(() => {
    const generated: { x: number; y: number; delay: number }[] = [];
    for (let i = 0; i < 15; i++) {
      generated.push({
        x: 50 + Math.random() * 700,
        y: 50 + Math.random() * 500,
        delay: Math.random() * 5,
      });
    }
    return generated;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep Cyber Base - Darker for more contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#0a1628] to-[#0f0a1e]" />
      
      {/* Animated Cyber Mesh */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, hsla(190, 100%, 50%, 0.12) 0px, transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsla(260, 100%, 50%, 0.08) 0px, transparent 50%),
            radial-gradient(ellipse at 40% 80%, hsla(200, 100%, 45%, 0.1) 0px, transparent 50%),
            radial-gradient(ellipse at 90% 70%, hsla(280, 100%, 45%, 0.08) 0px, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Hex Grid Pattern */}
      <HexGrid />
      
      {/* Scan Line Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 50%, hsla(190, 100%, 50%, 0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      
      {/* Animated Scan Beam */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        initial={{ top: '-2px' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Network Visualization */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsla(190, 100%, 60%, 1)" />
            <stop offset="100%" stopColor="hsla(260, 100%, 60%, 1)" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsla(190, 100%, 50%, 0.3)" />
            <stop offset="50%" stopColor="hsla(220, 100%, 50%, 0.2)" />
            <stop offset="100%" stopColor="hsla(260, 100%, 50%, 0.3)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Lines */}
        {nodes.slice(0, 10).map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${node.x / 8}%`}
              y1={`${node.y / 6}%`}
              x2={`${nextNode.x / 8}%`}
              y2={`${nextNode.y / 6}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.5, 0.5, 0],
              }}
              transition={{
                duration: 6,
                delay: i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
        
        {/* Network Nodes */}
        {nodes.map((node, i) => (
          <NetworkNode 
            key={`node-${i}`} 
            x={node.x / 8 * 8} 
            y={node.y / 6 * 6} 
            delay={node.delay} 
          />
        ))}
      </svg>
      
      {/* Primary Cyan Orb - Top */}
      <motion.div
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(190, 100%, 50%, 0.15) 0%, hsla(200, 100%, 40%, 0.05) 40%, transparent 70%)',
          top: '-20%',
          right: '-10%',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary Purple Orb - Bottom */}
      <motion.div
        className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(260, 100%, 50%, 0.12) 0%, hsla(280, 100%, 40%, 0.04) 40%, transparent 70%)',
          bottom: '-15%',
          left: '-10%',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, -30, 0],
          scale: [1.05, 1, 1.05],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Tertiary Electric Blue - Center */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full hidden sm:block"
        style={{
          background: 'radial-gradient(circle, hsla(210, 100%, 55%, 0.1) 0%, transparent 60%)',
          top: '30%',
          left: '40%',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating Code Fragments - Reduced on mobile */}
      <div className="hidden sm:block">
        {codeSnippets.map((snippet, i) => (
          <CodeFragment key={i} snippet={snippet} index={i} />
        ))}
      </div>
      
      {/* Corner Shield Accent */}
      <svg className="absolute top-4 sm:top-8 start-4 sm:start-8 w-16 h-16 sm:w-24 sm:h-24 text-cyan-500/10">
        <motion.path
          d="M12,2 L22,7 V13 C22,18.5 17.5,23 12,24 C6.5,23 2,18.5 2,13 V7 L12,2 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          style={{ transform: 'scale(2)', transformOrigin: 'center' }}
        />
      </svg>
      
      {/* Top Light Ray */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[400px] opacity-[0.02]"
        style={{
          background: 'conic-gradient(from 90deg at 50% 0%, transparent, hsla(190, 100%, 60%, 1), transparent 180deg)',
        }}
      />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
