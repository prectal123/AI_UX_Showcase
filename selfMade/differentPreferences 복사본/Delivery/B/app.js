// Mock Data
const restaurants = [
  {
    id: 1,
    name: "도산 피자 (Dosan Pizza)",
    rating: 4.8,
    deliveryTime: "25-35분",
    deliveryFee: "3,000원",
    image: "/Users/hajun/.gemini/antigravity/brain/2ace808a-0353-45c7-b6d0-3d05fb704270/delicious_pepperoni_pizza_1777029660221.png",
    category: "양식",
    menu: [
      { id: 101, name: "페퍼로니 피자", price: 24900, description: "진한 토마토 소스와 듬뿍 올라간 페퍼로니", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop" },
      { id: 102, name: "트러플 머쉬룸 피자", price: 28900, description: "풍미 가득한 트러플 오일과 버섯의 조화", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 2,
    name: "더 버거 마스터 (Burger Master)",
    rating: 4.9,
    deliveryTime: "20-30분",
    deliveryFee: "2,000원",
    image: "/Users/hajun/.gemini/antigravity/brain/2ace808a-0353-45c7-b6d0-3d05fb704270/gourmet_cheese_burger_1777029673917.png",
    category: "패스트푸드",
    menu: [
      { id: 201, name: "시그니처 치즈버거", price: 9800, description: "육즙 가득한 패티와 체다 치즈", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" },
      { id: 202, name: "베이컨 비비큐 버거", price: 11500, description: "훈제 베이컨과 달콤한 BBQ 소스", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 3,
    name: "한남 비빔밥 (Hannam Bibimbap)",
    rating: 4.7,
    deliveryTime: "30-45분",
    deliveryFee: "3,500원",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=400&fit=crop",
    category: "한식",
    menu: [
      { id: 301, name: "전주 전통 비빔밥", price: 12000, description: "8가지 신선한 나물과 고추장", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop" },
      { id: 302, name: "돌솥 불고기 비빔밥", price: 14000, description: "지글지글 돌솥에 담긴 불고기 비빔밥", image: "https://images.unsplash.com/photo-1541518763669-279f00ed02ae?w=200&h=200&fit=crop" }
    ]
  }
];

// App State
let cart = [];
let currentView = 'home';
let viewHistory = ['home'];
let activeRestaurant = null;
let lastRemovedItem = null;
let searchQuery = "";

// DOM Elements
const mainContent = document.getElementById('main-content');
const headerLeft = document.getElementById('header-left');
const cartFloating = document.getElementById('cart-floating');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const navItems = document.querySelectorAll('.nav-item');
const toastEl = document.getElementById('toast');
const toastMsg = document.getElementById('toast-message');
const toastUndo = document.getElementById('toast-undo');
const modalOverlay = document.getElementById('modal-overlay');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');

// Router Logic
function navigate(view) {
  currentView = view;
  if (viewHistory[viewHistory.length - 1] !== view) {
    viewHistory.push(view);
  }
  
  // Predictability: Show skeleton before rendering
  renderSkeleton();
  setTimeout(() => {
    render();
    window.scrollTo(0, 0);
  }, 350);
}

function goBack() {
  if (viewHistory.length > 1) {
    viewHistory.pop();
    currentView = viewHistory[viewHistory.length - 1];
    render();
  }
}

// Rendering Logic
function render() {
  updateHeader();
  updateNav();
  updateCartUI();

  switch (currentView) {
    case 'home': renderHome(); break;
    case 'restaurant-detail': renderRestaurantDetail(); break;
    case 'checkout': renderCheckout(); break;
    case 'search': renderSearch(); break;
    case 'orders': renderOrders(); break;
    case 'profile': renderProfile(); break;
    case 'order-success': renderOrderSuccess(); break;
  }
  if (window.lucide) lucide.createIcons();
}

function renderSkeleton() {
  mainContent.innerHTML = `
    <div class="view">
      <div class="skeleton" style="height: 180px; width: 100%; border-radius: 12px; margin-bottom: 16px;"></div>
      <div class="skeleton" style="height: 24px; width: 60%; margin-bottom: 8px;"></div>
      <div class="skeleton" style="height: 16px; width: 40%; margin-bottom: 24px;"></div>
      <div class="skeleton" style="height: 80px; width: 100%; border-radius: 8px; margin-bottom: 12px;"></div>
      <div class="skeleton" style="height: 80px; width: 100%; border-radius: 8px;"></div>
    </div>
  `;
}

function updateHeader() {
  if (currentView === 'home') {
    headerLeft.innerHTML = `<h1>GoFood</h1>`;
  } else {
    headerLeft.innerHTML = `
      <button class="header-back" id="back-btn"><i data-lucide="arrow-left"></i></button>
      <h2 id="header-title">${getTitle()}</h2>
    `;
    document.getElementById('back-btn').addEventListener('click', goBack);
  }
}

function getTitle() {
  const titles = {
    'restaurant-detail': activeRestaurant?.name || '상세보기',
    'checkout': '결제하기',
    'search': '검색',
    'orders': '주문내역',
    'profile': '마이페이지',
    'order-success': '주문완료'
  };
  return titles[currentView] || 'GoFood';
}

function updateNav() {
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === currentView);
  });
}

// Views
function renderHome() {
  mainContent.innerHTML = `
    <div class="view">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px;">반가워요!</h2>
        <p>오늘 먹고 싶은 음식을 찾아보세요.</p>
      </div>
      <div class="restaurant-list">
        ${restaurants.map(res => `
          <div class="card restaurant-card" data-id="${res.id}">
            <img src="${res.image}" class="restaurant-image">
            <div class="flex-between" style="margin-top: 12px;">
              <h3>${res.name}</h3>
              <span class="badge badge-rating">★ ${res.rating}</span>
            </div>
            <p>${res.category} • 배달팁 ${res.deliveryFee}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.querySelectorAll('.restaurant-card').forEach(card => {
    card.addEventListener('click', () => {
      activeRestaurant = restaurants.find(r => r.id === parseInt(card.dataset.id));
      navigate('restaurant-detail');
    });
  });
}

function renderRestaurantDetail() {
  mainContent.innerHTML = `
    <div class="view">
      <img src="${activeRestaurant.image}" class="restaurant-image" style="height: 200px; margin-bottom: 16px;">
      <h1>${activeRestaurant.name}</h1>
      <p style="margin-bottom: 24px;">★ ${activeRestaurant.rating} | ${activeRestaurant.deliveryTime}</p>
      <h2>메뉴</h2>
      ${activeRestaurant.menu.map(item => `
        <div class="menu-item card" style="display: flex; gap: 12px;">
          <div style="flex: 1;">
            <h3 style="font-size: 16px;">${item.name}</h3>
            <p style="font-size: 12px;">${item.description}</p>
            <p style="font-weight: 700; margin-top: 8px;">${item.price.toLocaleString()}원</p>
            <button class="btn-ghost add-to-cart" data-item-id="${item.id}" style="margin-top: 8px;">+ 담기</button>
          </div>
          <img src="${item.image}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
        </div>
      `).join('')}
    </div>
  `;
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = activeRestaurant.menu.find(m => m.id === parseInt(btn.dataset.itemId));
      tryAddToCart(item);
    });
  });
}

