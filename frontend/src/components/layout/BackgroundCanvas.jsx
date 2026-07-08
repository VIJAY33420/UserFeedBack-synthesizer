import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundCanvas = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Violet Orb */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]"
      />
      {/* Cyan Orb */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-400/10 blur-[150px]"
      />
      {/* Rose Orb */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-rose-500/10 blur-[100px]"
      />
    </div>
  );
};
