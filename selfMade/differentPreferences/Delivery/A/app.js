// Mock Data
const DATA = {
    restaurants: [
        {
            id: 1,
            name: "버거 킹덤 (Burger Kingdom)",
            category: "Burger",
            rating: 4.8,
            time: "20-30분",
            deliveryFee: "2,000원",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            badge: "베스트",
            menu: [
                { id: 101, name: "더블 치즈 스택 버거", price: 12500, desc: "육즙 가득한 패티 두 장과 진한 체다 치즈의 만남", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&q=80" },
                { id: 102, name: "트러플 머쉬룸 버거", price: 13900, desc: "깊은 풍미의 트러플 오일과 구운 양송이 버섯", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80" },
                { id: 103, name: "케이준 스파이시 감자튀김", price: 3500, desc: "바삭하고 매콤한 케이준 시즈닝 감자튀김", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80" }
            ]
        },
        {
            id: 2,
            name: "스시 젠 (Sushi Zen)",
            category: "Sushi",
            rating: 4.9,
            time: "35-45분",
            deliveryFee: "3,000원",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
            badge: "인기",
            menu: [
                { id: 201, name: "특선 모듬 스시 (12pcs)", price: 22000, desc: "오늘의 가장 신선한 횟감으로 구성된 프리미엄 세트", image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=400&q=80" },
                { id: 202, name: "연어 & 아보카도 롤", price: 15000, desc: "부드러운 연어와 고소한 아보카도의 조화", image: "https://images.unsplash.com/photo-1559466273-d95e72debaf8?auto=format&fit=crop&w=400&q=80" }
            ]
        },
        {
            id: 3,
            name: "피자 나폴리 (Pizza Napoli)",
            category: "Pizza",
            rating: 4.7,
            time: "25-35분",
            deliveryFee: "1,500원",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
            badge: null,
            menu: [
                { id: 301, name: "마르게리따 피자", price: 18000, desc: "생바질, 모짜렐라 치즈, 토마토 소스의 클래식한 맛", image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=400&q=80" },
                { id: 302, name: "콰트로 포르마지", price: 21000, desc: "네 가지 치즈의 깊고 진한 맛을 느낄 수 있는 피자", image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=400&q=80" }
            ]
        }
    ],
    categories: ["전체", "1인분", "치킨", "버거", "피자", "일식", "한식", "디저트"]
};

// Application State
let state = {
    currentView: 'home', // 'home', 'detail', 'orders', 'profile', 'search', 'tracking'
    selectedRestaurant: null,
    cart: [],
    searchQuery: '',
    activeCategory: '전체'
};

// DOM Elements
const appContent = document.getElementById('app-content');
const cartBtn = document.getElementById('cart-btn');
const cartTotal = document.getElementById('cart-total');
const navItems = document.querySelectorAll('.nav-item');

// Initialize
function init() {
    renderHome();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.id.replace('nav-', '');
            navigateTo(view);
        });
    });

    cartBtn.addEventListener('click', () => {
        alert(`장바구니 총액: ${calculateTotal().toLocaleString()}원\n주문하시겠습니까?`);
        completeOrder();
    });
}

// Navigation Logic
function navigateTo(view, data = null) {
    state.currentView = view;
    
    // Update Nav UI
    navItems.forEach(item => {
        item.classList.toggle('active', item.id === `nav-${view}`);
    });

    // Render View
    switch(view) {
        case 'home':
            renderHome();
            break;
        case 'detail':
            state.selectedRestaurant = data;
            renderDetail(data);
            break;
        case 'orders':
            renderOrders();
            break;
        case 'profile':
            renderProfile();
            break;
        case 'search':
            renderHome();
            setTimeout(() => {
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.focus();
            }, 100);
            break;
        case 'tracking':
            renderTracking();
            break;
    }

    // Scroll to top
    window.scrollTo(0, 0);
    
    // Accessibility: Announcement (Simplified)
    console.log(`Navigated to ${view}`);
}

// Renderers
function renderHome() {
    const filteredRestaurants = DATA.restaurants.filter(res => {
        const matchesCategory = state.activeCategory === '전체' || res.category === state.activeCategory;
        const matchesSearch = res.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    let html = `
        <div class="search-container">
            <span class="search-icon">🔍</span>
            <input type="text" id="search-input" class="search-input" placeholder="무엇을 먹고 싶나요?" value="${state.searchQuery}">
        </div>
        
        <div class="categories-wrapper" role="tablist">
            ${DATA.categories.map(cat => `
                <button class="category-pill ${state.activeCategory === cat ? 'active' : ''}" 
                        role="tab" onclick="setCategory('${cat}')">
                    ${cat}
                </button>
            `).join('')}
        </div>

        <h2 class="section-title">
            ${state.searchQuery || state.activeCategory !== '전체' ? '검색 결과' : '지금 인기 있는 맛집'}
        </h2>
        <div class="restaurant-list">
            ${filteredRestaurants.length > 0 ? filteredRestaurants.map(res => `
                <div class="restaurant-card" role="button" aria-label="${res.name} 상세 보기" onclick="navigateToDetail(${res.id})">
                    <div class="card-image-wrapper">
                        <img src="${res.image}" alt="${res.name}" class="card-image">
                        ${res.badge ? `<span class="card-badge">${res.badge}</span>` : ''}
                    </div>
                    <div class="card-content">
                        <div class="card-header">
                            <h3 class="restaurant-name">${res.name}</h3>
                            <span class="rating-tag">⭐ ${res.rating}</span>
                        </div>
                        <div class="card-meta">
                            <span>🚲 ${res.deliveryFee}</span>
                            <span>⏱️ ${res.time}</span>
                        </div>
                    </div>
                </div>
            `).join('') : `
                <div class="status-view" style="height: auto; padding: 40px 0;">
                    <p>검색 결과가 없습니다.</p>
                </div>
            `}
        </div>
    `;
    appContent.innerHTML = html;

    // Attach search listener after rendering
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderHome();
            document.getElementById('search-input').focus();
        });
    }
    
    updateCartUI();
}

window.setCategory = function(cat) {
    state.activeCategory = cat;
    renderHome();
};

function renderDetail(restaurant) {
    let html = `
        <div class="detail-header">
            <button class="back-btn" onclick="navigateTo('home')" aria-label="뒤로 가기">←</button>
            <img src="${restaurant.image}" alt="${restaurant.name}" class="card-image" style="height: 100%;">
        </div>
        <div class="menu-section">
            <h2 class="restaurant-name" style="font-size: 24px; margin-bottom: 8px;">${restaurant.name}</h2>
            <div class="card-meta" style="margin-bottom: 24px;">
                <span>⭐ ${restaurant.rating}</span>
                <span>•</span>
                <span>배달 ${restaurant.time}</span>
                <span>•</span>
                <span>배달비 ${restaurant.deliveryFee}</span>
            </div>

            <h3 class="section-title">대표 메뉴</h3>
            <div class="menu-list">
                ${restaurant.menu.map(item => `
                    <div class="menu-item" role="button" aria-label="${item.name} 추가" onclick="addToCart(${item.id})">
                        <div class="menu-item-info">
                            <h4 class="menu-item-name">${item.name}</h4>
                            <p class="menu-item-desc">${item.desc}</p>
                            <span class="menu-item-price">${item.price.toLocaleString()}원</span>
                        </div>
                        <img src="${item.image}" alt="${item.name}" class="menu-item-image">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    appContent.innerHTML = html;
}

function renderOrders() {
    appContent.innerHTML = `
        <div class="status-view">
            <span class="status-icon">📦</span>
            <h2>주문 내역이 비어있어요</h2>
            <p style="color: var(--text-muted); margin-top: 10px;">맛있는 음식을 주문해보세요!</p>
            <button class="primary-btn" onclick="navigateTo('home')">음식 보러가기</button>
        </div>
    `;
}

function renderProfile() {
    appContent.innerHTML = `
        <div class="status-view">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: #eee; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">👤</div>
            <h2>반가워요, 사용자님!</h2>
            <p style="color: var(--text-muted); margin-top: 10px;">테헤란로 123 (본가)</p>
            <div style="width: 100%; margin-top: 40px; text-align: left;">
                <div style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;"><span>포인트</span><strong>1,200P</strong></div>
                <div style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;"><span>쿠폰함</span><strong>3장</strong></div>
                <div style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;"><span>설정</span><span>></span></div>
            </div>
        </div>
    `;
}

function renderTracking() {
    appContent.innerHTML = `
        <div class="status-view">
            <span class="status-icon">🛵</span>
            <h2 style="color: var(--primary);">음식이 배달 중이에요!</h2>
            <p style="color: var(--text-muted); margin-top: 10px;">라이더님이 곧 도착합니다 (약 5분 남음)</p>
            <div style="width: 100%; height: 6px; background: #eee; border-radius: 10px; margin-top: 40px; position: relative;">
                <div style="width: 80%; height: 100%; background: var(--primary); border-radius: 10px;"></div>
            </div>
            <button class="primary-btn" onclick="navigateTo('home')" style="margin-top: 60px;">메인으로</button>
        </div>
    `;
}

// Logic Helpers
window.navigateToDetail = function(id) {
    const restaurant = DATA.restaurants.find(r => r.id === id);
    navigateTo('detail', restaurant);
};

window.navigateTo = navigateTo;

window.addToCart = function(itemId) {
    const restaurant = state.selectedRestaurant;
    const item = restaurant.menu.find(i => i.id === itemId);
    
    state.cart.push({
        ...item,
        restaurantName: restaurant.name
    });
    
    updateCartUI();
    
    // Feedback
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: #333; color: white; padding: 12px 24px; border-radius: 50px;
        z-index: 2000; animation: slideUp 0.3s forwards;
    `;
    toast.innerText = `${item.name}이(가) 장바구니에 담겼습니다.`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
};

function updateCartUI() {
    if (state.cart.length > 0) {
        cartBtn.classList.remove('hidden');
        cartTotal.innerText = `${calculateTotal().toLocaleString()}원`;
    } else {
        cartBtn.classList.add('hidden');
    }
}

function calculateTotal() {
    return state.cart.reduce((sum, item) => sum + item.price, 0);
}

function completeOrder() {
    state.cart = [];
    updateCartUI();
    navigateTo('tracking');
}

// Kick off
init();
