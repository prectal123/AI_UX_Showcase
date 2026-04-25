// Mock Data
const videos = [
    {
        id: 'v1',
        title: 'Building a Minimalist Desk Setup for 2024',
        thumbnail: 'thumb_tech.png',
        channel: 'TechVibe',
        channelIcon: 'https://i.pravatar.cc/150?u=techvibe',
        views: '1.2M',
        posted: '2 days ago',
        duration: '12:45',
        category: 'Tech',
        description: 'In this video, I walk through my entire process of building a clean, minimalist desk setup that boosts productivity and looks amazing.',
        likes: '45K',
        subscribers: '850K'
    },
    {
        id: 'v2',
        title: 'Exploring the Hidden Gems of Bali',
        thumbnail: 'thumb_travel.png',
        channel: 'Wanderlust',
        channelIcon: 'https://i.pravatar.cc/150?u=wanderlust',
        views: '850K',
        posted: '5 days ago',
        duration: '18:20',
        category: 'Travel',
        description: 'Join me as we travel across Bali to find the most secluded and beautiful spots that most tourists never see.',
        likes: '32K',
        subscribers: '1.2M'
    },
    {
        id: 'v3',
        title: 'Grand Finals: The Epic Comeback',
        thumbnail: 'thumb_gaming.png',
        channel: 'ProGaming League',
        channelIcon: 'https://i.pravatar.cc/150?u=progaming',
        views: '3.5M',
        posted: '1 week ago',
        duration: '45:10',
        category: 'Gaming',
        description: 'Watch the incredible highlights from the Grand Finals where Team Alpha pulled off the greatest comeback in esports history.',
        likes: '120K',
        subscribers: '5.6M'
    },
    {
        id: 'v4',
        title: 'How to Master the Electric Guitar',
        thumbnail: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=1000',
        channel: 'MusicAcademy',
        channelIcon: 'https://i.pravatar.cc/150?u=music',
        views: '420K',
        posted: '3 days ago',
        duration: '15:30',
        category: 'Music',
        description: 'A comprehensive guide for beginners to start playing electric guitar with confidence.',
        likes: '18K',
        subscribers: '210K'
    },
    {
        id: 'v5',
        title: 'Day in the Life of a Software Engineer',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
        channel: 'DevLife',
        channelIcon: 'https://i.pravatar.cc/150?u=devlife',
        views: '600K',
        posted: '1 day ago',
        duration: '10:15',
        category: 'Tech',
        description: 'See what a typical day looks like for a senior developer working at a top tech company.',
        likes: '28K',
        subscribers: '430K'
    }
];

const comments = [
    { user: 'AlexCode', text: 'This setup is actually goals. Love the lighting!', time: '1 hour ago' },
    { user: 'TravelBug', text: 'Bali is on my bucket list. Thanks for the tips!', time: '5 hours ago' },
    { user: 'GamerX', text: 'That final play was insane. Alpha deserved the win.', time: '12 hours ago' }
];

// App State
let currentView = 'home';
let searchResults = [];

// DOM Elements
const mainContent = document.getElementById('main-content');
const uploadModal = document.getElementById('upload-modal');
const btnUploadModal = document.getElementById('btn-upload-modal');
const closeUpload = document.getElementById('close-upload');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const navItems = document.querySelectorAll('.nav-item');
const logo = document.getElementById('btn-home-logo');

// Initialization
function init() {
    renderHome();
    setupEventListeners();
    renderSidebarSubscriptions();
}

