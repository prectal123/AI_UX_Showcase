// Mock Data
const DATA = {
    categories: [
        { id: 'burger', name: 'Burgers', icon: '🍔' },
        { id: 'pizza', name: 'Pizza', icon: '🍕' },
        { id: 'sushi', name: 'Sushi', icon: '🍣' },
        { id: 'taco', name: 'Tacos', icon: '🌮' },
        { id: 'dessert', name: 'Desserts', icon: '🍰' },
        { id: 'drink', name: 'Drinks', icon: '🥤' }
    ],
    restaurants: [
        {
            id: 'res-1',
            name: 'Gourmet Burger Kitchen',
            category: 'burger',
            rating: 4.8,
            reviews: 1204,
            deliveryTime: '20-30 min',
            deliveryFee: '$1.99',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
            menu: [
                { id: 'm1-1', name: 'Truffle Royale Burger', desc: 'Wagyu beef, black truffle aioli, aged cheddar', price: 18.50 },
                { id: 'm1-2', name: 'Spicy Avocado Smash', desc: 'Crispy chicken, jalapenos, fresh avocado', price: 15.00 },
                { id: 'm1-3', name: 'Sweet Potato Fries', desc: 'Hand-cut with rosemary salt', price: 6.50 }
            ]
        },
        {
            id: 'res-2',
            name: 'Pizzaiolo Artisans',
            category: 'pizza',
            rating: 4.9,
            reviews: 856,
            deliveryTime: '30-45 min',
            deliveryFee: 'Free',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
            menu: [
                { id: 'm2-1', name: 'Margherita Burrata', desc: 'San Marzano tomatoes, fresh burrata, basil', price: 22.00 },
                { id: 'm2-2', name: 'Spicy Salami & Honey', desc: 'Soppressata, chili flakes, hot honey drizzle', price: 24.00 },
                { id: 'm2-3', name: 'Truffle Mushroom White', desc: 'Roasted mushrooms, truffle oil, ricotta', price: 26.00 }
            ]
        },
        {
            id: 'res-3',
            name: 'Sakura Zen Sushi',
            category: 'sushi',
            rating: 4.7,
            reviews: 2100,
            deliveryTime: '25-40 min',
            deliveryFee: '$2.50',
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
            menu: [
                { id: 'm3-1', name: 'Dragon Roll Supreme', desc: 'Shrimp tempura, eel, avocado top', price: 19.00 },
                { id: 'm3-2', name: 'Premium Omakase Set', desc: '12 pieces of chef\'s choice nigiri', price: 45.00 },
                { id: 'm3-3', name: 'Miso Glazed Salmon', desc: 'Pan-seared with seasonal greens', price: 28.00 }
            ]
        }
    ],
    orders: [
        { id: 'ORD-7721', restaurant: 'Gourmet Burger Kitchen', date: 'Yesterday', status: 'Delivered', total: '$42.50' }
    ]
};

// Application State
const state = {
    currentView: 'home',
    cart: [],
    selectedRestaurant: null,
    userAddress: '123 Skyline Terrace, Luxury District',
    orderHistory: [...DATA.orders]
};

// Selectors
const viewContainer = document.getElementById('view-container');
const cartPeekBar = document.getElementById('cart-peek-bar');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const bottomNavItems = document.querySelectorAll('.nav-item');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const notificationContainer = document.getElementById('notification-container');

// --- Core Functions ---

function init() {
    setupEventListeners();
    renderView('home');
    updateCartUI();
}

function setupEventListeners() {
    // Bottom Nav
    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            renderView(view);
            updateActiveNavItem(view);
        });
    });

    // Cart Peek
    document.getElementById('btn-view-cart').addEventListener('click', () => {
        renderCartModal();
    });

    // Close Modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Header buttons
    document.getElementById('btn-search-header').addEventListener('click', () => renderView('search'));
    document.getElementById('btn-profile-header').addEventListener('click', () => renderView('profile'));
    document.getElementById('btn-location').addEventListener('click', () => showNotification("Location settings coming soon!"));
}

