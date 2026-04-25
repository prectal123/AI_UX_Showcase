const mockVideos = [
  {
    id: 'v1',
    title: 'Exploring the Neon Streets of Tokyo',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-e94e270b4d82?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: 'Urban Wanderer',
    channelAvatar: 'https://i.pravatar.cc/150?u=urban',
    views: '1.2M',
    timestamp: '2 days ago',
    duration: '12:45',
    category: 'Travel',
    description: 'Join us as we walk through the vibrant neighborhoods of Shinjuku and Shibuya at night. Experience the lights, the sounds, and the energy of Tokyo.',
    subscribers: '450K',
    likes: '85K',
    comments: [
      { id: 'c1', user: 'Alex J.', avatar: 'https://i.pravatar.cc/150?u=alex', text: 'This makes me want to visit Japan so badly!', time: '1 hour ago' },
      { id: 'c2', user: 'Sarah K.', avatar: 'https://i.pravatar.cc/150?u=sarah', text: 'The cinematography is incredible.', time: '5 hours ago' }
    ]
  },
  {
    id: 'v2',
    title: 'Cooking the Perfect Wagyu Steak',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    channel: 'Chef Master',
    channelAvatar: 'https://i.pravatar.cc/150?u=chef',
    views: '850K',
    timestamp: '5 hours ago',
    duration: '08:20',
    category: 'Food',
    description: 'Learn the secrets to searing a perfect Wagyu steak at home. It\'s easier than you think with the right technique.',
    subscribers: '1.2M',
    likes: '42K',
    comments: [
      { id: 'c3', user: 'Mike R.', avatar: 'https://i.pravatar.cc/150?u=mike', text: 'I tried this and it actually worked!', time: '20 mins ago' }
    ]
  },
  {
    id: 'v3',
    title: 'Future Tech: AI and Robotics in 2030',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: 'Tech Vision',
    channelAvatar: 'https://i.pravatar.cc/150?u=tech',
    views: '3.4M',
    timestamp: '1 week ago',
    duration: '22:15',
    category: 'Tech',
    description: 'A deep dive into how AI and robotics will transform our daily lives over the next decade.',
    subscribers: '2.8M',
    likes: '210K',
    comments: []
  },
  {
    id: 'v4',
    title: 'Lo-Fi Hip Hop Radio - Beats to Relax/Study to',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    channel: 'Lofi Girl',
    channelAvatar: 'https://i.pravatar.cc/150?u=lofi',
    views: '150M',
    timestamp: 'Live',
    duration: 'Live',
    category: 'Music',
    description: 'Relaxing beats for your daily tasks.',
    subscribers: '12M',
    likes: '1.2M',
    comments: []
  },
  {
    id: 'v5',
    title: 'Mountain Biking Down the Alps',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channel: 'Extreme Sports',
    channelAvatar: 'https://i.pravatar.cc/150?u=extreme',
    views: '2.1M',
    timestamp: '3 days ago',
    duration: '15:30',
    category: 'Sports',
    description: 'High-speed descent through the Swiss Alps. Not for the faint of heart!',
    subscribers: '900K',
    likes: '120K',
    comments: []
  },
  {
    id: 'v6',
    title: 'Minimalist Home Tour: Living with Less',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    channel: 'Simplicity',
    channelAvatar: 'https://i.pravatar.cc/150?u=simple',
    views: '600K',
    timestamp: '1 month ago',
    duration: '10:10',
    category: 'Lifestyle',
    description: 'Exploring a small but perfectly designed minimalist home.',
    subscribers: '300K',
    likes: '25K',
    comments: []
  }
];

const categories = ['All', 'Travel', 'Food', 'Tech', 'Music', 'Sports', 'Lifestyle'];

// State
let currentState = {
    view: 'home', // home, player, search, message
    currentVideoId: null,
    searchQuery: '',
    selectedCategory: 'All',
    history: [],
    likedVideos: [],
    subscriptions: [],
    lastAction: null // For undo functionality
};

// DOM Elements
const mainContent = document.getElementById('main-content');
const homeView = document.getElementById('home-view');
const playerView = document.getElementById('player-view');
const searchView = document.getElementById('search-view');
const messageView = document.getElementById('message-view');
const videoGrid = document.getElementById('video-grid');
const searchGrid = document.getElementById('search-grid');
const categoriesRow = document.getElementById('categories-row');
const playerContainer = document.getElementById('player-container');
const searchInput = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');
const homeLogo = document.getElementById('home-logo');
const navItems = document.querySelectorAll('.nav-item');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastUndo = document.getElementById('toast-undo');
const backHomeBtn = document.getElementById('back-home-btn');

