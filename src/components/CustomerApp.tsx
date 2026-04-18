import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, ChevronRight, Plus, Minus, Search, Clock, 
  MapPin, CheckCircle2, ArrowLeft, User, CreditCard, 
  Banknote, X, Info
} from 'lucide-react';
import { useCart } from '../store/useCart';

const ProductCard = memo(({ product, onSelect }: { product: any, onSelect: (p: any) => void }) => (
  <div 
    className="bg-white/5 rounded-[32px] overflow-hidden border border-white/5 hover:border-[#00ff00]/30 transition-all group flex flex-col gpu"
  >
    <div className="relative aspect-square overflow-hidden">
      <img 
        src={product.image_url} 
        alt={product.name} 
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        <span className="text-xs font-black text-[#00ff00]">R$ {(product.price / 100).toFixed(2)}</span>
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-1">
      <div className="flex-1 mb-6">
        <h3 className="font-display text-xl uppercase tracking-tighter mb-2">{product.name}</h3>
        <p className="text-xs opacity-40 leading-relaxed font-light">{product.description}</p>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(product);
        }}
        className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#00ff00] transition-colors"
      >
        <Plus className="w-4 h-4" /> ADICIONAR AO CARRINHO
      </button>
    </div>
  </div>
));

export default function CustomerApp() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
        setProducts(data.products);
        if (data.categories.length > 0) setActiveCategory(data.categories[0].id);
        setLoading(false);
      });
  }, []);

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

  if (loading) return <div className="p-8 text-center text-white/50 uppercase tracking-widest text-xs h-screen flex items-center justify-center">Carregando Cardápio...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Dynamic Header */}
      <header className="p-6 pb-2">
        <div className="flex justify-between items-start mb-6">
          <div onClick={() => setActiveView('menu')} className="cursor-pointer">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Global Burger</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 20-35 min • $ 5.00
            </p>
          </div>
          {activeView === 'menu' && (
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs outline-none w-32 focus:w-48 transition-all focus:border-[#00ff00]"
              />
            </div>
          )}
          {activeView !== 'menu' && (
            <button onClick={() => setActiveView('menu')} className="bg-white/10 p-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {activeView === 'menu' && (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                  activeCategory === cat.id && !searchQuery ? 'bg-[#00ff00] text-black' : 'bg-white/10 text-white/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeView === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 opacity-30 text-xs uppercase font-bold tracking-widest">Nenhum item encontrado</div>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                ))
              )}
            </motion.div>
          )}

          {activeView === 'cart' && (
            <motion.div key="cart" className="space-y-4 pt-4">
              <h2 className="text-xl font-bold uppercase tracking-tight mb-4">Seu Carrinho</h2>
              {cart.items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-10 mb-4" />
                  <p className="opacity-40 uppercase text-[10px] font-bold tracking-widest">Carrinho vazio</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.items.map(item => (
                    <div key={item.id} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-bold uppercase">{item.name}</h4>
                          {item.selectedOptions.map(opt => (
                            <span key={opt.id} className="text-[10px] text-[#00ff00] block">+ {opt.name}</span>
                          ))}
                        </div>
                        <span className="text-sm font-black text-[#00ff00]">R$ {(item.price * item.quantity / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-white/10 rounded-full"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-white/10 rounded-full"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'checkout' && (
            <motion.div key="checkout" className="space-y-6 pt-4">
               {checkoutStep === 1 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                   <h3 className="text-xl font-bold uppercase">1. Entrega</h3>
                   <div className="space-y-3">
                     <input 
                      type="text" 
                      placeholder="CEP" 
                      maxLength={8}
                      value={address.cep}
                      onChange={(e) => handleCEPChange(e.target.value)}
                      className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-sm outline-none focus:border-[#00ff00]" 
                     />
                     <input 
                      type="text" 
                      placeholder="Rua / Logradouro" 
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-sm outline-none focus:border-[#00ff00]" 
                     />
                     <div className="grid grid-cols-2 gap-3">
                       <input 
                        type="text" 
                        placeholder="Número" 
                        value={address.number}
                        onChange={(e) => setAddress({...address, number: e.target.value})}
                        className="bg-white/5 p-4 rounded-2xl border border-white/10 text-sm outline-none" 
                       />
                       <input 
                        type="text" 
                        placeholder="Ap / Bloco" 
                        value={address.complement}
                        onChange={(e) => setAddress({...address, complement: e.target.value})}
                        className="bg-white/5 p-4 rounded-2xl border border-white/10 text-sm outline-none" 
                       />
                     </div>
                   </div>
                 </motion.div>
               )}

               {checkoutStep === 2 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                   <h3 className="text-xl font-bold uppercase">2. Identificação</h3>
                   <div className="space-y-3">
                     <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                       <User className="w-5 h-5 opacity-40" />
                       <input 
                        type="text" 
                        placeholder="Seu Nome" 
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                        className="bg-transparent text-sm outline-none flex-1" 
                       />
                     </div>
                     <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                       <Clock className="w-5 h-5 opacity-40" />
                       <input 
                        type="tel" 
                        placeholder="Telefone (WhatsApp)" 
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                        className="bg-transparent text-sm outline-none flex-1" 
                       />
                     </div>
                   </div>
                 </motion.div>
               )}

               {checkoutStep === 3 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                   <h3 className="text-xl font-bold uppercase">3. Pagamento</h3>
                   <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'PIX', label: 'PIX (Automático)', icon: CheckCircle2 },
                      { id: 'CARD', label: 'Cartão (Entregador)', icon: CreditCard },
                      { id: 'CASH', label: 'Dinheiro', icon: Banknote },
                    ].map(method => (
                      <button 
                        key={method.id}
                        onClick={() => setPayment({...payment, method: method.id})}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          payment.method === method.id ? 'bg-[#00ff00] border-[#00ff00] text-black font-bold' : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <method.icon className="w-5 h-5" />
                        <span className="text-xs uppercase tracking-widest">{method.label}</span>
                      </button>
                    ))}
                   </div>
                   {payment.method === 'CASH' && (
                     <motion.input 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text" 
                      placeholder="Troco para quanto?" 
                      className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-sm outline-none" 
                     />
                   )}
                 </motion.div>
               )}
            </motion.div>
          )}

          {activeView === 'success' && (
            <motion.div key="success" className="text-center py-10 space-y-6">
              <div className="relative inline-block">
                <CheckCircle2 className="w-24 h-24 text-[#00ff00] mx-auto" />
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 border-4 border-[#00ff00] rounded-full"
                />
              </div>
              <h2 className="text-3xl font-black uppercase text-[#00ff00]">Sucesso!</h2>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-2 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Status do Pedido</p>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
                   <p className="text-sm font-bold">PREPARANDO NA COZINHA</p>
                </div>
                <p className="text-xs opacity-60">Seu Delivery Global chegará em aproximadamente 30 minutos.</p>
              </div>
              <div className="space-y-3">
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  className="w-full bg-[#25D366] text-white p-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
                >
                  Confirmar via WhatsApp
                </a>
                <button 
                  onClick={() => setActiveView('menu')}
                  className="w-full bg-white/5 text-white/50 p-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest"
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
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
          {activeView === 'menu' && (
            <button 
              onClick={() => setActiveView('cart')}
              className="w-full bg-[#00ff00] text-black p-4 rounded-2xl font-black uppercase tracking-widest flex justify-between items-center shadow-[0_0_30px_rgba(0,255,0,0.2)] active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-[#00ff00] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.items.length}</span>
                  )}
                </div>
                <span className="text-xs">VER CARRINHO</span>
              </div>
              <span className="text-sm">R$ {(cart.total() / 100).toFixed(2)}</span>
            </button>
          )}
          {activeView === 'cart' && (
            <button 
              disabled={cart.items.length === 0}
              onClick={() => setActiveView('checkout')}
              className="w-full bg-[#00ff00] text-black p-4 rounded-2xl font-black uppercase tracking-widest flex justify-between items-center shadow-[0_0_30px_rgba(0,255,0,0.2)] disabled:opacity-50 disabled:grayscale transition-all"
            >
              <span className="text-xs">IR PARA PAGAMENTO</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          {activeView === 'checkout' && (
            <div className="flex gap-4">
              {checkoutStep > 1 && (
                <button 
                  onClick={() => setCheckoutStep(prev => prev - 1)}
                  className="bg-white/10 p-4 rounded-2xl text-white outline-none"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => {
                  if (checkoutStep < 3) setCheckoutStep(prev => prev + 1);
                  else finalizeOrder();
                }}
                className="flex-1 bg-[#00ff00] text-black p-4 rounded-2xl font-black uppercase tracking-widest flex justify-center items-center gap-2"
              >
                <span>{checkoutStep < 3 ? 'CONTINUAR' : 'CONCLUIR PEDIDO'}</span>
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-[#111] max-w-md w-full rounded-t-[40px] px-6 pt-8 pb-10 border-t border-white/10"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">{selectedProduct.name}</h3>
                  <p className="text-xs opacity-50 mt-1">{selectedProduct.description}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar pb-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Adicionais</h4>
                    <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold">OPCIONAL</span>
                  </div>
                  <div className="space-y-3">
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
                        className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${
                          selectedOptions.find(o => o.id === opt.id) ? 'bg-[#00ff00]/10 border-[#00ff00]' : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase">{opt.name}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] opacity-60">+ R$ {(opt.price / 100).toFixed(2)}</span>
                           <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                             selectedOptions.find(o => o.id === opt.id) ? 'bg-[#00ff00] border-[#00ff00] text-black' : 'border-white/20'
                           }`}>
                             {selectedOptions.find(o => o.id === opt.id) && <CheckCircle2 className="w-3 h-3" />}
                           </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Retirar Ingredientes (Mock Section for "removing ingredients") */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Retirar Ingredientes</h4>
                    <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold">OPCIONAL</span>
                  </div>
                  <div className="space-y-3">
                    {["Cebola", "Tomate", "Alface", "Maionese"].map((ing) => (
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
                        className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${
                          selectedOptions.find(o => o.id === `remove-${ing}`) ? 'bg-[#ff4444]/10 border-[#ff4444]' : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase">{ing}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          selectedOptions.find(o => o.id === `remove-${ing}`) ? 'bg-[#ff4444] border-[#ff4444] text-white' : 'border-white/20'
                        }`}>
                          {selectedOptions.find(o => o.id === `remove-${ing}`) && <X className="w-3 h-3" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase opacity-50">Total do Item</span>
                    <span className="text-xl font-black text-[#00ff00]">R$ {(currentPrice / 100).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={addToCartInternal}
                    className="w-full bg-[#00ff00] text-black p-5 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    ADICIONAR AO CARRINHO
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
