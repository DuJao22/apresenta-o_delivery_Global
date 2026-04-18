import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStage(1), 500);
          setTimeout(() => onComplete(), 2500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Kinetic Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border border-[#00ff00]/5 rounded-full pointer-events-none" 
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="overflow-hidden mb-8">
          <motion.h1 
            initial={{ y: 200 }}
            animate={{ y: stage === 0 ? 0 : -200 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl font-display uppercase tracking-tighter leading-none text-[#00ff00] text-glow italic"
          >
            DELIVERY
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-12">
          <motion.h1 
            initial={{ y: 200 }}
            animate={{ y: stage === 0 ? 0 : -200 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-6xl md:text-9xl font-display uppercase tracking-tighter leading-none text-white italic"
          >
            GLOBAL
          </motion.h1>
        </div>

        {/* Cinematic Progress Bar */}
        <div className="w-64 md:w-96 h-[2px] bg-white/5 relative overflow-hidden">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            className="absolute inset-0 bg-[#00ff00] origin-left shadow-[0_0_20px_rgba(0,255,0,0.5)]"
          />
        </div>
        
        <div className="mt-4 overflow-hidden h-4">
          <motion.p 
            animate={{ y: stage === 0 ? 0 : -50 }}
            className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30"
          >
            Sincronizando Império ({Math.floor(progress)}%)
          </motion.p>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-2">
        <div className="w-12 h-[1px] bg-white/20" />
        <p className="text-[8px] font-black uppercase tracking-widest opacity-20">EST. 2026</p>
      </div>
      
      <div className="absolute top-12 right-12 text-right">
        <p className="text-[8px] font-black uppercase tracking-widest opacity-20">PROTOCOLO v4.0</p>
        <p className="text-[8px] font-black uppercase tracking-widest opacity-20 text-[#00ff00]">CONEXÃO SEGURA</p>
      </div>
    </motion.div>
  );
}
