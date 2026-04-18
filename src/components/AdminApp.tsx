import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Settings, 
  TrendingUp, Clock, Check, X, Bell, DollarSign, Power, 
  ChevronRight, ArrowUpRight, Truck
} from 'lucide-react';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu'>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchMenu();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  const fetchMenu = () => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      });
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  const stats = [
    { label: 'Faturamento Hoje', value: `R$ ${(orders.reduce((acc, o) => acc + o.total, 0) / 100).toFixed(2)}`, icon: DollarSign, color: 'text-[#00ff00]' },
    { label: 'Pedidos Ativos', value: orders.filter(o => o.status !== 'COMPLETED').length, icon: Clock, color: 'text-blue-400' },
    { label: 'Taxa de Entrega', value: 'R$ 5,00', icon: TrendingUp, color: 'text-purple-400' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'PREPARING': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DELIVERING': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'COMPLETED': return 'text-[#00ff00] bg-[#00ff00]/10 border-[#00ff00]/20';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (loading) return <div className="p-8 bg-black h-screen text-white/50 uppercase tracking-widest text-[10px] flex items-center justify-center">Carregando Painel Administrativo...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans overflow-hidden h-screen w-full">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-black border-r border-white/5 flex flex-col p-6 gap-8">
        <div className="p-2 font-black text-xl italic tracking-tighter text-[#00ff00] uppercase hidden md:block">ADMIN DASH</div>
        <div className="md:hidden p-2 font-black text-[#00ff00]">A</div>

        <nav className="flex flex-col gap-2 flex-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Resumo' },
            { id: 'orders', icon: ShoppingCart, label: 'Pedidos' },
            { id: 'menu', icon: Package, label: 'Produtos' },
            { id: 'team', icon: Users, label: 'Equipe' },
            { id: 'settings', icon: Settings, label: 'Ajustes' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all whitespace-nowrap overflow-hidden ${
                activeTab === item.id ? 'bg-[#00ff00] text-black font-black' : 'hover:bg-white/5 text-white/40'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:block text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 bg-white/5 rounded-3xl border border-white/10 hidden md:block font-sans">
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Servidor On</span>
           </div>
           <p className="text-[9px] opacity-40 leading-relaxed uppercase">Última atualização: {new Date().toLocaleTimeString()}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              {activeTab === 'dashboard' ? 'Performance' : activeTab === 'orders' ? 'Operações' : 'Cardápio'}
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold mt-1">Crescendo rumo ao amanhã.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white/5 p-4 rounded-2xl border border-white/10 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#00ff00] rounded-full animate-ping" />
             </button>
             <button className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
                Exportar CSV
             </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <stat.icon size={80} />
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.color} bg-white/5 w-fit mb-6`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">{stat.label}</p>
                    <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white/5 p-10 rounded-[48px] border border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-40">Volume de Vendas</h3>
                    <ArrowUpRight className="w-4 h-4 opacity-40" />
                  </div>
                  <div className="flex gap-3 items-end h-64">
                     {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                       <motion.div 
                        key={i} 
                        initial={{ height: 0 }} 
                        animate={{ height: `${h}%` }} 
                        className="flex-1 bg-gradient-to-t from-[#00ff00]/20 to-[#00ff00]/40 rounded-2xl" 
                       />
                     ))}
                  </div>
               </div>

               <div className="bg-white/5 p-10 rounded-[48px] border border-white/5 overflow-hidden flex flex-col">
                  <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-8">Pedidos Ativos</h3>
                  <div className="space-y-4 flex-1">
                    {orders.filter(o => o.status !== 'COMPLETED').slice(0, 4).map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-4 bg-white/5 rounded-3xl border border-white/5">
                        <div className="flex gap-4 items-center">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'PENDING' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="text-xs font-bold uppercase">{order.customer_name}</p>
                            <p className="text-[10px] opacity-40"># {order.id}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#00ff00]">R$ {(order.total / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    {orders.filter(o => o.status !== 'COMPLETED').length === 0 && (
                      <div className="flex-1 flex items-center justify-center opacity-20 text-xs font-bold uppercase tracking-widest">Tudo limpo por aqui</div>
                    )}
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-[#00ff00] hover:underline">Ver operação completa</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
           <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  key={order.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 p-8 rounded-[40px] border border-white/5 flex flex-wrap lg:flex-nowrap justify-between items-center gap-8 hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex gap-8 items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Pedido</p>
                      <p className="text-xl font-black text-[#00ff00]">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Cliente</p>
                      <p className="text-sm font-bold uppercase">{order.customer_name}</p>
                      <p className="text-[9px] opacity-40 font-bold">{order.customer_phone}</p>
                    </div>
                    <div className="hidden xl:block">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Endereço</p>
                      <p className="text-[10px] font-bold max-w-xs line-clamp-1">{order.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2 text-right">Status</p>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {order.status === 'PENDING' && (
                        <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} className="bg-[#00ff00] text-black w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button onClick={() => updateOrderStatus(order.id, 'DELIVERING')} className="bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 transition-all">
                          <Truck className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'DELIVERING' && (
                        <button onClick={() => updateOrderStatus(order.id, 'COMPLETED')} className="bg-emerald-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 transition-all">
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <button className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center text-red-500/40 hover:text-red-500 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        )}

        {activeTab === 'menu' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {products.map(product => (
               <div key={product.id} className="bg-white/5 rounded-[40px] border border-white/5 p-6 space-y-4 group">
                 <div className="relative h-48 rounded-[32px] overflow-hidden">
                    <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute bottom-4 left-6 bg-[#00ff00] text-black text-[10px] font-black px-3 py-1 rounded-full">{product.category_name}</span>
                 </div>
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-bold uppercase text-sm tracking-tight">{product.name}</h3>
                     <p className="text-xl font-black text-[#00ff00] mt-1">R$ {(product.price / 100).toFixed(2)}</p>
                   </div>
                   <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${product.available ? 'bg-white/5 text-white/20' : 'bg-red-500 text-white'}`}>
                      <Power className="w-4 h-4" />
                   </button>
                 </div>
                 <div className="flex gap-2">
                    <button className="flex-1 bg-white/5 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Editar</button>
                    <button className="bg-white/5 p-3 rounded-2xl text-white/20 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                 </div>
               </div>
             ))}
           </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
