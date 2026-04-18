export const FALLBACK_MENU = {
  categories: [
    { id: 'cat1', name: 'Hambúrgueres', sort_order: 1 },
    { id: 'cat2', name: 'Bebidas', sort_order: 2 },
    { id: 'cat3', name: 'Acompanhamentos', sort_order: 3 }
  ],
  products: [
    { 
      id: 'p1', 
      category_id: 'cat1', 
      name: 'Global Burger Clássico', 
      description: 'Pão brioche, carne 180g, queijo cheddar, alface e tomate.', 
      price: 3200, 
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      options: [
        { id: 'opt1', name: 'Extra Queijo', price: 300 },
        { id: 'opt2', name: 'Bacon Extra', price: 450 }
      ]
    },
    { 
      id: 'p2', 
      category_id: 'cat1', 
      name: 'Monster Bacon', 
      description: 'Blend especial, muito bacon crocante, maionese artesanal e cheddar.', 
      price: 4500, 
      image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      options: [
        { id: 'opt3', name: 'Ovo Frito', price: 250 },
        { id: 'opt4', name: 'Pimenta Jalapeño', price: 200 }
      ]
    },
    { 
      id: 'p3', 
      category_id: 'cat2', 
      name: 'Coca-Cola Latinha', 
      description: '350ml bem gelado.', 
      price: 600, 
      image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
      options: []
    },
    { 
      id: 'p4', 
      category_id: 'cat3', 
      name: 'Batata Rústica XL', 
      description: 'Crocante por fora, macia por dentro com ervas finas.', 
      price: 1800, 
      image_url: 'https://images.unsplash.com/photo-1573016608964-b49ca021ca66?auto=format&fit=crop&w=400&q=80',
      options: []
    }
  ]
};
