import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Scene from './components/Scene';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Zap, Smartphone, BarChart3, 
  TrendingUp, Package, Bell, DollarSign, CheckCircle,
  Truck, MousePointer2, ChevronRight, Users, Mouse
} from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomerApp from './components/CustomerApp';
import AdminApp from './components/AdminApp';
import DriverApp from './components/DriverApp';
import Phone from './components/Phone';
import IntroLoader from './components/IntroLoader';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const [introFinished, setIntroFinished] = useState(false);
  const scrollRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });

    // GSAP Timeline for Narrative Layers
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    // Integrated Progress Bar Animation
    tl.fromTo(".progress-bar-fill", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

    // Scroll Indicator Fade Out
    tl.to(".scroll-indicator", { opacity: 0, y: 20, duration: 0.5 }, 0.01);

    // Scene 1: Impact (0-10%)
    tl.fromTo(".narrative-1", { opacity: 0, filter: "blur(10px)", force3D: true }, { opacity: 1, filter: "blur(0px)", duration: 1 })
      .to(".narrative-1", { opacity: 0, filter: "blur(10px)", force3D: true, duration: 1 }, "+=0.5")
      .fromTo(".narrative-2", { opacity: 0, filter: "blur(10px)", force3D: true }, { opacity: 1, filter: "blur(0px)", duration: 1 })
      .to(".narrative-2", { opacity: 0, filter: "blur(10px)", force3D: true, duration: 1 }, "+=0.5");

    // Scene 2: Entry (10-25%)
    tl.fromTo(".narrative-3", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.5 });

    // Scene 3: Functionalities (25-50%)
    tl.to(".narrative-3", { opacity: 0, x: -50, duration: 1 })
      .fromTo(".narrative-4", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5 })
      .to(".narrative-4", { opacity: 0, duration: 1 }, "+=1")
      .fromTo(".narrative-5", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5 });

    // Scene 4: Real Simulation (50-70%)
    tl.to(".narrative-5", { opacity: 0, duration: 1 })
      .fromTo(".notification-received", { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 1 })
      .to(".notification-received", { y: -10, repeat: 3, yoyo: true, duration: 0.1 }, "+=0.2");

    // Scene 5: Result (70-85%)
    tl.to(".notification-received", { opacity: 0, scale: 1.2, duration: 0.5 })
      .fromTo(".result-graph", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 2 })
      .fromTo(".result-value", { innerText: 0 }, { 
        innerText: 12500, 
        duration: 2, 
        snap: { innerText: 1 },
        onUpdate: function() {
          const el = document.querySelector('.result-value');
          if (el) el.innerHTML = `R$ ${Math.floor(this.targets()[0].innerText).toLocaleString('pt-BR')}`;
        }
      }, "<")
      .fromTo(".narrative-6", { opacity: 0 }, { opacity: 1, duration: 1 });

    // Scene 6: Authority (85-95%)
    tl.to([".result-graph", ".narrative-6"], { opacity: 0, duration: 1 })
      .fromTo(".narrative-7", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5 })
      .to(".narrative-7", { opacity: 0, duration: 1 }, "+=1")
      .fromTo(".narrative-8", { opacity: 0 }, { opacity: 1, duration: 1 });

    // Scene 7: Offer (95-100%)
    tl.to(".narrative-8", { opacity: 0, duration: 1 })
      .fromTo(".offer-card", { opacity: 0, y: 100, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 2 });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050505] text-white selection:bg-[#00ff00] selection:text-black min-h-[6000px] grain overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!introFinished && (
          <IntroLoader key="loader" onComplete={() => setIntroFinished(true)} />
        )}
      </AnimatePresence>

      {/* 3D Scene Layer (Always active, no re-renders from state) */}
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(20px)' }}
        animate={introFinished ? { opacity: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
        className="fixed inset-0 z-0 overflow-hidden"
      >
        <Scene scrollRef={scrollRef} />
      </motion.div>

      {/* Scroll Progress Bar (Apple style) */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-[200]">
        <div 
          className="progress-bar-fill h-full bg-[#00ff00] origin-left shadow-[0_0_10px_rgba(0,255,0,0.5)]"
        />
      </div>
      
      <AnimatePresence>
        {introFinished && (
          <>
            <motion.nav 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="fixed top-0 w-full z-[100] px-8 py-10 flex justify-between items-center pointer-events-none"
            >
              <div 
                className="text-2xl font-black tracking-tighter pointer-events-auto cursor-pointer font-heading uppercase"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Delivery Global
              </div>
              
              <div className="flex gap-12 text-[10px] font-black tracking-[0.3em] uppercase opacity-40 pointer-events-auto items-center">
                <button onClick={() => navigate('/app')} className="hover:text-[#00ff00] transition-colors">Experience</button>
                <button onClick={() => navigate('/admin')} className="hover:text-[#00ff00] transition-colors">Terminal</button>
                <div className="flex items-end gap-[2px] h-3 ml-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-[1px] bg-white/40"
                      animate={{ height: [2, 12, 4, 10, 2] }}
                      transition={{ duration: 1 + i * 0.2, repeat: Infinity, ease: "linear" }}
                    />
                  ))}
                </div>
              </div>
            </motion.nav>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="scroll-indicator fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4 pointer-events-none"
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#00ff00]/50 to-transparent relative overflow-hidden">
                <motion.div 
                  animate={{ y: [0, 48] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1/4 bg-[#00ff00]"
                />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00ff00] opacity-60">Scroll para explorar</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Narrative Overlay Layer */}
      <motion.div 
        ref={narrativeRef} 
        initial={{ opacity: 0 }}
        animate={introFinished ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
        className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center p-8"
      >
        <div className="max-w-4xl w-full text-center relative h-full flex items-center justify-center">
          
          {/* Scene 1 */}
          <h2 className="narrative-1 absolute text-4xl md:text-6xl font-display uppercase tracking-tighter leading-none opacity-0">
            Seu delivery está te fazendo <br /> <span className="text-[#ff4444]">perder dinheiro...</span>
          </h2>
          <h2 className="narrative-2 absolute text-4xl md:text-6xl font-display uppercase tracking-tighter leading-none opacity-0">
            Ou te fazendo <br /> <span className="text-[#00ff00]">crescer todos os dias?</span>
          </h2>

          {/* Scene 2 */}
          <div className="narrative-3 absolute right-0 md:right-20 text-right max-w-sm opacity-0">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none mb-6">
              Um sistema <br /> <span className="text-[#00ff00]">completo</span>
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest opacity-40">
              Interface desenhada para converter cada visita em pedido.
            </p>
          </div>

          {/* Scene 3 */}
          <div className="narrative-4 absolute bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 opacity-0">
            <h3 className="text-[#00ff00] text-xs font-black uppercase tracking-[0.3em] mb-4">Eficiência Máxima</h3>
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter leading-none">
              Pedidos rápidos <br /> em segundos
            </h2>
          </div>

          <div className="narrative-5 absolute left-0 md:left-20 text-left max-w-sm opacity-0">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none mb-6">
              Controle <br /> <span className="text-[#00ff00]">Total</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-50">
                <BarChart3 size={16} /> Estoque em tempo real
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-50">
                <Users size={16} /> Gestão de clientes
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-50">
                <Package size={16} /> Inteligência logística
              </div>
            </div>
          </div>

          {/* Scene 4 */}
          <div className="notification-received absolute top-20 bg-[#00ff00] text-black px-8 py-4 rounded-2xl flex items-center gap-4 shadow-[0_0_50px_rgba(0,255,0,0.3)] opacity-0">
            <Bell className="animate-bounce" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Sistema Alpha</p>
              <p className="text-sm font-black uppercase tracking-tight">Novo pedido recebido!</p>
            </div>
          </div>

          {/* Scene 5 */}
          <div className="result-graph absolute w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[40px] opacity-0 flex flex-col items-center">
             <TrendingUp size={48} className="text-[#00ff00] mb-8" />
             <p className="text-xs font-black uppercase tracking-[0.4em] opacity-30 mb-2">Faturamento Escalável</p>
             <h2 className="result-value text-7xl md:text-9xl font-display leading-none mb-8 tracking-tighter">
               R$ 0
             </h2>
             <h3 className="narrative-6 text-xl md:text-2xl font-light opacity-60 max-w-md">
               Enquanto você dorme... <br /> seu sistema <span className="text-white font-bold uppercase italic">vende.</span>
             </h3>
          </div>

          {/* Scene 6 */}
          <h2 className="narrative-7 absolute text-4xl md:text-6xl font-display uppercase tracking-tighter leading-[0.9] text-center max-w-2xl opacity-0">
            Pare de depender de apps que cobram <span className="text-[#ff4444]">taxas absurdas.</span>
          </h2>
          <h2 className="narrative-8 absolute text-5xl md:text-8xl font-display uppercase tracking-tighter leading-[0.8] text-center max-w-4xl opacity-0">
            Tenha seu próprio <br /> <span className="text-[#00ff00]">Delivery Global.</span>
          </h2>

          {/* Scene 7 */}
          <div className="offer-card absolute pointer-events-auto w-full max-w-md bg-white text-black p-12 rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] opacity-0">
             <div className="flex justify-between items-start mb-12">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Assinatura Anual</h4>
                  <h3 className="text-4xl font-display uppercase tracking-tighter">Premium Plan</h3>
               </div>
               <div className="bg-[#00ff00] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Oferta Limitada</div>
             </div>
             
             <div className="mb-12">
                <p className="text-6xl font-display tracking-tight">R$ 50<span className="text-xl opacity-40">/mês</span></p>
                <p className="text-xs opacity-50 font-bold">*Oferta promocional por tempo limitado</p>
             </div>

             <div className="space-y-4 mb-12">
                {[
                  "App Cliente White Label",
                  "Painel Admin Ilimitado",
                  "App Entregador Nativo",
                  "Suporte Prioritário 24/7"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                    <CheckCircle size={14} className="text-[#00ff00]" /> {item}
                  </div>
                ))}
             </div>

             <button 
              onClick={() => window.location.href = 'https://delivery-global.onrender.com/'}
              className="w-full bg-black text-white p-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#00ff00] hover:text-black transition-all group"
             >
               Quero meu sistema agora <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </button>
          </div>

        </div>
      </motion.div>

      {/* Atmospheric Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 atmos-bg opacity-30" />
      <div className="fixed inset-0 pointer-events-none z-[1] backdrop-blur-[2px] opacity-10" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/*" element={<CustomerApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/driver/*" element={<DriverApp />} />
      </Routes>
    </BrowserRouter>
  );
}
