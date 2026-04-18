import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, ChevronRight, Plus, Minus, Search, Clock, 
  MapPin, CheckCircle2, ArrowLeft, User, CreditCard, 
  Banknote, X, Info
} from 'lucide-react';
import { useCart } from '../store/useCart';

const CINEMATIC_IMAGES = [
  "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80"
];

const CinematicBackground = memo(() => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CINEMATIC_IMAGES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[var(--paper)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ opacity: 0.15, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 5, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={CINEMATIC_IMAGES[index]} 
            alt="Background" 
            className="w-full h-full object-cover grayscale-[0.5] contrast-[1.1]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Light Overlay for Professional Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--paper)]/80 via-transparent to-[var(--paper)]/95" />
      
      {/* Moving Professional Accents */}
      <motion.div 
        animate={{ x: ['-100%', '100%'], opacity: [0, 0.05, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent rotate-[-15deg]"
      />
    </div>
  );
});

const ScrollHint = memo(() => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2, duration: 1 }}
    className="absolute bottom-32 left-0 right-0 flex flex-col items-center justify-center gap-2 z-10 pointer-events-none"
  >
    <span className="meta-label text-[color:var(--accent)] !opacity-100">Explore o Cardápio</span>
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <ChevronRight className="w-5 h-5 rotate-90 text-[color:var(--accent)]" />
    </motion.div>
  </motion.div>
));

const SplashScreen = memo(({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[var(--paper)] flex flex-col items-center justify-center p-8"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, letterSpacing: '0.5em' }}
          animate={{ scale: 1, opacity: 1, letterSpacing: '-0.02em' }}
          transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
          className="title-massive text-[color:var(--accent)] text-center mb-2"
        >
          GLOBAL<br />BURGER
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="h-[1px] bg-[color:var(--accent)] mb-4"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="meta-label text-center"
        >
          Experiência Gastronômica Premium
        </motion.div>
      </div>
    </motion.div>
  );
});

const ProductCard = memo(({ product, onSelect }: { product: any, onSelect: (p: any) => void }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 30, scale: 0.98 },
      show: { opacity: 1, y: 0, scale: 1 }
    }}
    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    className="glass-card rounded-[40px] overflow-hidden group flex flex-col gpu hover:shadow-2xl transition-all duration-500"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img 
        src={product.image_url} 
        alt={product.name} 
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out mt-1" 
      />
      <div className="absolute top-6 right-6 glass-light px-4 py-2 rounded-full border border-black/5 shadow-sm">
        <span className="text-xs font-black text-[color:var(--accent)]">R$ {(product.price / 100).toFixed(2)}</span>
      </div>
    </div>
    
    <div className="p-8 flex flex-col flex-1">
      <div className="flex-1 mb-8">
        <h3 className="font-display text-2xl tracking-tighter mb-3 text-high-contrast">{product.name}</h3>
        <p className="text-xs opacity-60 leading-relaxed font-normal text-high-contrast">{product.description}</p>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(product);
        }}
        className="w-full bg-[color:var(--ink)] text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[color:var(--accent)] active:scale-95 transition-all duration-300"
      >
        <Plus className="w-4 h-4" /> ADICIONAR AO PEDIDO
      </button>
    </div>
  </motion.div>
));

