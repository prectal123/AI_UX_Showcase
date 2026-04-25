const mockData = {
  categories: [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'sushi', name: 'Sushi', icon: '🍣' },
    { id: 'taco', name: 'Taco', icon: '🌮' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' },
    { id: 'drink', name: 'Drinks', icon: '🥤' }
  ],
  restaurants: [
    {
      id: 1,
      name: 'Burger King Royale',
      rating: 4.8,
      reviews: 1240,
      deliveryTime: '20-30 min',
      deliveryFee: '$2.99',
      category: 'burger',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
      menu: [
        { id: 101, name: 'Truffle Bacon Burger', description: 'Double beef patty, truffle mayo, crispy bacon, aged cheddar.', price: 14.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop' },
        { id: 102, name: 'Classic Cheeseburger', description: 'Beef patty, lettuce, tomato, onion, pickles, special sauce.', price: 9.99, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop' },
        { id: 103, name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce, bacon, and chives.', price: 5.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 2,
      name: 'Bella Italia',
      rating: 4.7,
      reviews: 850,
      deliveryTime: '35-45 min',
      deliveryFee: '$3.50',
      category: 'pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      menu: [
        { id: 201, name: 'Margherita Pizza', description: 'Fresh tomato sauce, mozzarella, basil, extra virgin olive oil.', price: 12.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=400&auto=format&fit=crop' },
        { id: 202, name: 'Pepperoni Feast', description: 'Double pepperoni, mozzarella, spicy honey drizzle.', price: 15.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400&auto=format&fit=crop' },
        { id: 203, name: 'Tiramisu', description: 'Traditional Italian dessert with coffee-soaked ladyfingers.', price: 6.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 3,
      name: 'Sakura Sushi',
      rating: 4.9,
      reviews: 2100,
      deliveryTime: '25-35 min',
      deliveryFee: '$4.99',
      category: 'sushi',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop',
      menu: [
        { id: 301, name: 'Dragon Roll', description: 'Shrimp tempura, avocado, topped with eel and unagi sauce.', price: 16.99, image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=400&auto=format&fit=crop' },
        { id: 302, name: 'Salmon Sashimi (6pcs)', description: 'Fresh Atlantic salmon slices.', price: 13.99, image: 'https://images.unsplash.com/photo-1534482421-0d4714b0e588?q=80&w=400&auto=format&fit=crop' },
        { id: 303, name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed.', price: 3.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop' }
      ]
    },
    {
      id: 4,
      name: 'Taco Loco',
      rating: 4.6,
      reviews: 540,
      deliveryTime: '15-25 min',
      deliveryFee: '$1.99',
      category: 'taco',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop',
      menu: [
        { id: 401, name: 'Al Pastor Tacos (3pcs)', description: 'Marinated pork, pineapple, onion, cilantro.', price: 10.99, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400&auto=format&fit=crop' },
        { id: 402, name: 'Guacamole & Chips', description: 'Hand-mashed avocado with fresh tortilla chips.', price: 7.99, image: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?q=80&w=400&auto=format&fit=crop' }
      ]
    }
  ],
  user: {
    name: 'Alex Johnson',
    address: '123 Main St, Tech City',
    orders: []
  }
};

window.mockData = mockData;