function updateActiveNavItem(view) {
    bottomNavItems.forEach(item => {
        if (item.getAttribute('data-view') === view) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function renderView(view) {
    state.currentView = view;
    viewContainer.innerHTML = '';
    viewContainer.className = 'fade-in';

    switch (view) {
        case 'home':
            renderHome();
            break;
        case 'search':
            renderSearch();
            break;
        case 'orders':
            renderOrders();
            break;
        case 'profile':
            renderProfile();
            break;
        case 'restaurant':
            renderRestaurantDetail();
            break;
        case 'tracking':
            renderTrackingView();
            break;
    }
    window.scrollTo(0, 0);
}

// --- Views ---

function renderHome() {
    let html = `
        <div class="hero-section">
            <h1 style="font-size: 28px; margin-bottom: 8px;">Good Evening, Luxe.</h1>
            <p style="color: var(--text-dim); margin-bottom: 24px;">What's on your gourmet menu tonight?</p>
        </div>

        <div class="section-header">
            <h2>Categories</h2>
        </div>
        <div class="category-scroll">
            ${DATA.categories.map(cat => `
                <div class="category-item" onclick="window.filterByCategory('${cat.id}')">
                    <div class="category-icon">${cat.icon}</div>
                    <span>${cat.name}</span>
                </div>
            `).join('')}
        </div>

        <div class="section-header">
            <h2>Popular Near You</h2>
            <button class="text-btn" style="color: var(--primary-color); background: none; border: none; font-weight: 600;">View All</button>
        </div>
        <div class="restaurant-grid">
            ${DATA.restaurants.map(res => `
                <div class="restaurant-card" onclick="window.openRestaurant('${res.id}')">
                    <div class="card-image" style="background-image: url('${res.image}')">
                        <div class="badge">PROMO</div>
                    </div>
                    <div class="card-content">
                        <div class="card-title">${res.name}</div>
                        <div class="card-meta">
                            <span class="rating">★ ${res.rating}</span>
                            <span>•</span>
                            <span>${res.deliveryTime}</span>
                            <span>•</span>
                            <span>${res.deliveryFee} fee</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    viewContainer.innerHTML = html;
}

function renderSearch() {
    viewContainer.innerHTML = `
        <div class="search-page">
            <div class="search-bar-container" style="position: sticky; top: var(--header-height); background: var(--bg-color); padding: 10px 0; z-index: 10;">
                <input type="text" placeholder="Search for food or restaurants..." 
                    style="width: 100%; background: var(--surface-color); border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; color: white; outline: none; font-size: 16px;">
            </div>
            <div class="section-header"><h2>Recent Searches</h2></div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <span class="search-tag" style="background: var(--surface-light); padding: 8px 16px; border-radius: 20px; font-size: 14px;">Sushi Rolls</span>
                <span class="search-tag" style="background: var(--surface-light); padding: 8px 16px; border-radius: 20px; font-size: 14px;">Vegan Pizza</span>
                <span class="search-tag" style="background: var(--surface-light); padding: 8px 16px; border-radius: 20px; font-size: 14px;">Artisan Coffee</span>
            </div>
            <div class="section-header"><h2>Trending Dishes</h2></div>
            <div class="dish-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="dish-card" style="background: var(--surface-color); border-radius: 12px; height: 120px; display: flex; align-items: center; justify-content: center; font-weight: 600;">Ramen 🍜</div>
                <div class="dish-card" style="background: var(--surface-color); border-radius: 12px; height: 120px; display: flex; align-items: center; justify-content: center; font-weight: 600;">Pasta 🍝</div>
            </div>
        </div>
    `;
}

function renderRestaurantDetail() {
    const res = state.selectedRestaurant;
    if (!res) return renderView('home');

    viewContainer.innerHTML = `
        <div class="restaurant-detail">
            <div class="back-nav" onclick="window.renderView('home')" style="margin-bottom: 20px; color: var(--primary-color); cursor: pointer; font-weight: 600;">← Back to Home</div>
            <div class="res-banner" style="height: 200px; border-radius: 20px; background-image: url('${res.image}'); background-size: cover; background-position: center; margin-bottom: 20px;"></div>
            <h1>${res.name}</h1>
            <div class="card-meta" style="margin-bottom: 24px;">
                <span class="rating">★ ${res.rating} (${res.reviews} reviews)</span>
                <span>•</span>
                <span>${res.deliveryTime}</span>
            </div>
            
            <div class="menu-sections">
                <h2 style="border-bottom: 2px solid var(--primary-color); display: inline-block; padding-bottom: 4px; margin-bottom: 20px;">Menu</h2>
                ${res.menu.map(item => `
                    <div class="menu-item">
                        <div class="menu-info">
                            <div class="menu-name">${item.name}</div>
                            <div class="menu-desc">${item.desc}</div>
                            <div class="menu-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <button class="menu-add-btn" onclick="window.addToCart('${res.id}', '${item.id}')">+</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderOrders() {
    viewContainer.innerHTML = `
        <div class="orders-page">
            <h1>Your Orders</h1>
            <div class="order-tabs" style="display: flex; gap: 20px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span class="tab active" style="padding-bottom: 12px; border-bottom: 2px solid var(--primary-color); font-weight: 700;">Active</span>
                <span class="tab" style="padding-bottom: 12px; color: var(--text-dim);">Past Orders</span>
            </div>
            
            ${state.orderHistory.filter(o => o.status !== 'Delivered').length === 0 ? 
                `<div style="text-align: center; padding: 40px; color: var(--text-dim);">No active orders</div>` : ''}

            <div class="order-list">
                ${state.orderHistory.map(order => `
                    <div class="order-card" style="background: var(--surface-color); padding: 20px; border-radius: 16px; margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                                <div style="font-weight: 700; font-size: 18px;">${order.restaurant}</div>
                                <div style="font-size: 12px; color: var(--text-dim);">${order.id} • ${order.date}</div>
                            </div>
                            <span style="background: ${order.status === 'Delivered' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 179, 0, 0.1)'}; color: ${order.status === 'Delivered' ? 'var(--success)' : 'var(--primary-color)'}; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700;">${order.status}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); pt-12; margin-top: 12px; padding-top: 12px;">
                            <span style="font-weight: 600;">Total: ${order.total}</span>
                            <button onclick="window.renderView('tracking')" class="secondary-btn" style="background: var(--surface-light); border: none; color: white; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">Track Order</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderTrackingView() {
    viewContainer.innerHTML = `
        <div class="tracking-page">
            <div class="back-nav" onclick="window.renderView('orders')" style="margin-bottom: 20px; color: var(--primary-color); cursor: pointer; font-weight: 600;">← Back to Orders</div>
            <h1>Track Order</h1>
            <div class="tracking-card" style="background: var(--surface-color); padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 30px;">
                <div class="status-icon" style="font-size: 64px; margin-bottom: 20px;">👨‍🍳</div>
                <h2 style="margin-bottom: 8px;">Preparing your food</h2>
                <p style="color: var(--text-dim);">Estimated arrival: 8:45 PM</p>
                
                <div class="progress-steps" style="margin-top: 40px; display: flex; justify-content: space-between; position: relative;">
                    <div style="position: absolute; top: 15px; left: 10%; right: 10%; height: 2px; background: rgba(255,255,255,0.1); z-index: 1;"></div>
                    <div style="position: absolute; top: 15px; left: 10%; width: 33%; height: 2px; background: var(--primary-color); z-index: 2;"></div>
                    
                    <div class="step" style="z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <div style="width: 32px; height: 32px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--text-dark);">✓</div>
                        <span style="font-size: 11px; font-weight: 700;">Confirmed</span>
                    </div>
                    <div class="step" style="z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <div style="width: 32px; height: 32px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--text-dark);">2</div>
                        <span style="font-size: 11px; font-weight: 700; color: var(--primary-color);">Preparing</span>
                    </div>
                    <div class="step" style="z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <div style="width: 32px; height: 32px; background: var(--surface-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">3</div>
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-dim);">On the way</span>
                    </div>
                    <div class="step" style="z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <div style="width: 32px; height: 32px; background: var(--surface-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">4</div>
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-dim);">Enjoy!</span>
                    </div>
                </div>
            </div>
            
            <div class="delivery-partner" style="display: flex; align-items: center; gap: 15px; padding: 20px; background: var(--surface-light); border-radius: 16px;">
                <div style="width: 50px; height: 50px; background: #ddd; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🚲</div>
                <div style="flex: 1;">
                    <div style="font-weight: 700;">Marco Polo</div>
                    <div style="font-size: 12px; color: var(--text-dim);">Your delivery hero</div>
                </div>
                <button class="icon-btn" style="background: var(--primary-color); color: var(--text-dark);">📞</button>
            </div>
        </div>
    `;
}

function renderProfile() {
    viewContainer.innerHTML = `
        <div class="profile-page">
            <div class="profile-header" style="display: flex; align-items: center; gap: 20px; margin-bottom: 40px;">
                <div class="avatar" style="width: 80px; height: 80px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">👑</div>
                <div>
                    <h1 style="margin: 0;">Luxe Member</h1>
                    <p style="color: var(--text-dim); margin: 0;">luxe.user@example.com</p>
                </div>
            </div>
            
            <div class="profile-menu">
                <div class="menu-link" style="display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                    <span>Payment Methods</span>
                    <span>→</span>
                </div>
                <div class="menu-link" style="display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                    <span>Addresses</span>
                    <span>→</span>
                </div>
                <div class="menu-link" style="display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                    <span>Help Center</span>
                    <span>→</span>
                </div>
                <div class="menu-link" style="display: flex; justify-content: space-between; padding: 20px 0; color: #ff5252; font-weight: 600; cursor: pointer;">
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    `;
}

// --- Cart Logic ---

function addToCart(resId, itemId) {
    const res = DATA.restaurants.find(r => r.id === resId);
    const item = res.menu.find(i => i.id === itemId);
    
    state.cart.push({
        ...item,
        restaurantName: res.name,
        restaurantId: res.id
    });
    
    showNotification(`Added ${item.name} to cart!`);
    updateCartUI();
}

function updateCartUI() {
    const count = state.cart.length;
    if (count > 0) {
        cartPeekBar.classList.remove('hidden');
        cartCountEl.innerText = `${count} ${count === 1 ? 'item' : 'items'}`;
        const total = state.cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalEl.innerText = `$${total.toFixed(2)}`;
    } else {
        cartPeekBar.classList.add('hidden');
    }
}

function renderCartModal() {
    if (state.cart.length === 0) {
        showNotification("Your cart is empty!");
        return;
    }

    const total = state.cart.reduce((sum, item) => sum + item.price, 0);
    const fee = 1.99;
    const finalTotal = total + fee;

    modalContent.innerHTML = `
        <h2 style="margin-top: 0;">My Cart</h2>
        <div class="cart-items" style="margin-bottom: 24px;">
            ${state.cart.map((item, idx) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 12px; color: var(--text-dim);">${item.restaurantName}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-weight: 700;">$${item.price.toFixed(2)}</span>
                        <button onclick="window.removeFromCart(${idx})" style="background: none; border: none; color: #ff5252; cursor: pointer;">✕</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary" style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Subtotal</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Delivery Fee</span>
                <span>$${fee.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 800; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                <span>Total</span>
                <span style="color: var(--primary-color);">$${finalTotal.toFixed(2)}</span>
            </div>
        </div>
        <button id="btn-checkout" class="primary-btn" style="width: 100%; height: 60px; font-size: 18px; background: var(--primary-color); color: var(--text-dark);">Place Order</button>
    `;

    openModal();

    document.getElementById('btn-checkout').addEventListener('click', () => {
        placeOrder(finalTotal);
    });
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    renderCartModal();
    updateCartUI();
    if (state.cart.length === 0) closeModal();
}

function placeOrder(total) {
    const newOrder = {
        id: 'ORD-' + Math.floor(Math.random() * 9000 + 1000),
        restaurant: state.cart[0].restaurantName,
        date: 'Today',
        status: 'Preparing',
        total: `$${total.toFixed(2)}`
    };

    state.orderHistory.unshift(newOrder);
    state.cart = [];
    updateCartUI();
    closeModal();
    
    showNotification("Order placed successfully! 🚀");
    setTimeout(() => {
        renderView('orders');
        updateActiveNavItem('orders');
    }, 1000);
}

// --- Helpers ---

function openRestaurant(id) {
    state.selectedRestaurant = DATA.restaurants.find(r => r.id === id);
    renderView('restaurant');
}

function filterByCategory(catId) {
    showNotification(`Filtering for ${catId}...`);
    // In a real app, this would filter the list
}

function openModal() {
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function showNotification(msg) {
    const el = document.createElement('div');
    el.className = 'notification';
    el.innerText = msg;
    notificationContainer.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// Expose functions to global for inline onclicks (simpler for prototype)
window.renderView = renderView;
window.openRestaurant = openRestaurant;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.filterByCategory = filterByCategory;

// Start the app
init();
