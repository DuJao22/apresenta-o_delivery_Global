import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, Package, MapPin, CheckCircle2, Navigation, 
  DollarSign, Clock, User, LogOut, Phone, History
} from 'lucide-react';

export default function DriverApp() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'history'>('deliveries');

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  };

  const completeDelivery = async (id: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    fetchOrders();
  };

  const activeOrders = orders.filter(o => o.status === 'DELIVERING' || o.status === 'PREPARING');
  const pastOrders = orders.filter(o => o.status === 'COMPLETED');
  const deliveryFee = 500; // R$ 5,00 per delivery

  if (loading) return <div className="p-8 bg-black h-screen text-white/50 uppercase tracking-widest text-[10px] flex items-center justify-center font-sans tracking-[0.2em]">Sincronizando Rotas...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col h-screen">
      {/* Driver Header */}
      <header className="p-8 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00ff00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,0,0.3)]">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest leading-none">Carlos Silva</h1>
              <p className="text-[10px] text-[#00ff00] font-black uppercase tracking-tight mt-1 opacity-80">Eco Entregador #29</p>
            </div>
          </div>
          <button className="bg-white/5 p-3 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-colors">
            <LogOut size={16} />
          </button>
        </div>

        <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 flex justify-between items-center">
          <div>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Ganhos de Hoje</p>
             <p className="text-2xl font-black text-[#00ff00]">R$ {(pastOrders.length * deliveryFee / 100).toFixed(2)}</p>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-right">
             <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Total Corridas</p>
             <p className="text-2xl font-black text-white">{pastOrders.length}</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex p-4 gap-4">
        <button 
          onClick={() => setActiveTab('deliveries')}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            activeTab === 'deliveries' ? 'bg-[#00ff00] text-black shadow-lg' : 'bg-white/5 text-white/30'
          }`}
        >
          Minhas Rotas
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            activeTab === 'history' ? 'bg-[#00ff00] text-black shadow-lg' : 'bg-white/5 text-white/30'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'deliveries' ? (
            <motion.div 
              key="deliveries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {activeOrders.length === 0 ? (
                <div className="py-20 text-center space-y-4 opacity-20">
                  <Truck className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">Nenhuma rota ativa</p>
                </div>
              ) : (
                activeOrders.map((order) => (
                  <motion.div 
                    key={order.id}
                    className="bg-white/5 rounded-[40px] p-8 border border-white/5 space-y-6 group hover:border-[#00ff00]/30 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#00ff00]/10 rounded-2xl">
                          <Package className="w-5 h-5 text-[#00ff00]" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest">#{order.id}</p>
                          <p className={`text-[9px] font-black uppercase tracking-tight ${order.status === 'PREPARING' ? 'text-yellow-500' : 'text-blue-500'}`}>
                            {order.status === 'PREPARING' ? 'Em Preparo' : 'Aguardando Coleta'}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-black text-[#00ff00]">R$ 5,00</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-[#00ff00] mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] opacity-40 uppercase font-black tracking-widest mb-1">Destino Final</p>
                          <p className="text-sm font-bold leading-relaxed">{order.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px]">{order.customer_name[0]}</div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase">{order.customer_name}</p>
                          <p className="text-[9px] opacity-40 font-bold">{order.customer_phone}</p>
                        </div>
                        <a href={`tel:${order.customer_phone}`} className="p-2 bg-white/5 rounded-xl hover:bg-[#00ff00]/20 transition-colors">
                           <Phone size={14} className="text-[#00ff00]" />
                        </a>
                      </div>
                    </div>
    
                    <div className="flex gap-3 pt-2">
                       <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(order.address)}`}
                        target="_blank"
                        className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                       >
                         <Navigation size={14} /> GPS
                       </a>
                       <button 
                        onClick={() => completeDelivery(order.id)}
                        className="flex-[1.5] bg-[#00ff00] text-black p-5 rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                       >
                         <CheckCircle2 size={16} /> Entregue
                       </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
               key="history" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="space-y-4"
            >
              {pastOrders.length === 0 ? (
                <div className="py-20 text-center opacity-10">
                  <History className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">Nada concluído ainda</p>
                </div>
              ) : (
                pastOrders.map(order => (
                  <div key={order.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex justify-between items-center group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ff00]/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-2xl bg-[#00ff00]/10 flex items-center justify-center text-[#00ff00]">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tighter">Pedido #{order.id}</p>
                        <p className="text-[9px] opacity-40 font-bold uppercase">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#00ff00]">R$ 5,00</p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