export default function CustomerApp() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'menu' | 'cart' | 'checkout' | 'success'>('menu');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const cart = useCart();

  // Checkout State
  const [address, setAddress] = useState({ cep: '', street: '', number: '', complement: '' });
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [payment, setPayment] = useState({ method: 'PIX', change: '' });

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = () => {
    setLoading(true);
    setError(null);
    fetch('/api/menu')
      .then(res => {
        if (!res.ok) throw new Error('API indisponível');
        return res.json();
      })
      .then(data => {
        setCategories(data.categories);
        setProducts(data.products);
        if (data.categories.length > 0) setActiveCategory(data.categories[0].id);
        setLoading(false);
      })
      .catch(err => {
        console.error("Menu load error:", err);
        setError("Não foi possível carregar o cardápio. Verifique sua conexão.");
        setLoading(false);
      });
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeCategory) {
      result = result.filter(p => p.category_id === activeCategory);
    }
    return result;
  }, [products, searchQuery, activeCategory]);

  const handleCEPChange = async (cep: string) => {
    setAddress({ ...address, cep });
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress(prev => ({ ...prev, street: data.logradouro }));
        }
      } catch (err) {
        console.error("CEP error", err);
      }
    }
  };

  const currentPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
    return selectedProduct.price + optionsTotal;
  }, [selectedProduct, selectedOptions]);

  const addToCartInternal = () => {
    if (!selectedProduct) return;
    const cartItemId = `${selectedProduct.id}-${selectedOptions.map(o => o.id).sort().join('-')}`;
    cart.addItem({
      id: cartItemId,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: currentPrice,
      quantity: 1,
      selectedOptions,
      image: selectedProduct.image_url
    });
    setSelectedProduct(null);
    setSelectedOptions([]);
  };

  const finalizeOrder = async () => {
    const finalTotal = cart.total();
    const orderData = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      address: `${address.street}, ${address.number} ${address.complement} (CEP: ${address.cep})`,
      payment_method: payment.method,
      total: finalTotal,
      items: cart.items.map(i => ({
        product_id: i.productId,
        quantity: i.quantity,
        price: i.price,
        observation: i.observation
      }))
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();
    if (result.success) {
      setActiveView('success');
      cart.clearCart();
    }
  };

  const getWhatsAppLink = () => {
    const phone = '5511999999999'; // Restaurant phone
    const text = `Novo Pedido! 🎉\n\n*Cliente:* ${customer.name}\n*Endereço:* ${address.street}, ${address.number}\n*Total:* R$ ${(cart.total() / 100).toFixed(2)}\n\nAguardando confirmação!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  if (loading || showSplash) {
    return (
      <AnimatePresence>
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <div className="p-8 text-center text-ink/50 uppercase tracking-widest text-xs h-screen flex flex-col items-center justify-center bg-[var(--paper)]">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
            Carregando Cardápio...
          </div>
        )}
      </AnimatePresence>
    );
  }

  if (error) return (
    <div className="p-10 text-center text-ink space-y-8 h-screen flex flex-col items-center justify-center bg-[var(--paper)]">
      <div className="w-20 h-20 bg-[var(--danger)]/10 rounded-full flex items-center justify-center text-[var(--danger)] mb-4">
        <Info className="w-10 h-10" />
      </div>
      <h2 className="title-massive text-4xl !leading-tight uppercase tracking-tighter">ERRO DE CONEXÃO</h2>
      <p className="text-[10px] opacity-60 uppercase tracking-widest text-center px-4 leading-relaxed max-w-xs mx-auto">
        {error}
      </p>
      <button 
        onClick={loadMenu}
        className="px-10 py-5 bg-[var(--accent)] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all"
      >
        Tentar Novamente
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-sans max-w-md mx-auto relative shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col grain-overlay">
      <CinematicBackground />
      
      {/* Scroll Signal */}
      {activeView === 'menu' && !searchQuery && <ScrollHint />}

      {/* Dynamic Header */}
      <header className="p-8 pb-4 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div onClick={() => setActiveView('menu')} className="cursor-pointer">
            <h1 className="title-massive text-3xl uppercase tracking-tighter text-high-contrast">Global Burger</h1>
            <p className="meta-label flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-[color:var(--accent)]" /> 20-35 min • Entrega Grátis
            </p>
          </div>
          {activeView === 'menu' && (
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-[color:var(--accent)] group-focus-within:opacity-100 transition-all" />
              <input 
                type="text" 
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/5 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none w-10 focus:w-44 transition-all duration-700 ease-[0.23, 1, 0.32, 1] focus:bg-white focus:shadow-xl"
              />
            </div>
          )}
          {activeView !== 'menu' && (
            <button onClick={() => setActiveView('menu')} className="bg-white/50 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-black/5 active:scale-90 transition-all">
              <ArrowLeft className="w-5 h-5 text-high-contrast" />
            </button>
          )}
        </div>

        {activeView === 'menu' && (
          <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat.id && !searchQuery ? 'bg-[var(--accent)] text-white shadow-xl translate-y-[-2px]' : 'bg-white/50 text-ink/40 border border-black/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar relative z-10 mt-2">
        <AnimatePresence mode="wait">
          {activeView === 'menu' && (
            <motion.div
              key="menu"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.1 }
                }
              }}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 meta-label flex flex-col items-center gap-4">
                  <span className="text-4xl">🍴</span>
                  Nenhum item encontrado
                </div>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                ))
              )}
            </motion.div>
          )}

          {activeView === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pt-4">
              <h2 className="title-massive text-3xl uppercase text-high-contrast mb-6">Seu Pedido</h2>
              {cart.items.length === 0 ? (
                <div className="text-center py-24 glass-card rounded-[40px]">
                  <ShoppingBag className="w-16 h-16 mx-auto opacity-10 mb-6" />
                  <p className="meta-label">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map(item => (
                    <div key={item.id} className="glass-card p-6 rounded-[32px] flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-black uppercase text-high-contrast">{item.name}</h4>
                        {item.selectedOptions.map(opt => (
                          <span key={opt.id} className="text-[10px] text-[color:var(--accent)] font-bold block mt-1">+ {opt.name}</span>
                        ))}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center bg-black/5 rounded-full p-1">
                            <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-full transition-colors"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-black w-8 text-center">{item.quantity}</span>
                            <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-full transition-colors"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[color:var(--accent)] whitespace-nowrap">R$ {(item.price * item.quantity / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pt-4">
               {checkoutStep === 1 && (
                 <div className="space-y-6">
                   <h3 className="title-massive text-2xl uppercase text-high-contrast">1. ENTREGA</h3>
                   <div className="space-y-4">
                     <div className="glass-card p-2 rounded-[24px]">
                       <input 
                        type="text" 
                        placeholder="CEP (Somente números)" 
                        maxLength={8}
                        value={address.cep}
                        onChange={(e) => handleCEPChange(e.target.value)}
                        className="w-full bg-transparent p-4 text-sm font-bold placeholder:text-ink/20 outline-none" 
                       />
                     </div>
                     <div className="glass-card p-2 rounded-[24px]">
                       <input 
                        type="text" 
                        placeholder="Endereço Completo" 
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        className="w-full bg-transparent p-4 text-sm font-bold placeholder:text-ink/20 outline-none" 
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="glass-card p-2 rounded-[24px]">
                         <input 
                          type="text" 
                          placeholder="Número" 
                          value={address.number}
                          onChange={(e) => setAddress({...address, number: e.target.value})}
                          className="w-full bg-transparent p-4 text-sm font-bold placeholder:text-ink/20 outline-none" 
                         />
                       </div>
                       <div className="glass-card p-2 rounded-[24px]">
                         <input 
                          type="text" 
                          placeholder="Ap / Bloco" 
                          value={address.complement}
                          onChange={(e) => setAddress({...address, complement: e.target.value})}
                          className="w-full bg-transparent p-4 text-sm font-bold placeholder:text-ink/20 outline-none" 
                         />
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {checkoutStep === 2 && (
                 <div className="space-y-6">
                   <h3 className="title-massive text-2xl uppercase">2. IDENTIFICAÇÃO</h3>
                   <div className="space-y-4">
                     <div className="glass-card p-2 rounded-[24px] flex items-center px-4">
                       <User className="w-5 h-5 opacity-20" />
                       <input 
                        type="text" 
                        placeholder="Seu Nome Completo" 
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                        className="bg-transparent p-4 text-sm outline-none flex-1 font-bold" 
                       />
                     </div>
                     <div className="glass-card p-2 rounded-[24px] flex items-center px-4">
                       <Clock className="w-5 h-5 opacity-20" />
                       <input 
                        type="tel" 
                        placeholder="Telefone (WhatsApp)" 
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                        className="bg-transparent p-4 text-sm outline-none flex-1 font-bold" 
                       />
                     </div>
                   </div>
                 </div>
               )}

               {checkoutStep === 3 && (
                 <div className="space-y-6">
                   <h3 className="title-massive text-2xl uppercase">3. PAGAMENTO</h3>
                   <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'PIX', label: 'PIX (Pagamento Instantâneo)', icon: CheckCircle2 },
                      { id: 'CARD', label: 'Cartão (Na Entrega)', icon: CreditCard },
                      { id: 'CASH', label: 'Dinheiro', icon: Banknote },
                    ].map(method => (
                      <button 
                        key={method.id}
                        onClick={() => setPayment({...payment, method: method.id})}
                        className={`flex items-center gap-5 p-6 rounded-[32px] border transition-all duration-500 scale-in ${
                          payment.method === method.id ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-2xl scale-[1.02]' : 'glass-card'
                        }`}
                      >
                        <method.icon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                      </button>
                    ))}
                   </div>
                 </div>
               )}
            </motion.div>
          )}

          {activeView === 'success' && (
            <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12 space-y-10">
              <div className="relative inline-block">
                <CheckCircle2 className="w-32 h-32 text-[var(--accent)] mx-auto" />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.5 }} 
                  animate={{ scale: 1.5, opacity: 0 }} 
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                  className="absolute inset-0 border-2 border-[var(--accent)] rounded-full"
                />
              </div>
              <div className="space-y-4">
                <h2 className="title-massive text-5xl uppercase text-[var(--accent)]">Pedido Enviado!</h2>
                <p className="meta-label">Agora é só aguardar a nossa equipe</p>
              </div>

              <div className="glass-card p-10 rounded-[40px] border border-[var(--accent)]/10 text-left space-y-6 shadow-2xl">
                 <div className="flex justify-between items-center bg-[var(--accent)]/5 p-4 rounded-2xl">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_10px_var(--accent)]" />
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--accent)]">Preparando na Cozinha</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-xl font-display font-black tracking-tight">Tempo Estimado: 35 min</p>
                    <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Seu pedido chegará quentinho!</p>
                 </div>
              </div>

              <div className="space-y-4">
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  className="w-full bg-[#25D366] text-white p-6 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:shadow-[#25D366]/20 transition-all active:scale-95"
                >
                  Confirmar no WhatsApp
                </a>
                <button 
                  onClick={() => setActiveView('menu')}
                  className="w-full bg-black/5 text-ink/40 p-6 rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-black/10 transition-all"
                >
                  Voltar ao Cardápio
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation */}
      {activeView !== 'success' && (
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)]/90 to-transparent z-20">
          {activeView === 'menu' && (
            <button 
              onClick={() => setActiveView('cart')}
              className="w-full bg-[var(--ink)] text-white p-6 rounded-[28px] font-black uppercase tracking-widest flex justify-between items-center shadow-2xl active:scale-95 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-3 -right-3 bg-[var(--accent)] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cart.items.length}</span>
                  )}
                </div>
                <span className="text-[10px] tracking-[0.2em]">Ver Pedido</span>
              </div>
              <span className="text-sm font-black text-[var(--paper)]/90">R$ {(cart.total() / 100).toFixed(2)}</span>
            </button>
          )}
          {activeView === 'cart' && (
            <button 
              disabled={cart.items.length === 0}
              onClick={() => setActiveView('checkout')}
              className="w-full bg-[var(--accent)] text-white p-6 rounded-[28px] font-black uppercase tracking-widest flex justify-between items-center shadow-2xl shadow-[var(--accent)]/30 disabled:opacity-50 disabled:grayscale transition-all duration-300"
            >
              <span className="text-[10px] tracking-[0.2em]">Próximo Passo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          {activeView === 'checkout' && (
            <div className="flex gap-4">
              {checkoutStep > 1 && (
                <button 
                  onClick={() => setCheckoutStep(prev => prev - 1)}
                  className="glass-card p-6 rounded-[24px] text-ink outline-none"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => {
                  if (checkoutStep < 3) setCheckoutStep(prev => prev + 1);
                  else finalizeOrder();
                }}
                className="flex-1 bg-[var(--accent)] text-white p-6 rounded-[28px] font-black uppercase tracking-widest flex justify-center items-center gap-3 shadow-2xl shadow-[var(--accent)]/30"
              >
                <span className="text-[10px] tracking-[0.2em]">{checkoutStep < 3 ? 'Continuar' : 'Finalizar agora'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Customization Selection Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[var(--paper)] max-w-md w-full rounded-t-[50px] px-8 pt-10 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-black/5"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="title-massive text-3xl text-high-contrast">{selectedProduct.name}</h3>
                  <p className="text-xs opacity-50 font-normal mt-2 leading-relaxed">{selectedProduct.description}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-3 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-8 max-h-[50vh] overflow-y-auto no-scrollbar pb-10">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="meta-label">Adicionais Premium</h4>
                    <span className="bg-[var(--accent)]/5 px-3 py-1 rounded-full text-[8px] font-black text-[var(--accent)]">OPCIONAL</span>
                  </div>
                  <div className="space-y-4">
                    {selectedProduct.options?.map((opt: any) => (
                      <button 
                        key={opt.id}
                        onClick={() => {
                          if (selectedOptions.find(o => o.id === opt.id)) {
                            setSelectedOptions(selectedOptions.filter(o => o.id !== opt.id));
                          } else {
                            setSelectedOptions([...selectedOptions, opt]);
                          }
                        }}
                        className={`w-full flex justify-between items-center p-5 rounded-[24px] border transition-all duration-500 ${
                          selectedOptions.find(o => o.id === opt.id) ? 'bg-[var(--accent)]/5 border-[var(--accent)] shadow-sm' : 'glass-card'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-tight">{opt.name}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black opacity-40">+ R$ {(opt.price / 100).toFixed(2)}</span>
                           <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                             selectedOptions.find(o => o.id === opt.id) ? 'bg-[var(--accent)] border-[var(--accent)] text-white scale-110' : 'border-black/10'
                           }`}>
                             {selectedOptions.find(o => o.id === opt.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                           </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Retirar Ingredientes */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="meta-label">Preferências</h4>
                    <span className="bg-black/5 px-3 py-1 rounded-full text-[8px] font-black opacity-50">SEM CUSTO</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["Cebola", "Tomate", "Alface", "Ketchup"].map((ing) => (
                      <button 
                        key={ing}
                        onClick={() => {
                          const opt = { id: `remove-${ing}`, name: `Sem ${ing}`, price: 0 };
                          if (selectedOptions.find(o => o.id === opt.id)) {
                            setSelectedOptions(selectedOptions.filter(o => o.id !== opt.id));
                          } else {
                            setSelectedOptions([...selectedOptions, opt]);
                          }
                        }}
                        className={`flex justify-between items-center p-4 rounded-[20px] border transition-all duration-500 ${
                          selectedOptions.find(o => o.id === `remove-${ing}`) ? 'bg-[var(--danger)]/5 border-[var(--danger)]/30 scale-95 opacity-60' : 'glass-card'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase">{ing}</span>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          selectedOptions.find(o => o.id === `remove-${ing}`) ? 'bg-[var(--danger)] border-[var(--danger)] text-white' : 'border-black/5'
                        }`}>
                          {selectedOptions.find(o => o.id === `remove-${ing}`) && <X className="w-3 h-3" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-6 border-t border-black/5">
                  <div className="flex justify-between items-center">
                    <span className="meta-label">Total Customizado</span>
                    <span className="text-3xl font-display font-black text-[var(--accent)] tracking-tighter">R$ {(currentPrice / 100).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={addToCartInternal}
                    className="w-full bg-[var(--ink)] text-white p-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all duration-300"
                  >
                    Adicionar ao Pedido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
