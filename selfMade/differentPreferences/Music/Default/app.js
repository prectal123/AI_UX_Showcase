// Mock Data
const MOCK_DATA = {
    artists: [
        { id: 1, name: 'Lofi Girl', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a342b?w=200&h=200&fit=crop' },
        { id: 2, name: 'Neon Soul', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&h=200&fit=crop' },
        { id: 3, name: 'The Midnight', img: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=200&h=200&fit=crop' },
        { id: 4, name: 'Synth Wave', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&h=200&fit=crop' },
        { id: 5, name: 'Ethereal', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&h=200&fit=crop' }
    ],
    tracks: [
        { id: 1, title: 'Midnight City', artist: 'Neon Soul', albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop', duration: 225 },
        { id: 2, title: 'Coffee & Dreams', artist: 'Lofi Girl', albumArt: 'https://images.unsplash.com/photo-1514525253361-bee8718a342b?w=400&h=400&fit=crop', duration: 180 },
        { id: 3, title: 'Electric Love', artist: 'The Midnight', albumArt: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400&h=400&fit=crop', duration: 210 },
        { id: 4, title: 'Stardust', artist: 'Synth Wave', albumArt: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop', duration: 245 },
        { id: 5, title: 'Lost in Echoes', artist: 'Ethereal', albumArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop', duration: 195 },
        { id: 6, title: 'After Hours', artist: 'Neon Soul', albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', duration: 200 },
        { id: 7, title: 'Rainy Sunday', artist: 'Lofi Girl', albumArt: 'https://images.unsplash.com/photo-1420161907993-e2c141d3bcdd?w=400&h=400&fit=crop', duration: 165 }
    ],
    genres: [
        { name: 'Pop', color: '#E91E63', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a342b?w=100' },
        { name: 'Lo-Fi', color: '#3F51B5', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100' },
        { name: 'Electronic', color: '#9C27B0', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100' },
        { name: 'Rock', color: '#FF9800', img: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=100' },
        { name: 'Jazz', color: '#795548', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100' },
        { name: 'Hip Hop', color: '#2196F3', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100' }
    ],
    playlists: [
        { id: 1, name: 'Daily Mix 1', owner: 'SonicStream', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&h=200&fit=crop' },
        { id: 2, name: 'Discover Weekly', owner: 'SonicStream', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&h=200&fit=crop' },
        { id: 3, name: 'Chill Vibes', owner: 'Alex Rivera', img: 'https://images.unsplash.com/photo-1420161907993-e2c141d3bcdd?w=200&h=200&fit=crop' }
    ]
};

// Application State
const state = {
    currentView: 'home',
    currentTrack: null,
    isPlaying: false,
    queue: [...MOCK_DATA.tracks],
    progress: 0,
    likedSongs: new Set(),
    playbackInterval: null
};

// DOM Elements
const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const miniPlayer = document.getElementById('mini-player');
const fullscreenPlayer = document.getElementById('fullscreen-player');
const miniProgress = document.getElementById('mini-progress');
const fullProgress = document.getElementById('full-progress');

// --- Initialization ---
function init() {
    renderHome();
    renderSearch();
    renderLibrary();
    setupEventListeners();
    
    // Set initial track
    setTrack(MOCK_DATA.tracks[0], false);
}

// --- View Rendering ---
function renderHome() {
    const artistsGrid = document.getElementById('featured-artists');
    artistsGrid.innerHTML = MOCK_DATA.artists.map(artist => `
        <div class="artist-card">
            <img src="${artist.img}" class="artist-img" alt="${artist.name}">
            <span>${artist.name}</span>
        </div>
    `).join('');

    const recentlyPlayedGrid = document.getElementById('recently-played');
    recentlyPlayedGrid.innerHTML = MOCK_DATA.tracks.slice(0, 4).map(track => `
        <div class="track-card" onclick="playTrackById(${track.id})">
            <img src="${track.albumArt}" class="track-img" alt="${track.title}">
            <h4>${track.title}</h4>
            <p>${track.artist}</p>
        </div>
    `).join('');

    const madeForYouList = document.getElementById('made-for-you');
    madeForYouList.innerHTML = MOCK_DATA.tracks.slice(4).map(track => `
        <div class="list-item" onclick="playTrackById(${track.id})">
            <img src="${track.albumArt}" alt="${track.title}">
            <div class="item-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            <button class="icon-btn"><i class="ph ph-dots-three"></i></button>
        </div>
    `).join('');
}

function renderSearch() {
    const genreGrid = document.getElementById('genre-grid');
    genreGrid.innerHTML = MOCK_DATA.genres.map(genre => `
        <div class="genre-card" style="background-color: ${genre.color}">
            <span>${genre.name}</span>
            <img src="${genre.img}" alt="${genre.name}">
        </div>
    `).join('');
}

function renderLibrary() {
    const libraryList = document.getElementById('library-list');
    libraryList.innerHTML = MOCK_DATA.playlists.map(playlist => `
        <div class="list-item">
            <img src="${playlist.img}" alt="${playlist.name}">
            <div class="item-info">
                <h4>${playlist.name}</h4>
                <p>Playlist • ${playlist.owner}</p>
            </div>
        </div>
    `).join('');
}

// --- Player Logic ---
function setTrack(track, shouldPlay = true) {
    state.currentTrack = track;
    state.progress = 0;
    
    // Update Mini Player UI
    document.getElementById('mini-album-art').src = track.albumArt;
    document.getElementById('mini-track-title').textContent = track.title;
    document.getElementById('mini-artist-name').textContent = track.artist;
    
    // Update Full Player UI
    document.getElementById('full-album-art').src = track.albumArt;
    document.getElementById('full-track-title').textContent = track.title;
    document.getElementById('full-artist-name').textContent = track.artist;
    document.getElementById('total-time').textContent = formatTime(track.duration);
    
    updateLikeButtonUI();
    
    if (shouldPlay) {
        play();
    } else {
        pause();
    }
    updateProgressUI();
}

function playTrackById(id) {
    const track = MOCK_DATA.tracks.find(t => t.id === id);
    if (track) setTrack(track, true);
}

function togglePlay() {
    if (state.isPlaying) pause();
    else play();
}

function play() {
    state.isPlaying = true;
    document.getElementById('mini-play-icon').className = 'ph-fill ph-pause';
    document.getElementById('full-play-icon').className = 'ph-fill ph-pause';
    
    if (state.playbackInterval) clearInterval(state.playbackInterval);
    state.playbackInterval = setInterval(() => {
        if (state.progress < state.currentTrack.duration) {
            state.progress++;
            updateProgressUI();
        } else {
            nextTrack();
        }
    }, 1000);
}

function pause() {
    state.isPlaying = false;
    document.getElementById('mini-play-icon').className = 'ph-fill ph-play';
    document.getElementById('full-play-icon').className = 'ph-fill ph-play';
    clearInterval(state.playbackInterval);
}

function nextTrack() {
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack.id);
    const nextIndex = (currentIndex + 1) % state.queue.length;
    setTrack(state.queue[nextIndex], state.isPlaying);
}

function prevTrack() {
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack.id);
    const prevIndex = (currentIndex - 1 + state.queue.length) % state.queue.length;
    setTrack(state.queue[prevIndex], state.isPlaying);
}

function updateProgressUI() {
    const percent = (state.progress / state.currentTrack.duration) * 100;
    miniProgress.style.width = `${percent}%`;
    fullProgress.style.width = `${percent}%`;
    document.querySelector('.progress-handle').style.left = `${percent}%`;
    document.getElementById('current-time').textContent = formatTime(state.progress);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateLikeButtonUI() {
    const likeBtn = document.getElementById('full-like-btn');
    if (state.likedSongs.has(state.currentTrack.id)) {
        likeBtn.classList.add('liked');
        likeBtn.innerHTML = '<i class="ph-fill ph-heart"></i>';
    } else {
        likeBtn.classList.remove('liked');
        likeBtn.innerHTML = '<i class="ph ph-heart"></i>';
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewId = item.getAttribute('data-view');
            switchView(viewId);
        });
    });

    // Player Toggle
    document.getElementById('mini-play-pause').addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    document.getElementById('full-play-pause').addEventListener('click', togglePlay);
    
    document.getElementById('mini-next').addEventListener('click', (e) => {
        e.stopPropagation();
        nextTrack();
    });
    document.getElementById('mini-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        prevTrack();
    });
    document.getElementById('full-next').addEventListener('click', nextTrack);
    document.getElementById('full-prev').addEventListener('click', prevTrack);

    // Open/Close Fullscreen Player
    document.getElementById('open-player-btn').addEventListener('click', () => {
        fullscreenPlayer.classList.add('active');
    });
    document.getElementById('close-player-btn').addEventListener('click', () => {
        fullscreenPlayer.classList.remove('active');
    });

    // Like Action
    document.getElementById('full-like-btn').addEventListener('click', () => {
        if (state.likedSongs.has(state.currentTrack.id)) {
            state.likedSongs.delete(state.currentTrack.id);
        } else {
            state.likedSongs.add(state.currentTrack.id);
        }
        updateLikeButtonUI();
    });

    // Share Modal
    document.querySelectorAll('.ph-share-network').forEach(btn => {
        btn.parentElement.addEventListener('click', () => {
            document.getElementById('share-modal').classList.add('active');
        });
    });
    document.getElementById('close-share-btn').addEventListener('click', () => {
        document.getElementById('share-modal').classList.remove('active');
    });

    // Search Filtering (Simulated)
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // Just a UI feedback for now
        console.log('Searching for:', query);
    });
}

function switchView(viewId) {
    state.currentView = viewId;
    
    // Update Nav
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewId);
        const icon = item.querySelector('i');
        if (item.getAttribute('data-view') === viewId) {
            icon.className = icon.className.replace('ph ', 'ph-fill ');
        } else {
            icon.className = icon.className.replace('ph-fill ', 'ph ');
        }
    });

    // Update Views
    views.forEach(view => {
        view.classList.toggle('active', view.id === `${viewId}-view`);
    });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', init);