// Router
function navigate(view, params = {}) {
    currentView = view;
    navItems.forEach(item => {
        if (item.getAttribute('data-view') === view) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    switch (view) {
        case 'home':
            renderHome();
            break;
        case 'watch':
            renderWatch(params.id);
            break;
        case 'search':
            renderSearch(params.query);
            break;
        case 'trending':
            renderTrending();
            break;
        case 'subscriptions':
            renderSubscriptions();
            break;
        case 'library':
        case 'liked':
        case 'watch-later':
            renderPlaceholderView(view);
            break;
    }
    mainContent.scrollTop = 0;
}

// Render Functions
function renderHome() {
    let html = `
        <div class="category-filters" style="display: flex; gap: 12px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 8px;">
            <button class="btn-action" style="background: white; color: black;">All</button>
            <button class="btn-action">Tech</button>
            <button class="btn-action">Travel</button>
            <button class="btn-action">Gaming</button>
            <button class="btn-action">Music</button>
            <button class="btn-action">Lifestyle</button>
        </div>
        <div class="video-grid">
    `;

    videos.forEach(video => {
        html += `
            <div class="video-card" onclick="navigate('watch', {id: '${video.id}'})">
                <div class="thumbnail-container">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <img src="${video.channelIcon}" class="channel-icon">
                    <div class="video-details">
                        <h3>${video.title}</h3>
                        <p>${video.channel}</p>
                        <p>${video.views} views • ${video.posted}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    mainContent.innerHTML = html;
}

function renderWatch(videoId) {
    const video = videos.find(v => v.id === videoId) || videos[0];
    
    let html = `
        <div class="watch-container">
            <div class="watch-main">
                <div class="video-player-container">
                    <div class="video-player-placeholder">
                        <i class="fas fa-play play-icon"></i>
                        <p>Simulated Video Playback: ${video.title}</p>
                    </div>
                </div>
                <div class="video-meta">
                    <h1>${video.title}</h1>
                    <div class="video-actions">
                        <p style="color: var(--text-secondary);">${video.views} views • ${video.posted}</p>
                        <div class="action-buttons">
                            <button class="btn-action" onclick="toggleLike(this)">
                                <i class="far fa-thumbs-up"></i> ${video.likes}
                            </button>
                            <button class="btn-action">
                                <i class="far fa-thumbs-down"></i>
                            </button>
                            <button class="btn-action">
                                <i class="fas fa-share"></i> Share
                            </button>
                            <button class="btn-action">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                    <div class="channel-strip">
                        <div class="channel-info">
                            <img src="${video.channelIcon}" class="channel-icon" style="width: 48px; height: 48px;">
                            <div>
                                <h3 style="font-size: 16px;">${video.channel}</h3>
                                <p style="font-size: 12px; color: var(--text-secondary);">${video.subscribers} subscribers</p>
                            </div>
                        </div>
                        <button class="btn-subscribe" id="subscribe-btn" onclick="toggleSubscribe(this)">Subscribe</button>
                    </div>
                    <div class="description-box">
                        <p>${video.description}</p>
                        <p style="margin-top: 12px; font-weight: 600; cursor: pointer;">Show more</p>
                    </div>
                </div>

                <div class="comments-section">
                    <h3>3 Comments</h3>
                    <div class="comment-input-container">
                        <div class="profile-pic" style="width: 40px; height: 40px;"></div>
                        <input type="text" placeholder="Add a comment..." id="new-comment-input">
                        <button class="btn-upload" style="padding: 6px 12px;" onclick="addComment()">Comment</button>
                    </div>
                    <div id="comments-list">
                        ${comments.map(c => `
                            <div class="comment">
                                <img src="https://i.pravatar.cc/150?u=${c.user}" class="channel-icon">
                                <div class="comment-content">
                                    <h4>@${c.user} • ${c.time}</h4>
                                    <p>${c.text}</p>
                                    <div style="margin-top: 8px; display: flex; gap: 12px; font-size: 12px; color: var(--text-secondary);">
                                        <span><i class="far fa-thumbs-up"></i> 12</span>
                                        <span><i class="far fa-thumbs-down"></i></span>
                                        <span style="font-weight: 600;">Reply</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="watch-sidebar">
                <h3 style="margin-bottom: 16px;">Related Videos</h3>
                ${videos.filter(v => v.id !== videoId).map(v => `
                    <div class="video-card" style="display: flex; gap: 12px; margin-bottom: 12px;" onclick="navigate('watch', {id: '${v.id}'})">
                        <div class="thumbnail-container" style="width: 160px; flex-shrink: 0; margin-bottom: 0;">
                            <img src="${v.thumbnail}">
                        </div>
                        <div class="video-details">
                            <h3 style="font-size: 14px; -webkit-line-clamp: 2;">${v.title}</h3>
                            <p style="font-size: 12px;">${v.channel}</p>
                            <p style="font-size: 12px;">${v.views} • ${v.posted}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    mainContent.innerHTML = html;
}

function renderSearch(query) {
    const results = videos.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase()) || 
        v.channel.toLowerCase().includes(query.toLowerCase()) ||
        v.category.toLowerCase().includes(query.toLowerCase())
    );

    let html = `
        <h2 style="margin-bottom: 24px;">Search results for: "${query}"</h2>
        <div style="display: flex; flex-direction: column; gap: 16px;">
    `;

    if (results.length === 0) {
        html += `<p>No videos found matching your search.</p>`;
    } else {
        results.forEach(video => {
            html += `
                <div class="video-card" style="display: flex; gap: 20px;" onclick="navigate('watch', {id: '${video.id}'})">
                    <div class="thumbnail-container" style="width: 360px; flex-shrink: 0; margin-bottom: 0;">
                        <img src="${video.thumbnail}">
                        <span class="duration">${video.duration}</span>
                    </div>
                    <div class="video-details" style="padding: 8px 0;">
                        <h3 style="font-size: 18px;">${video.title}</h3>
                        <p style="margin: 8px 0;">${video.views} views • ${video.posted}</p>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <img src="${video.channelIcon}" class="channel-icon" style="width: 24px; height: 24px;">
                            <p>${video.channel}</p>
                        </div>
                        <p style="font-size: 14px; -webkit-line-clamp: 2;">${video.description}</p>
                    </div>
                </div>
            `;
        });
    }

    html += `</div>`;
    mainContent.innerHTML = html;
}

function renderTrending() {
    let html = `
        <h2 style="margin-bottom: 24px;"><i class="fas fa-fire" style="color: #ff4500;"></i> Trending Videos</h2>
        <div class="video-grid">
    `;

    // Sort by "views" (naive string parsing for mock data)
    const trendingVideos = [...videos].sort((a, b) => {
        const valA = parseFloat(a.views.replace('M', '000000').replace('K', '000'));
        const valB = parseFloat(b.views.replace('M', '000000').replace('K', '000'));
        return valB - valA;
    });

    trendingVideos.forEach(video => {
        html += `
            <div class="video-card" onclick="navigate('watch', {id: '${video.id}'})">
                <div class="thumbnail-container">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <img src="${video.channelIcon}" class="channel-icon">
                    <div class="video-details">
                        <h3>${video.title}</h3>
                        <p>${video.channel}</p>
                        <p>${video.views} views • ${video.posted}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    mainContent.innerHTML = html;
}

function renderSubscriptions() {
    let html = `
        <h2 style="margin-bottom: 24px;">New from your subscriptions</h2>
        <div class="video-grid">
    `;

    // Just show a subset of videos as "subscribed"
    const subVideos = videos.slice(0, 3);

    subVideos.forEach(video => {
        html += `
            <div class="video-card" onclick="navigate('watch', {id: '${video.id}'})">
                <div class="thumbnail-container">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <img src="${video.channelIcon}" class="channel-icon">
                    <div class="video-details">
                        <h3>${video.title}</h3>
                        <p>${video.channel}</p>
                        <p>${video.views} views • ${video.posted}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    mainContent.innerHTML = html;
}

function renderPlaceholderView(view) {
    const title = view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ');
    mainContent.innerHTML = `
        <div style="text-align: center; margin-top: 100px;">
            <i class="fas fa-folder-open" style="font-size: 64px; color: var(--accent-color); margin-bottom: 24px;"></i>
            <h2>${title}</h2>
            <p style="color: var(--text-secondary); margin-top: 12px;">This is your personal ${view} space. It's populated with your activity.</p>
            <button class="btn-upload" style="margin-top: 24px;" onclick="navigate('home')">Return Home</button>
        </div>
    `;
}

function renderSidebarSubscriptions() {
    const sidebarSubs = document.getElementById('sidebar-subscriptions');
    const channels = [...new Set(videos.map(v => v.channel))].slice(0, 5);
    
    sidebarSubs.innerHTML = channels.map(c => `
        <a href="#" class="nav-item" onclick="navigate('search', {query: '${c}'})">
            <img src="https://i.pravatar.cc/150?u=${c}" class="channel-icon" style="width: 24px; height: 24px;">
            ${c}
        </a>
    `).join('');
}

// Interaction Handlers
function setupEventListeners() {
    btnUploadModal.onclick = () => uploadModal.classList.add('active');
    closeUpload.onclick = () => uploadModal.classList.remove('active');
    uploadModal.onclick = (e) => { if(e.target === uploadModal) uploadModal.classList.remove('active'); };

    searchButton.onclick = () => {
        const query = searchInput.value;
        if (query) navigate('search', {query});
    };

    searchInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query) navigate('search', {query});
        }
    };

    logo.onclick = () => navigate('home');

    navItems.forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            navigate(view);
        };
    });

    document.getElementById('btn-publish').onclick = () => {
        const title = document.getElementById('upload-title').value || 'My Awesome Video';
        const desc = document.getElementById('upload-desc').value;
        
        // Simulate adding to videos
        videos.unshift({
            id: 'v' + (videos.length + 1),
            title: title,
            thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000',
            channel: 'You',
            channelIcon: 'https://i.pravatar.cc/150?u=you',
            views: '0',
            posted: 'Just now',
            duration: '0:00',
            category: 'Personal',
            description: desc,
            likes: '0',
            subscribers: '0'
        });

        alert('Video published successfully!');
        uploadModal.classList.remove('active');
        navigate('home');
    };

    document.getElementById('btn-profile').onclick = () => {
        navigate('search', {query: 'Tech'}); // Simulate profile navigation to their content
    };
}