function renderSearch() {
  const filtered = searchQuery 
    ? restaurants.filter(r => r.name.includes(searchQuery) || r.category.includes(searchQuery))
    : [];

  mainContent.innerHTML = `
    <div class="view">
      <div class="card" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px;">
        <i data-lucide="search" style="color: var(--secondary); width: 18px;"></i>
        <input type="text" id="search-input" value="${searchQuery}" placeholder="식당이나 메뉴 검색" style="border: none; outline: none; flex: 1; font-size: 16px;">
      </div>
      <div style="margin-top: 24px;">
        ${searchQuery ? `<h3>'${searchQuery}' 검색 결과</h3>` : '<h3>추천 검색어</h3>'}
        <div style="margin-top: 16px;">
          ${filtered.length > 0 ? filtered.map(res => `
            <div class="card restaurant-card" data-id="${res.id}" style="display: flex; gap: 12px; align-items: center;">
              <img src="${res.image}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
              <div>
                <h4 style="margin: 0;">${res.name}</h4>
                <p style="font-size: 12px;">★ ${res.rating} • ${res.category}</p>
              </div>
            </div>
          `).join('') : searchQuery ? '<p>검색 결과가 없습니다.</p>' : `
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <span class="badge" style="background: #f1f5f9; padding: 8px 12px; border-radius: 20px;">피자</span>
              <span class="badge" style="background: #f1f5f9; padding: 8px 12px; border-radius: 20px;">치킨</span>
              <span class="badge" style="background: #f1f5f9; padding: 8px 12px; border-radius: 20px;">마라탕</span>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
  const input = document.getElementById('search-input');
  input.focus();
  input.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderSearch(); // Re-render immediately for predictability
  });
}

