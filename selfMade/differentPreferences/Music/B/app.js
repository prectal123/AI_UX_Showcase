/**
 * Aura Music - Prototype Logic
 * Focusing on Predictability & Seamless Navigation
 */

// --- Mock Data ---
const MOCK_DATA = {
    songs: [
        { id: 1, title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", duration: 243, cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop" },
        { id: 2, title: "Starboy", artist: "The Weeknd", album: "Starboy", duration: 230, cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400&auto=format&fit=crop" },
        { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: 203, cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&h=400&auto=format&fit=crop" },
        { id: 4, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: 200, cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=400&h=400&auto=format&fit=crop" },
        { id: 5, title: "Stay", artist: "The Kid LAROI & Justin Bieber", album: "F*CK LOVE 3", duration: 141, cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=400&h=400&auto=format&fit=crop" },
        { id: 6, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: 238, cover: "https://images.unsplash.com/photo-1514525253344-99a4299966c2?q=80&w=400&h=400&auto=format&fit=crop" },
    ],
    albums: [
        { id: 101, title: "Hurry Up, We're Dreaming", artist: "M83", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop" },
        { id: 102, title: "Future Nostalgia", artist: "Dua Lipa", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&h=400&auto=format&fit=crop" },
        { id: 103, title: "After Hours", artist: "The Weeknd", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=400&h=400&auto=format&fit=crop" },
    ],
    playlists: [
        { id: 201, title: "Coding Focus", creator: "Alex", count: 42 },
        { id: 202, title: "Night Drive", creator: "Alex", count: 15 },
        { id: 203, title: "Summer Hits 2024", creator: "Aura", count: 120 },
    ]
};

// --- App State ---
const state = {
    currentView: 'home',
    history: ['home'],
    historyIndex: 0,
    playing: false,
    currentTrack: null,
    queue: [...MOCK_DATA.songs],
    favorites: new Set([1, 4]),
    volume: 0.7,
    currentTime: 0,
    shuffle: false,
    repeat: 'none', // none, one, all
};

// --- DOM Elements ---
const elements = {
    contentView: document.getElementById('content-view'),
    navHome: document.getElementById('nav-home'),
    navExplore: document.getElementById('nav-explore'),
    navLibrary: document.getElementById('nav-library'),
    sidebarPlaylists: document.getElementById('sidebar-playlists'),
    btnBack: document.getElementById('btn-back'),
    btnForward: document.getElementById('btn-forward'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    btnNext: document.getElementById('btn-next'),
    btnPrev: document.getElementById('btn-prev'),
    playerTitle: document.getElementById('player-title'),
    playerArtist: document.getElementById('player-artist'),
    playerArt: document.getElementById('player-art'),
    playerFavorite: document.getElementById('player-favorite'),
    trackProgress: document.getElementById('track-progress'),
    trackProgressFill: document.querySelector('#track-progress .progress-fill'),
    timeCurrent: document.querySelector('.time-current'),
    timeTotal: document.querySelector('.time-total'),
    toastContainer: document.getElementById('toast-container'),
    globalSearch: document.getElementById('global-search'),
    shareModal: document.getElementById('share-modal'),
    closeModal: document.getElementById('close-modal'),
};

// --- Initialization ---
function init() {
    renderSidebarPlaylists();
    navigateTo('home', false);
    setupEventListeners();
    updatePlayerUI();
    
    // Start progress timer simulation
    setInterval(updateProgress, 1000);
}

// --- Navigation Logic ---
function navigateTo(view, addToHistory = true) {
    state.currentView = view;
    
    if (addToHistory) {
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(view);
        state.historyIndex = state.history.length - 1;
    }
    
    // Clear search if not in search view
    if (!view.startsWith('search')) {
        elements.globalSearch.value = '';
    }

    updateNavUI();
    renderView(view);
    updateHistoryButtons();
}

function updateHistoryButtons() {
    elements.btnBack.disabled = state.historyIndex <= 0;
    elements.btnForward.disabled = state.historyIndex >= state.history.length - 1;
    elements.btnBack.style.opacity = elements.btnBack.disabled ? "0.3" : "1";
    elements.btnForward.style.opacity = elements.btnForward.disabled ? "0.3" : "1";
}

function updateNavUI() {
    [elements.navHome, elements.navExplore, elements.navLibrary].forEach(el => {
        el.classList.toggle('active', el.dataset.view === state.currentView);
    });
}

function renderView(view) {
    elements.contentView.innerHTML = '';
    
    switch(view) {
        case 'home':
            renderHomeView();
            break;
        case 'explore':
            renderExploreView();
            break;
        case 'library':
            renderLibraryView();
            break;
        case 'search':
            renderSearchView();
            break;
        default:
            if (view.startsWith('playlist:')) {
                const id = view.split(':')[1];
                renderPlaylistView(id);
            } else if (view.startsWith('album:')) {
                const id = view.split(':')[1];
                renderAlbumView(id);
            }
    }
    
    // Re-initialize icons for newly added content
    if (window.lucide) lucide.createIcons();
}

// --- View Renderers ---
function renderHomeView() {
    let html = `
        <div class="view-header">
            <h1>Good evening, Alex</h1>
        </div>
        
        <section class="section">
            <div class="section-header">
                <h2>Made For You</h2>
                <span class="see-all">Show all</span>
            </div>
            <div class="grid-layout">
                ${MOCK_DATA.songs.slice(0, 4).map(song => createMusicCard(song, 'song')).join('')}
            </div>
        </section>

        <section class="section">
            <div class="section-header">
                <h2>Recent Albums</h2>
                <span class="see-all">Show all</span>
            </div>
            <div class="grid-layout">
                ${MOCK_DATA.albums.map(album => createMusicCard(album, 'album')).join('')}
            </div>
        </section>
    `;
    elements.contentView.innerHTML = html;
}

function renderExploreView() {
    let html = `
        <div class="view-header">
            <h1>Explore Genres</h1>
        </div>
        <div class="grid-layout" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
            <div class="genre-card" style="background: linear-gradient(135deg, #f093fb, #f5576c); height: 120px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem; cursor: pointer;">Pop</div>
            <div class="genre-card" style="background: linear-gradient(135deg, #4facfe, #00f2fe); height: 120px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem; cursor: pointer;">Lo-Fi</div>
            <div class="genre-card" style="background: linear-gradient(135deg, #43e97b, #38f9d7); height: 120px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem; cursor: pointer;">Jazz</div>
            <div class="genre-card" style="background: linear-gradient(135deg, #fa709a, #fee140); height: 120px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem; cursor: pointer;">Indie</div>
        </div>
    `;
    elements.contentView.innerHTML = html;
}

function renderLibraryView() {
    const favoriteSongs = MOCK_DATA.songs.filter(s => state.favorites.has(s.id));
    let html = `
        <div class="view-header">
            <h1>Your Library</h1>
        </div>
        <section class="section">
            <div class="section-header" style="margin-top: 20px;">
                <div style="display: flex; gap: 20px;">
                    <button class="play-pause" onclick="playTrack(${favoriteSongs[0]?.id || 1})"><i data-lucide="play" fill="currentColor"></i></button>
                    <h2 style="align-self: center;">Liked Songs</h2>
                </div>
            </div>
            <div class="track-list" style="margin-top: 20px;">
                ${favoriteSongs.map(song => createTrackRow(song)).join('')}
                ${favoriteSongs.length === 0 ? '<p style="color: var(--text-muted)">No liked songs yet.</p>' : ''}
            </div>
        </section>
    `;
    elements.contentView.innerHTML = html;
}

function renderSearchView() {
    const query = elements.globalSearch.value.toLowerCase();
    const results = MOCK_DATA.songs.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.artist.toLowerCase().includes(query)
    );

    let html = `
        <div class="view-header">
            <h1>Search results for "${query}"</h1>
        </div>
        <div class="track-list" style="margin-top: 40px;">
            ${results.map(song => createTrackRow(song)).join('')}
            ${results.length === 0 ? '<p style="color: var(--text-muted)">No matches found.</p>' : ''}
        </div>
    `;
    elements.contentView.innerHTML = html;
}

function renderPlaylistView(id) {
    const playlist = MOCK_DATA.playlists.find(p => p.id == id);
    let html = `
        <div class="detail-header" style="display: flex; gap: 32px; margin-bottom: 40px; align-items: flex-end;">
            <div class="detail-art" style="width: 232px; height: 232px; background: linear-gradient(45deg, var(--primary), var(--secondary)); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="music" size="80"></i>
            </div>
            <div class="detail-info">
                <p style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; margin-bottom: 8px;">Playlist</p>
                <h1 style="font-size: 4rem; margin: 0 0 16px 0; letter-spacing: -2px;">${playlist.title}</h1>
                <p style="color: var(--text-muted)">Created by <strong>${playlist.creator}</strong> • ${playlist.count} songs</p>
            </div>
        </div>
        <div class="track-list">
            ${MOCK_DATA.songs.map(song => createTrackRow(song)).join('')}
        </div>
    `;
    elements.contentView.innerHTML = html;
}

// --- Components ---
function createMusicCard(item, type) {
    return `
        <div class="music-card" onclick="handleCardClick(${item.id}, '${type}')">
            <div class="card-img-wrapper">
                <img src="${item.cover}" alt="${item.title}">
                <div class="play-badge">
                    <i data-lucide="play" fill="white"></i>
                </div>
            </div>
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.artist}</p>
            </div>
        </div>
    `;
}

function createTrackRow(song) {
    const isLiked = state.favorites.has(song.id);
    return `
        <div class="track-row" onclick="playTrack(${song.id})" style="display: flex; align-items: center; padding: 10px 16px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
            <div style="width: 40px; color: var(--text-muted); font-size: 0.9rem;">${song.id}</div>
            <div style="flex: 1;">
                <div style="font-weight: 500;">${song.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${song.artist}</div>
            </div>
            <div style="width: 150px; color: var(--text-muted); font-size: 0.85rem;">${song.album}</div>
            <button class="btn-icon share-btn" onclick="openShareModal(event, ${song.id})" style="margin-right: 15px;">
                <i data-lucide="share-2"></i>
            </button>
            <button class="btn-icon" onclick="toggleFavorite(event, ${song.id})" style="margin-right: 20px;">
                <i data-lucide="heart" ${isLiked ? 'fill="var(--secondary)" color="var(--secondary)"' : ''}></i>
            </button>
            <div style="width: 50px; text-align: right; color: var(--text-muted); font-size: 0.85rem;">${formatTime(song.duration)}</div>
        </div>
    `;
}

// --- Event Handlers ---
function setupEventListeners() {
    elements.navHome.onclick = () => navigateTo('home');
    elements.navExplore.onclick = () => navigateTo('explore');
    elements.navLibrary.onclick = () => navigateTo('library');
    
    elements.btnBack.onclick = () => {
        if (state.historyIndex > 0) {
            state.historyIndex--;
            navigateTo(state.history[state.historyIndex], false);
        }
    };
    
    elements.btnForward.onclick = () => {
        if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            navigateTo(state.history[state.historyIndex], false);
        }
    };
    
    elements.btnPlayPause.onclick = togglePlay;
    elements.btnNext.onclick = playNext;
    elements.btnPrev.onclick = playPrev;
    
    elements.playerFavorite.onclick = () => {
        if (state.currentTrack) toggleFavorite(null, state.currentTrack.id);
    };

    elements.trackProgress.onclick = (e) => {
        if (!state.currentTrack) return;
        const rect = elements.trackProgress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        state.currentTime = pos * state.currentTrack.duration;
        updateProgressUI();
    };

    elements.globalSearch.oninput = (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 0) {
            if (state.currentView !== 'search') {
                navigateTo('search');
            } else {
                renderSearchView();
                if (window.lucide) lucide.createIcons();
            }
        } else if (query.length === 0 && state.currentView === 'search') {
            navigateTo('home');
        }
    };

    elements.closeModal.onclick = () => {
        elements.shareModal.classList.remove('active');
    };

    window.onclick = (e) => {
        if (e.target === elements.shareModal) {
            elements.shareModal.classList.remove('active');
        }
    };
}

function openShareModal(event, id) {
    if (event) event.stopPropagation();
    state.sharingId = id;
    elements.shareModal.classList.add('active');
    if (window.lucide) lucide.createIcons();
}

function copyMockLink() {
    const song = MOCK_DATA.songs.find(s => s.id === state.sharingId);
    const mockLink = `https://aura.music/track/${song.id}`;
    
    // In a real browser we'd use navigator.clipboard.writeText
    // For prototype, we just show a toast
    showToast(`Link for "${song.title}" copied to clipboard!`);
    elements.shareModal.classList.remove('active');
}

function handleCardClick(id, type) {
    if (type === 'song') {
        playTrack(id);
    } else if (type === 'album') {
        navigateTo(`album:${id}`);
    }
}

function renderSidebarPlaylists() {
    elements.sidebarPlaylists.innerHTML = MOCK_DATA.playlists.map(p => 
        `<li onclick="navigateTo('playlist:${p.id}')">${p.title}</li>`
    ).join('');
}

// --- Player Controls ---
function playTrack(id) {
    const track = MOCK_DATA.songs.find(s => s.id === id);
    if (!track) return;
    
    state.currentTrack = track;
    state.playing = true;
    state.currentTime = 0;
    
    updatePlayerUI();
}

function togglePlay() {
    if (!state.currentTrack) {
        playTrack(MOCK_DATA.songs[0].id);
        return;
    }
    state.playing = !state.playing;
    updatePlayerUI();
}

function playNext() {
    if (!state.currentTrack) return;
    const idx = MOCK_DATA.songs.findIndex(s => s.id === state.currentTrack.id);
    const nextIdx = (idx + 1) % MOCK_DATA.songs.length;
    playTrack(MOCK_DATA.songs[nextIdx].id);
}

function playPrev() {
    if (!state.currentTrack) return;
    const idx = MOCK_DATA.songs.findIndex(s => s.id === state.currentTrack.id);
    const prevIdx = (idx - 1 + MOCK_DATA.songs.length) % MOCK_DATA.songs.length;
    playTrack(MOCK_DATA.songs[prevIdx].id);
}

function updatePlayerUI() {
    if (state.currentTrack) {
        elements.playerTitle.innerText = state.currentTrack.title;
        elements.playerArtist.innerText = state.currentTrack.artist;
        elements.playerArt.src = state.currentTrack.cover;
        elements.timeTotal.innerText = formatTime(state.currentTrack.duration);
        
        const isLiked = state.favorites.has(state.currentTrack.id);
        elements.playerFavorite.querySelector('i').setAttribute('fill', isLiked ? 'var(--secondary)' : 'none');
        elements.playerFavorite.querySelector('i').setAttribute('color', isLiked ? 'var(--secondary)' : 'currentColor');
    }
    
    elements.btnPlayPause.innerHTML = `<i data-lucide="${state.playing ? 'pause' : 'play'}" fill="currentColor"></i>`;
    lucide.createIcons();
}

function updateProgress() {
    if (state.playing && state.currentTrack) {
        state.currentTime++;
        if (state.currentTime >= state.currentTrack.duration) {
            playNext();
        }
        updateProgressUI();
    }
}

function updateProgressUI() {
    if (!state.currentTrack) return;
    const percent = (state.currentTime / state.currentTrack.duration) * 100;
    elements.trackProgressFill.style.width = `${percent}%`;
    elements.timeCurrent.innerText = formatTime(state.currentTime);
}

// --- Predictability: Undo System ---
function toggleFavorite(event, id) {
    if (event) event.stopPropagation();
    
    const wasFavorite = state.favorites.has(id);
    const song = MOCK_DATA.songs.find(s => s.id === id);
    
    if (wasFavorite) {
        state.favorites.delete(id);
        showToast(`Removed "${song.title}" from library`, () => {
            state.favorites.add(id);
            refreshCurrentView();
            updatePlayerUI();
        });
    } else {
        state.favorites.add(id);
        showToast(`Added "${song.title}" to library`);
    }
    
    refreshCurrentView();
    updatePlayerUI();
}

function showToast(message, undoAction) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span>${message}</span>
        ${undoAction ? '<span class="toast-undo">Undo</span>' : ''}
    `;
    
    if (undoAction) {
        toast.querySelector('.toast-undo').onclick = () => {
            undoAction();
            toast.remove();
        };
    }
    
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function refreshCurrentView() {
    renderView(state.currentView);
}

// --- Utilities ---
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Start the app
window.onload = init;