function toggleLike(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.color = 'var(--accent-color)';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.color = 'white';
    }
}

function toggleSubscribe(btn) {
    if (btn.classList.contains('subscribed')) {
        btn.classList.remove('subscribed');
        btn.innerText = 'Subscribe';
        btn.style.background = 'white';
        btn.style.color = 'black';
    } else {
        btn.classList.add('subscribed');
        btn.innerText = 'Subscribed';
        btn.style.background = 'var(--hover-bg)';
        btn.style.color = 'white';
    }
}

function addComment() {
    const input = document.getElementById('new-comment-input');
    const text = input.value;
    if (!text) return;

    const list = document.getElementById('comments-list');
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `
        <img src="https://i.pravatar.cc/150?u=you" class="channel-icon">
        <div class="comment-content">
            <h4>@You • Just now</h4>
            <p>${text}</p>
            <div style="margin-top: 8px; display: flex; gap: 12px; font-size: 12px; color: var(--text-secondary);">
                <span><i class="far fa-thumbs-up"></i> 0</span>
                <span><i class="far fa-thumbs-down"></i></span>
                <span style="font-weight: 600;">Reply</span>
            </div>
        </div>
    `;
    list.prepend(newComment);
    input.value = '';
}

// Global scope for onclick handlers
window.navigate = navigate;
window.toggleLike = toggleLike;
window.toggleSubscribe = toggleSubscribe;
window.addComment = addComment;

// Start the app
init();
