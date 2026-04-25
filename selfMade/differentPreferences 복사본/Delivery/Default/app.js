document.addEventListener('DOMContentLoaded', () => {
    const data = window.mockData;
    let cart = [];
    let currentRestaurant = null;
    let activeCategory = 'all';

    // Elements
    const views = {
        home: document.getElementById('home-view'),
        detail: document.getElementById('detail-view'),
        cart: document.getElementById('cart-view'),
        status: document.getElementById('status-view'),
        profile: document.getElementById('profile-view')
    };

    const restaurantList = document.getElementById('restaurant-list');
    const categoriesList = document.getElementById('categories-list');
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Initialization ---
    function init() {
        renderCategories();
        renderRestaurants();
        setupEventListeners();
    }

    // --- Rendering Functions ---

    function renderCategories() {
        categoriesList.innerHTML = data.categories.map(cat => `
            <div class="category-item ${cat.id === activeCategory ? 'active' : ''}" data-id="${cat.id}">
                <div class="category-icon">${cat.icon}</div>
                <span class="category-name">${cat.name}</span>
            </div>
        `).join('');

        categoriesList.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                activeCategory = item.dataset.id;
                renderCategories();
                renderRestaurants();
            });
        });
    }

    function renderRestaurants(filter = '') {
        const filtered = data.restaurants.filter(r => {
            const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
            const matchesSearch = r.name.toLowerCase().includes(filter.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        restaurantList.innerHTML = filtered.map(r => `
            <div class="restaurant-card" data-id="${r.id}">
                <img src="${r.image}" class="restaurant-image" alt="${r.name}">
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${r.name}</h3>
                    <div class="restaurant-meta">
                        <span class="rating">⭐ ${r.rating} (${r.reviews})</span>
                        <span>•</span>
                        <span>${r.deliveryTime}</span>
                        <span>•</span>
                        <span>${r.deliveryFee}</span>
                    </div>
                </div>
            </div>
        `).join('');

        restaurantList.querySelectorAll('.restaurant-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                showRestaurantDetail(id);
            });
        });
    }

    function showRestaurantDetail(id) {
        currentRestaurant = data.restaurants.find(r => r.id === id);
        const detailContent = document.getElementById('restaurant-details-content');
        
        detailContent.innerHTML = `
            <div class="restaurant-detail-header">
                <img src="${currentRestaurant.image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 20px; margin-bottom: 20px;">
                <h1>${currentRestaurant.name}</h1>
                <p style="color: var(--text-muted); margin-bottom: 20px;">${currentRestaurant.category.charAt(0).toUpperCase() + currentRestaurant.category.slice(1)} • ${currentRestaurant.rating} Rating</p>
            </div>
            <h2>Menu</h2>
            <div class="menu-list" style="margin-top: 16px;">
                ${currentRestaurant.menu.map(item => `
                    <div class="menu-item">
                        <img src="${item.image}" class="menu-item-img" alt="${item.name}">
                        <div class="menu-item-info">
                            <div class="menu-item-name">${item.name}</div>
                            <div class="menu-item-desc">${item.description}</div>
                            <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <button class="add-btn" data-id="${item.id}">+</button>
                    </div>
                `).join('')}
            </div>
        `;

        detailContent.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = parseInt(btn.dataset.id);
                addToCart(itemId);
            });
        });

        switchView('detail');
    }

    function addToCart(itemId) {
        const item = currentRestaurant.menu.find(m => m.id === itemId);
        const existing = cart.find(c => c.id === itemId);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...item, quantity: 1, restaurantName: currentRestaurant.name });
        }

        updateCartUI();
        
        // Visual feedback
        const btn = document.querySelector(`.add-btn[data-id="${itemId}"]`);
        if (btn) {
            btn.innerHTML = '✓';
            btn.style.background = 'var(--success)';
            setTimeout(() => {
                btn.innerHTML = '+';
                btn.style.background = 'var(--primary)';
            }, 1000);
        }
    }

    function updateCartUI() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (count > 0) {
            cartBtn.style.display = 'flex';
            cartCount.textContent = `${count} Item${count > 1 ? 's' : ''}`;
            cartTotal.textContent = `$${total.toFixed(2)}`;
        } else {
            cartBtn.style.display = 'none';
        }
    }

    function renderCart() {
        const cartItemsList = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<div style="text-align: center; margin-top: 50px;"><span style="font-size: 64px;">🛒</span><p style="margin-top: 16px; color: var(--text-muted);">Your basket is empty</p></div>';
            cartSummary.style.display = 'none';
            document.getElementById('checkout-btn').style.display = 'none';
            return;
        }

        cartItemsList.innerHTML = cart.map(item => `
            <div class="menu-item">
                <div class="menu-item-info">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ccc; background: white;">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ccc; background: white;">+</button>
                </div>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const fee = 2.99;
        const total = subtotal + fee;

        cartSummary.style.display = 'block';
        document.getElementById('checkout-btn').style.display = 'block';
        cartSummary.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
                <span>Delivery Fee</span>
                <span>$${fee.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 18px;">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
    }

    // Global qty update helper
    window.updateQty = (id, delta) => {
        const item = cart.find(c => c.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(c => c.id !== id);
            }
        }
        updateCartUI();
        renderCart();
    };

    // --- Navigation ---

    function switchView(viewName) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        views[viewName].classList.add('active');
        
        // Update nav bar active state
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.id === `nav-${viewName}`) item.classList.add('active');
        });

        // Auto-scroll to top
        window.scrollTo(0, 0);
    }

    function setupEventListeners() {
        // Extra interactive elements
        document.querySelector('.section-header span').addEventListener('click', () => {
            activeCategory = 'all';
            renderCategories();
            renderRestaurants();
            window.scrollTo({ top: 300, behavior: 'smooth' });
        });

        document.querySelector('.location-value').addEventListener('click', () => {
            const newAddr = prompt("Enter new delivery address:", data.user.address);
            if (newAddr) {
                data.user.address = newAddr;
                document.querySelector('.location-value').innerText = `📍 ${newAddr} ▼`;
            }
        });

        // Navigation clicks
        document.getElementById('nav-home').addEventListener('click', () => switchView('home'));
        document.getElementById('nav-profile').addEventListener('click', () => switchView('profile'));
        document.getElementById('nav-search').addEventListener('click', () => {
            switchView('home');
            document.getElementById('search-input').focus();
        });
        document.getElementById('nav-orders').addEventListener('click', () => {
            // Mock orders view - just show status if there's an active one, else stay home
            if (cart.length > 0) switchView('cart');
            else alert("No active orders. Try ordering some food! 🍕");
        });

        // Back buttons
        document.getElementById('back-to-home').addEventListener('click', () => switchView('home'));
        document.getElementById('back-from-cart').addEventListener('click', () => switchView('home'));
        document.getElementById('back-from-profile').addEventListener('click', () => switchView('home'));
        document.getElementById('profile-btn').addEventListener('click', () => switchView('profile'));
        
        // Cart click
        cartBtn.addEventListener('click', () => {
            renderCart();
            switchView('cart');
        });

        // Checkout simulation
        document.getElementById('checkout-btn').addEventListener('click', () => {
            simulateOrderProcess();
        });

        document.getElementById('back-to-home-final').addEventListener('click', () => {
            cart = [];
            updateCartUI();
            switchView('home');
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            renderRestaurants(e.target.value);
        });
    }

    function simulateOrderProcess() {
        switchView('status');
        
        const step2 = document.getElementById('step-2');
        const step3 = document.getElementById('step-3');
        const statusText = document.querySelector('#status-view h2');
        const statusEmoji = document.querySelector('.status-animation');

        setTimeout(() => {
            step2.classList.add('completed');
            step2.querySelector('.step-check').innerHTML = '✓';
            statusText.innerText = "Chef is cooking...";
            statusEmoji.innerText = "🍳";
        }, 3000);

        setTimeout(() => {
            step3.classList.add('completed');
            step3.querySelector('.step-check').innerHTML = '✓';
            statusText.innerText = "Rider is on the way!";
            statusEmoji.innerText = "🛵";
        }, 6000);

        setTimeout(() => {
            statusText.innerText = "Enjoy your meal!";
            statusEmoji.innerText = "😋";
            statusEmoji.classList.remove('rotating'); // If I had a class for it
        }, 9000);
    }

    init();
});
