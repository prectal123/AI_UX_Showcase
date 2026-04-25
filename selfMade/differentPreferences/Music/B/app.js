// Mock Data
const SONGS = [
    { id: 1, title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", art: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop", duration: "4:03", color: "#4a148c" },
    { id: 2, title: "Starboy", artist: "The Weeknd", album: "Starboy", art: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop", duration: "3:50", color: "#b71c1c" },
    { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", art: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=400&auto=format&fit=crop", duration: "3:23", color: "#006064" },
    { id: 4, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", art: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop", duration: "3:20", color: "#1a237e" },
    { id: 5, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", art: "https://images.unsplash.com/photo-1514525253361-bee87184919a?q=80&w=400&auto=format&fit=crop", duration: "3:58", color: "#1b5e20" },
    { id: 6, title: "Stay", artist: "The Kid LAROI", album: "F*CK LOVE 3", art: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop", duration: "2:21", color: "#f57f17" }
];

const PLAYLISTS = [
    { id: 1, title: "Today's Top Hits", subtitle: "The hottest tracks", art: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&auto=format&fit=crop", songs: [1, 2, 3, 4] },
    { id: 2, title: "Chill Vibes", subtitle: "Relax and unwind", art: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=300&auto=format&fit=crop", songs: [5, 6, 1] },
    { id: 3, title: "Workout Energy", subtitle: "Get your heart pumping", art: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop", songs: [2, 4, 6] },
    { id: 4, title: "Indie Pop", subtitle: "Fresh sounds", art: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=300&auto=format&fit=crop", songs: [1, 3, 5] }
];

const CATEGORIES = [
    { title: "Pop", icon: "fa-bolt", color: "#e91e63" },
    { title: "K-Pop", icon: "fa-star", color: "#9c27b0" },
    { title: "Hip-Hop", icon: "fa-microphone", color: "#2196f3" },
    { title: "Rock", icon: "fa-guitar", color: "#f44336" },
    { title: "R&B", icon: "fa-heart", color: "#ff9800" },
    { title: "Jazz", icon: "fa-sax-hot", color: "#795548" }
];

// App State
let currentState = {
    currentView: 'home',
    currentSong: null,
    isPlaying: false,
    queue: [...SONGS],
    history: ['home'],
    likedSongs: new Set([1, 4]),
    progress: 0,
    timer: null
};

// DOM Elements
const mainView = document.getElementById('main-view');
const miniPlayer = document.getElementById('mini-player');
const fullPlayer = document.getElementById('full-player');
const detailView = document.getElementById('detail-view');
const navItems = document.querySelectorAll('.nav-item');
const toastContainer = document.getElementById('toast-container');

// Initialization
function init() {
    renderHome();
    setupEventListeners();
    updateStatusBar();
}

function updateStatusBar() {
    const now = new Date();
    document.getElementById('status-time').textContent = 
        `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Navigation Logic
function switchView(viewName, addToHistory = true) {
    if (addToHistory && currentState.currentView !== viewName) {
        currentState.history.push(viewName);
    }
    
    currentState.currentView = viewName;
    
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
    });

    switch(viewName) {
        case 'home': renderHome(); break;
        case 'search': renderSearch(); break;
        case 'library': renderLibrary(); break;
        case 'profile': renderProfile(); break;
    }
    
    mainView.scrollTo(0, 0);
}

// Rendering Views
function renderHome() {
    mainView.innerHTML = `
        <h1>안녕하세요, 하준님</h1>
        
        <div class="section-title">
            <h2>추천 플레이리스트</h2>
            <a href="#" onclick="showToast('기능 준비 중입니다.')">모두 보기</a>
        </div>
        <div class="horizontal-scroll">
            ${PLAYLISTS.map(pl => `
                <div class="playlist-card" onclick="openPlaylist(${pl.id})">
                    <img src="${pl.art}" alt="${pl.title}">
                    <div class="title">${pl.title}</div>
                    <div class="subtitle">${pl.subtitle}</div>
                </div>
            `).join('')}
        </div>

        <div class="section-title">
            <h2>최근 들은 음악</h2>
        </div>
        <div class="song-list">
            ${SONGS.slice(0, 5).map(song => renderSongItem(song)).join('')}
        </div>
    `;
}

function renderSearch() {
    mainView.innerHTML = `
        <h1>검색</h1>
        <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" id="search-input" placeholder="아티스트, 곡, 앨범 검색">
        </div>
        
        <div id="search-results">
            <div class="section-title">
                <h2>장르별 탐색</h2>
            </div>
            <div class="category-grid">
                ${CATEGORIES.map(cat => `
                    <div class="category-item" style="background-color: ${cat.color}" onclick="showToast('${cat.title} 장르를 탐색합니다.')">
                        <h3>${cat.title}</h3>
                        <i class="fas ${cat.icon}"></i>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const resultsContainer = document.getElementById('search-results');
        
        if (query.length > 0) {
            const filtered = SONGS.filter(s => 
                s.title.toLowerCase().includes(query) || 
                s.artist.toLowerCase().includes(query)
            );
            
            resultsContainer.innerHTML = `
                <div class="section-title">
                    <h2>검색 결과</h2>
                </div>
                <div class="song-list">
                    ${filtered.length > 0 ? filtered.map(song => renderSongItem(song)).join('') : '<p style="padding: 20px; color: var(--text-secondary);">검색 결과가 없습니다.</p>'}
                </div>
            `;
        } else {
            renderSearch(); // Reset to categories
        }
    });
}

function renderLibrary() {
    const liked = SONGS.filter(s => currentState.likedSongs.has(s.id));
    mainView.innerHTML = `
        <h1>라이브러리</h1>
        
        <div class="song-item" onclick="openLikedSongs()">
            <div style="width: 48px; height: 48px; border-radius: 8px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                <i class="fas fa-heart" style="font-size: 20px;"></i>
            </div>
            <div class="info">
                <div class="title">좋아요 표시한 곡</div>
                <div class="subtitle">${liked.length}곡</div>
            </div>
        </div>

        <div class="section-title">
            <h2>나의 플레이리스트</h2>
            <button class="icon-btn" onclick="showToast('새 플레이리스트를 생성합니다.')"><i class="fas fa-plus"></i></button>
        </div>
        
        <div class="song-list">
            ${PLAYLISTS.slice(0, 2).map(pl => `
                <div class="song-item" onclick="openPlaylist(${pl.id})">
                    <img src="${pl.art}" alt="${pl.title}">
                    <div class="info">
                        <div class="title">${pl.title}</div>
                        <div class="subtitle">Playlist • ${pl.songs.length}곡</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderProfile() {
    mainView.innerHTML = `
        <h1>프로필</h1>
        <div style="display: flex; flex-direction: column; align-items: center; padding: 20px 0;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--card-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border: 2px solid var(--primary-color);">
                <i class="fas fa-user" style="font-size: 40px; color: var(--primary-color);"></i>
            </div>
            <h2 style="margin-bottom: 4px;">하준 (Hajun)</h2>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">프리미엄 멤버십 이용 중</p>
            
            <div style="width: 100%; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
                <div class="song-item" onclick="showToast('계정 설정으로 이동합니다.')">
                    <div class="info"><div class="title">계정</div></div>
                    <i class="fas fa-chevron-right" style="font-size: 14px; color: var(--text-secondary);"></i>
                </div>
                <div class="song-item" onclick="showToast('알림 설정으로 이동합니다.')">
                    <div class="info"><div class="title">알림</div></div>
                    <i class="fas fa-chevron-right" style="font-size: 14px; color: var(--text-secondary);"></i>
                </div>
                <div class="song-item" onclick="showToast('음질 및 데이터 설정으로 이동합니다.')">
                    <div class="info"><div class="title">음질</div></div>
                    <i class="fas fa-chevron-right" style="font-size: 14px; color: var(--text-secondary);"></i>
                </div>
            </div>
        </div>
    `;
}

function renderSongItem(song) {
    const isActive = currentState.currentSong && currentState.currentSong.id === song.id;
    return `
        <div class="song-item ${isActive ? 'active' : ''}" onclick="playSong(${song.id})">
            <img src="${song.art}" alt="${song.title}">
            <div class="info">
                <div class="title">${song.title}</div>
                <div class="subtitle">${song.artist}</div>
            </div>
            <button class="icon-btn" onclick="event.stopPropagation(); showSongMenu(${song.id})">
                <i class="fas fa-ellipsis-v" style="font-size: 14px; color: var(--text-secondary);"></i>
            </button>
        </div>
    `;
}

// Player Logic
function playSong(songId) {
    const song = SONGS.find(s => s.id === songId);
    if (!song) return;

    currentState.currentSong = song;
    currentState.isPlaying = true;
    currentState.progress = 0;
    
    updatePlayerUI();
    startTimer();
    
    miniPlayer.classList.remove('hidden');
    
    // Highlight active song in lists
    const activeItems = document.querySelectorAll('.song-item.active');
    activeItems.forEach(item => item.classList.remove('active'));
    
    // Find and highlight current song if it exists in the current view
    // (In a real app, we'd rerender the view or use data binding)
}

function togglePlay() {
    if (!currentState.currentSong) return;
    
    currentState.isPlaying = !currentState.isPlaying;
    if (currentState.isPlaying) {
        startTimer();
    } else {
        clearInterval(currentState.timer);
    }
    
    updatePlayerUI();
}

function updatePlayerUI() {
    const song = currentState.currentSong;
    if (!song) return;

    // Mini Player
    document.getElementById('mini-art').src = song.art;
    document.getElementById('mini-title').textContent = song.title;
    document.getElementById('mini-artist').textContent = song.artist;
    document.getElementById('mini-play-btn').innerHTML = currentState.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';

    // Full Player
    document.getElementById('player-art').src = song.art;
    document.getElementById('player-title').textContent = song.title;
    document.getElementById('player-artist').textContent = song.artist;
    document.getElementById('player-play-btn').innerHTML = currentState.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    document.getElementById('total-time').textContent = song.duration;
    
    const heartIcon = document.getElementById('player-like').querySelector('i');
    heartIcon.className = currentState.likedSongs.has(song.id) ? 'fas fa-heart' : 'far fa-heart';
}

function startTimer() {
    clearInterval(currentState.timer);
    currentState.timer = setInterval(() => {
        if (currentState.isPlaying) {
            currentState.progress += 1;
            if (currentState.progress > 100) {
                currentState.progress = 0;
                nextSong();
            }
            updateProgressBar();
        }
    }, 1000);
}

function updateProgressBar() {
    document.getElementById('progress-fill').style.width = `${currentState.progress}%`;
    const totalSecs = parseDuration(currentState.currentSong.duration);
    const currentSecs = Math.floor((currentState.progress / 100) * totalSecs);
    document.getElementById('current-time').textContent = formatTime(currentSecs);
}

function nextSong() {
    const currentIndex = currentState.queue.findIndex(s => s.id === currentState.currentSong.id);
    const nextIndex = (currentIndex + 1) % currentState.queue.length;
    playSong(currentState.queue[nextIndex].id);
}

function prevSong() {
    const currentIndex = currentState.queue.findIndex(s => s.id === currentState.currentSong.id);
    const prevIndex = (currentIndex - 1 + currentState.queue.length) % currentState.queue.length;
    playSong(currentState.queue[prevIndex].id);
}

// Helpers
function parseDuration(duration) {
    if (!duration) return 0;
    const [m, s] = duration.split(':').map(Number);
    return m * 60 + s;
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Overlays and Detail Views
function openPlaylist(id) {
    const pl = PLAYLISTS.find(p => p.id === id);
    if (!pl) return;

    const plSongs = SONGS.filter(s => pl.songs.includes(s.id));
    
    detailView.innerHTML = `
        <div class="detail-header">
            <img src="${pl.art}" class="detail-header-bg">
            <div class="detail-header-gradient"></div>
            <button class="icon-btn detail-back" onclick="closeDetail()"><i class="fas fa-chevron-left"></i></button>
            <div class="detail-info">
                <h1>${pl.title}</h1>
                <p>${pl.subtitle} • ${plSongs.length}곡</p>
            </div>
        </div>
        <div class="detail-actions">
            <button class="play-all-btn" onclick="playSong(${plSongs[0].id})"><i class="fas fa-play"></i> 재생</button>
            <button class="icon-btn" onclick="showToast('플레이리스트를 저장했습니다.')"><i class="far fa-heart"></i></button>
            <button class="icon-btn" onclick="showToast('공유 링크가 복사되었습니다.')"><i class="fas fa-share-nodes"></i></button>
        </div>
        <div class="detail-list">
            ${plSongs.map(song => renderSongItem(song)).join('')}
        </div>
    `;
    detailView.classList.remove('hidden');
}

function openLikedSongs() {
    const liked = SONGS.filter(s => currentState.likedSongs.has(s.id));
    
    detailView.innerHTML = `
        <div class="detail-header">
            <div class="detail-header-bg" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
            <div class="detail-header-gradient"></div>
            <button class="icon-btn detail-back" onclick="closeDetail()"><i class="fas fa-chevron-left"></i></button>
            <div class="detail-info">
                <h1>좋아요 표시한 곡</h1>
                <p>회원님의 라이브러리 • ${liked.length}곡</p>
            </div>
        </div>
        <div class="detail-actions">
            <button class="play-all-btn" onclick="playSong(${liked[0]?.id || 1})"><i class="fas fa-play"></i> 재생</button>
        </div>
        <div class="detail-list">
            ${liked.length > 0 ? liked.map(song => renderSongItem(song)).join('') : '<p style="padding: 20px; color: var(--text-secondary);">좋아요 표시한 곡이 없습니다.</p>'}
        </div>
    `;
    detailView.classList.remove('hidden');
}

function closeDetail() {
    detailView.classList.add('hidden');
}

function showSongMenu(id) {
    const song = SONGS.find(s => s.id === id);
    showToast(`'${song.title}' 옵션 메뉴 (데모)`);
}

// Event Listeners
function setupEventListeners() {
    // Nav
    navItems.forEach(item => {
        item.addEventListener('click', () => switchView(item.dataset.view));
    });

    // Player Toggle
    document.getElementById('open-player').addEventListener('click', () => {
        fullPlayer.classList.remove('hidden');
    });

    document.getElementById('close-player').addEventListener('click', () => {
        fullPlayer.classList.add('hidden');
    });

    // Controls
    document.getElementById('mini-play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    document.getElementById('player-play-btn').addEventListener('click', togglePlay);
    document.getElementById('player-next').addEventListener('click', nextSong);
    document.getElementById('player-prev').addEventListener('click', prevSong);
    document.getElementById('mini-next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        nextSong();
    });

    // Extra Controls (Predictability: Feedback)
    document.getElementById('player-like').addEventListener('click', () => {
        const id = currentState.currentSong.id;
        if (currentState.likedSongs.has(id)) {
            currentState.likedSongs.delete(id);
            showToast('좋아요를 취소했습니다.');
        } else {
            currentState.likedSongs.add(id);
            showToast('좋아요 표시한 곡에 추가했습니다.');
        }
        updatePlayerUI();
    });

    document.getElementById('shuffle-btn').addEventListener('click', function() {
        this.classList.toggle('active');
        showToast(this.classList.contains('active') ? '셔플 모드가 켜졌습니다.' : '셔플 모드가 꺼졌습니다.');
    });

    document.getElementById('repeat-btn').addEventListener('click', function() {
        this.classList.toggle('active');
        showToast(this.classList.contains('active') ? '반복 모드가 켜졌습니다.' : '반복 모드가 꺼졌습니다.');
    });

    document.getElementById('share-btn').addEventListener('click', () => {
        showToast('공유 옵션이 열렸습니다.');
    });

    document.getElementById('queue-btn').addEventListener('click', () => {
        showToast('재생 목록을 확인합니다.');
    });

    // Progress Bar Interaction
    document.getElementById('progress-bar').addEventListener('click', (e) => {
        const rect = e.target.closest('.progress-bar').getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        currentState.progress = percent * 100;
        updateProgressBar();
    });
}

// Start
init();
window.addEventListener('resize', () => {
    // Fix heights on resize if needed
});