// Initialize
function init() {
    renderCategories();
    renderVideos(mockVideos, videoGrid);
    setupEventListeners();
}

// Rendering Logic
function renderCategories() {
    if (!categoriesRow) return;
    categoriesRow.innerHTML = categories.map(cat => `
        <div class="category-chip ${currentState.selectedCategory === cat ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </div>
    `).join('');

    categoriesRow.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            currentState.selectedCategory = chip.dataset.category;
            renderCategories();
            filterVideos();
        });
    });
}

function renderVideos(videos, container) {
    if (!container) return;
    container.innerHTML = videos.map(video => `
        <div class="video-card" data-id="${video.id}">
            <div class="thumbnail-container">
                <img src="${video.thumbnail}" alt="${video.title}">
                <span class="duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <img src="${video.channelAvatar}" alt="${video.channel}" class="channel-avatar-small">
                <div class="video-details">
                    <h3>${video.title}</h3>
                    <p>${video.channel}</p>
                    <p>${video.views} views • ${video.timestamp}</p>
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            navigateToPlayer(card.dataset.id);
        });
    });
}

function filterVideos() {
    const filtered = currentState.selectedCategory === 'All' 
        ? mockVideos 
        : mockVideos.filter(v => v.category === currentState.selectedCategory);
    renderVideos(filtered, videoGrid);
}

function navigateToView(viewName) {
    currentState.view = viewName;
    
    // Hide all views
    [homeView, playerView, searchView, messageView].forEach(v => {
        if (v) v.classList.add('hidden');
    });
    
    // Update Nav active state
    navItems.forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (viewName === 'home') {
        homeView.classList.remove('hidden');
    } else if (viewName === 'player') {
        playerView.classList.remove('hidden');
    } else if (viewName === 'search') {
        searchView.classList.remove('hidden');
    } else {
        messageView.classList.remove('hidden');
        updateMessageView(viewName);
    }

    window.scrollTo(0, 0);
}

function updateMessageView(viewName) {
    const title = document.getElementById('message-title');
    const icon = document.getElementById('message-icon');
    const text = document.getElementById('message-text');

    if (!title || !icon || !text) return;

    switch(viewName) {
        case 'trending':
            title.textContent = 'Trending Content';
            icon.className = 'fas fa-fire';
            text.textContent = 'Stay updated with what everyone is watching right now.';
            break;
        case 'subscriptions':
            title.textContent = 'Your Subscriptions';
            icon.className = 'fas fa-clapperboard';
            text.textContent = 'Videos from channels you subscribe to will appear here.';
            break;
        case 'library':
            title.textContent = 'Library';
            icon.className = 'fas fa-book';
            text.textContent = 'All your saved content, playlists, and watch later list.';
            break;
        case 'history':
            title.textContent = 'Watch History';
            icon.className = 'fas fa-history';
            text.textContent = 'Keep track of the videos you have watched recently.';
            break;
        case 'liked':
            title.textContent = 'Liked Videos';
            icon.className = 'fas fa-thumbs-up';
            text.textContent = 'You haven\'t liked any videos yet. Go watch something and show some love!';
            break;
    }
}

function navigateToPlayer(videoId) {
    currentState.currentVideoId = videoId;
    const video = mockVideos.find(v => v.id === videoId);
    if (!video) return;

    navigateToView('player');
    
    const isSubscribed = currentState.subscriptions.includes(video.channel);
    const isLiked = currentState.likedVideos.includes(videoId);

    playerContainer.innerHTML = `
        <div class="player-main">
            <div class="video-wrapper">
                <video src="${video.videoUrl}" controls autoplay></video>
            </div>
            <div class="video-meta">
                <h1>${video.title}</h1>
                <div class="video-actions">
                    <div class="channel-info">
                        <img src="${video.channelAvatar}" alt="${video.channel}" class="avatar" style="width: 40px; height: 40px;">
                        <div>
                            <div style="font-weight: 600;">${video.channel}</div>
                            <div style="font-size: 12px; color: var(--text-secondary);">${video.subscribers} subscribers</div>
                        </div>
                        <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" id="sub-btn">
                            ${isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn" id="like-btn" style="${isLiked ? 'color: #3ea6ff;' : ''}">
                            <i class="${isLiked ? 'fas' : 'far'} fa-thumbs-up"></i> ${video.likes}
                        </button>
                        <button class="action-btn"><i class="far fa-thumbs-down"></i></button>
                        <button class="action-btn"><i class="fas fa-share"></i> Share</button>
                        <button class="action-btn"><i class="fas fa-download"></i> Download</button>
                        <button class="action-btn" id="save-btn"><i class="far fa-bookmark"></i> Save</button>
                    </div>
                </div>
                <div class="description-box">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${video.views} views • ${video.timestamp}</div>
                    <p>${video.description}</p>
                </div>
                <div class="comments-section">
                    <h3>${video.comments.length} Comments</h3>
                    <div class="comment-input-area">
                        <img src="https://i.pravatar.cc/150?u=user" alt="User" class="avatar">
                        <input type="text" placeholder="Add a comment..." id="comment-input">
                    </div>
                    <div class="comment-list">
                        ${video.comments.map(c => `
                            <div class="comment-item">
                                <img src="${c.avatar}" alt="${c.user}" class="avatar" style="width: 32px; height: 32px;">
                                <div class="comment-content">
                                    <h4>${c.user} <span>${c.time}</span></h4>
                                    <p>${c.text}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        <div class="recommendations">
            <h3 style="margin-bottom: 12px; font-size: 16px;">Up Next</h3>
            ${mockVideos.filter(v => v.id !== videoId).map(v => `
                <div class="rec-card" data-id="${v.id}">
                    <div class="rec-thumb">
                        <img src="${v.thumbnail}" alt="${v.title}">
                    </div>
                    <div class="rec-info">
                        <h4>${v.title}</h4>
                        <p>${v.channel}</p>
                        <p>${v.views} views • ${v.timestamp}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Re-attach listeners for dynamically rendered player content
    playerContainer.querySelectorAll('.rec-card').forEach(card => {
        card.addEventListener('click', () => navigateToPlayer(card.dataset.id));
    });

    document.getElementById('sub-btn').addEventListener('click', () => toggleSubscription(video.channel));
    document.getElementById('like-btn').addEventListener('click', () => toggleLike(video.id));
    document.getElementById('save-btn').addEventListener('click', () => showToast('Saved to Library'));

    const commentInput = document.getElementById('comment-input');
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && commentInput.value.trim()) {
            showToast('Comment posted');
            commentInput.value = '';
        }
    });
}

// Interaction Actions
function toggleSubscription(channelName) {
    const index = currentState.subscriptions.indexOf(channelName);
    if (index > -1) {
        currentState.subscriptions.splice(index, 1);
        currentState.lastAction = { type: 'unsubscribe', data: channelName };
        showToast(`Unsubscribed from ${channelName}`, true);
    } else {
        currentState.subscriptions.push(channelName);
        currentState.lastAction = { type: 'subscribe', data: channelName };
        showToast(`Subscribed to ${channelName}`, true);
    }
    // Refresh player UI if in player view
    if (currentState.view === 'player') navigateToPlayer(currentState.currentVideoId);
}

function toggleLike(videoId) {
    const index = currentState.likedVideos.indexOf(videoId);
    if (index > -1) {
        currentState.likedVideos.splice(index, 1);
        showToast('Removed from Liked Videos');
    } else {
        currentState.likedVideos.push(videoId);
        showToast('Added to Liked Videos');
    }
    // Refresh player UI
    if (currentState.view === 'player') navigateToPlayer(currentState.currentVideoId);
}

function showToast(message, canUndo = false) {
    if (!toast || !toastMessage || !toastUndo) return;
    toastMessage.textContent = message;
    toastUndo.style.display = canUndo ? 'block' : 'none';
    toast.style.display = 'flex';
    
    // Clear previous timeout if any
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    
    window.toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 5000);
}

function undoLastAction() {
    if (!currentState.lastAction) return;

    const action = currentState.lastAction;
    if (action.type === 'subscribe') {
        const index = currentState.subscriptions.indexOf(action.data);
        if (index > -1) currentState.subscriptions.splice(index, 1);
    } else if (action.type === 'unsubscribe') {
        currentState.subscriptions.push(action.data);
    }

    currentState.lastAction = null;
    toast.style.display = 'none';
    
    if (currentState.view === 'player') navigateToPlayer(currentState.currentVideoId);
}

// Event Listeners Setup
function setupEventListeners() {
    if (homeLogo) homeLogo.addEventListener('click', () => navigateToView('home'));
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToView(item.dataset.view);
        });
    });

    if (searchSubmit) searchSubmit.addEventListener('click', performSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    if (toastUndo) toastUndo.addEventListener('click', undoLastAction);
    if (backHomeBtn) backHomeBtn.addEventListener('click', () => navigateToView('home'));
}

function performSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    currentState.searchQuery = query;
    const results = mockVideos.filter(v => 
        v.title.toLowerCase().includes(query) || 
        v.channel.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query)
    );

    navigateToView('search');
    renderVideos(results, searchGrid);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