function renderCheckout() {
  const total = cart.reduce((s, i) => s + i.price, 0);
  mainContent.innerHTML = `
    <div class="view">
      <div class="stepper">
        <div class="step active"><div class="step-icon">1</div><div class="step-label">정보입력</div></div>
        <div class="step"><div class="step-icon">2</div><div class="step-label">결제</div></div>
        <div class="step"><div class="step-icon">3</div><div class="step-label">완료</div></div>
      </div>
      <div class="card">
        <h3>주문 메뉴</h3>
        ${cart.map((item, idx) => `
          <div class="flex-between" style="padding: 12px 0; border-bottom: 1px solid var(--border);">
            <span>${item.name}</span>
            <div class="flex-gap" style="align-items: center;">
              <span>${item.price.toLocaleString()}원</span>
              <button class="remove-item" data-idx="${idx}"><i data-lucide="x" style="width: 16px; color: var(--danger);"></i></button>
            </div>
          </div>
        `).join('')}
        <div class="flex-between" style="margin-top: 16px; font-weight: 700;">
          <span>총합계</span>
          <span style="color: var(--primary); font-size: 20px;">${total.toLocaleString()}원</span>
        </div>
      </div>
      <button class="btn-primary" id="pay-btn" style="margin-top: 24px;">결제하기</button>
    </div>
  `;
  document.getElementById('pay-btn').addEventListener('click', placeOrder);
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.idx)));
  });
}

function renderOrderSuccess() {
  mainContent.innerHTML = `
    <div class="view" style="text-align: center; padding-top: 60px;">
      <i data-lucide="check-circle" style="width: 80px; height: 80px; color: var(--success); margin-bottom: 24px;"></i>
      <h1>주문이 완료되었습니다!</h1>
      <p>30분 내로 도착할 예정입니다.</p>
      <button class="btn-primary" style="margin-top: 40px;" onclick="location.reload()">메인으로</button>
    </div>
  `;
}

// Logic functions
function tryAddToCart(item) {
  const currentResId = cart.length > 0 ? cart[0].restaurantId : null;
  if (currentResId && currentResId !== activeRestaurant.id) {
    showModal("장바구니 확인", "다른 식당의 메뉴가 담겨 있습니다. 기존 메뉴를 비울까요?", () => {
      cart = [];
      addToCart(item);
      hideModal();
    });
  } else {
    addToCart(item);
  }
}

function addToCart(item) {
  cart.push({ ...item, restaurantId: activeRestaurant.id });
  updateCartUI();
  showToast(`${item.name}이(가) 장바구니에 담겼습니다.`);
}

function removeFromCart(idx) {
  lastRemovedItem = { item: cart[idx], index: idx };
  cart.splice(idx, 1);
  render();
  showToast("메뉴를 삭제했습니다.", true);
}

function undoRemove() {
  if (lastRemovedItem) {
    cart.splice(lastRemovedItem.index, 0, lastRemovedItem.item);
    lastRemovedItem = null;
    hideToast();
    render();
  }
}

function showToast(msg, canUndo = false) {
  toastMsg.innerText = msg;
  toastUndo.classList.toggle('hidden', !canUndo);
  toastEl.classList.add('show');
  setTimeout(hideToast, 3000);
}

function hideToast() {
  toastEl.classList.remove('show');
}

function showModal(title, msg, onConfirm) {
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-message').innerText = msg;
  modalOverlay.classList.add('show');
  modalConfirm.onclick = onConfirm;
}

function hideModal() {
  modalOverlay.classList.remove('show');
}

function updateCartUI() {
  const isHidden = cart.length === 0 || ['checkout', 'order-success'].includes(currentView);
  cartFloating.classList.toggle('hidden', isHidden);
  if (!isHidden) {
    cartCount.innerText = cart.length;
    cartTotal.innerText = cart.reduce((s, i) => s + i.price, 0).toLocaleString();
  }
}

function placeOrder() {
  const btn = document.getElementById('pay-btn');
  btn.disabled = true;
  btn.innerText = "결제 처리 중...";
  setTimeout(() => navigate('order-success'), 1000);
}

// Events
navItems.forEach(item => item.addEventListener('click', () => navigate(item.dataset.view)));
cartFloating.addEventListener('click', () => navigate('checkout'));
toastUndo.addEventListener('click', undoRemove);
modalCancel.addEventListener('click', hideModal);

// Init
render();
