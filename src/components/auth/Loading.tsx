"use client";
import { motion } from 'framer-motion';

export function Loading() {
  return (
    <div
      className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, 
          #8043CC 0%, 
          #6F32BB 30%, 
          #5F2BA0 70%, 
          #4A1A85 100%
        )`,
      }}
    >
      <motion.div
        className="relative"
        animate={{
          rotateX: [0, 15, -15, 0],
          rotateY: [0, 360],
          rotateZ: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <h1
          className="text-9xl font-black text-white relative select-none"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: `
              0 0 20px #B3B9DA,
              0 0 40px #8043CC,
              0 0 60px #6F32BB,
              2px 2px 0px #5F2BA0,
              4px 4px 0px #4A1A85,
              6px 6px 0px #3D1570,
              8px 8px 0px #30105B,
              10px 10px 0px #230B46,
              12px 12px 0px #160631
            `,
            letterSpacing: '0.15em',
            transform: 'perspective(500px)',
          }}
        >
          BIC
        </h1>
        
        <motion.div
          className="absolute inset-0 text-9xl font-black text-transparent bg-clip-text"
          style={{
            background: `linear-gradient(45deg, 
              #DAC9F0, 
              #B3B9DA, 
              #8043CC, 
              #6F32BB, 
              #5F2BA0
            )`,
            WebkitBackgroundClip: 'text',
            letterSpacing: '0.15em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          BIC
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.p
          className="text-white/70 text-lg font-medium tracking-widest mb-4"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          Loading...
        </motion.p>
        
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#B3B9DA' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}