// Mock Data
const songs = [
    { id: 1, title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", cover: "https://picsum.photos/seed/m83/300/300", duration: 243 },
    { id: 2, title: "Starboy", artist: "The Weeknd", album: "Starboy", cover: "https://picsum.photos/seed/weeknd/300/300", duration: 230 },
    { id: 3, title: "Level of Concern", artist: "Twenty One Pilots", album: "Single", cover: "https://picsum.photos/seed/top/300/300", duration: 220 },
    { id: 4, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", cover: "https://picsum.photos/seed/lights/300/300", duration: 200 },
    { id: 5, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", cover: "https://picsum.photos/seed/glass/300/300", duration: 238 },
    { id: 6, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", cover: "https://picsum.photos/seed/dua/300/300", duration: 203 },
    { id: 7, title: "Bad Habit", artist: "Steve Lacy", album: "Gemini Rights", cover: "https://picsum.photos/seed/steve/300/300", duration: 232 },
    { id: 8, title: "As It Was", artist: "Harry Styles", album: "Harry's House", cover: "https://picsum.photos/seed/harry/300/300", duration: 167 }
];

const playlists = [
    { id: 1, name: "Chill Vibes", tracks: [1, 5, 7] },
    { id: 2, name: "Workout Mix", tracks: [2, 4, 6] },
    { id: 3, name: "Midnight Jazz", tracks: [1, 8] },
    { id: 4, name: "Indie Gems", tracks: [3, 5, 7] }
];

const sharedSongs = [
    { from: "Sarah Miller", songId: 5, message: "This reminds me of our road trip!", timestamp: "2 hours ago" },
    { from: "Jason Park", songId: 1, message: "Check out this classic.", timestamp: "Yesterday" }
];

// App State
let currentState = {
    currentView: 'home',
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    volume: 0.7,
    queue: [...songs],
    currentQueueIndex: -1
};

// DOM Elements
const viewContainer = document.getElementById('view-container');
const navItems = document.querySelectorAll('.nav-item');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerArt = document.getElementById('player-art');
const btnPlay = document.getElementById('btn-play');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnShare = document.getElementById('btn-share-music');
const shareModal = document.getElementById('share-modal');
const btnCloseModal = document.querySelectorAll('.btn-close-modal');
const shareSongSelect = document.getElementById('share-song-select');
const btnConfirmShare = document.getElementById('btn-confirm-share');

// Initialize App
function init() {
    renderHome();
    setupEventListeners();
    populateShareSelect();
}

function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            switchView(view);
            
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Player Controls
    btnPlay.addEventListener('click', togglePlay);
    btnPrev.addEventListener('click', playPrevious);
    btnNext.addEventListener('click', playNext);

    // Share Modal
    btnShare.addEventListener('click', () => shareModal.classList.remove('hidden'));
    btnCloseModal.forEach(btn => btn.addEventListener('click', () => shareModal.classList.add('hidden')));
    
    btnConfirmShare.addEventListener('click', () => {
        const songId = shareSongSelect.value;
        if (!songId) return alert('Please select a song to share!');
        
        alert('Song shared successfully with your friends!');
        shareModal.classList.add('hidden');
    });

    // Like Button
    document.querySelector('.btn-like').addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            showToast('Added to Liked Songs');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            showToast('Removed from Liked Songs');
        }
    });

    // Create Playlist
    document.querySelector('.btn-create-playlist').addEventListener('click', () => {
        const name = prompt('Enter playlist name:', 'New Playlist');
        if (name) {
            alert(`Playlist "${name}" created!`);
        }
    });

    // Search
    document.getElementById('global-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            renderSearch(query);
        } else if (query.length === 0) {
            switchView(currentState.currentView);
        }
    });

    // Playlist clicks
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(item.getAttribute('data-playlist'));
            renderPlaylist(id);
        });
    });
}

// Router/View Switcher
function switchView(view) {
    currentState.currentView = view;
    switch(view) {
        case 'home': renderHome(); break;
        case 'explore': renderExplore(); break;
        case 'library': renderLibrary(); break;
        case 'sharing': renderSharing(); break;
    }
}

// Rendering Functions
function renderHome() {
    viewContainer.innerHTML = `
        <div class="animate-fade-in">
            <header class="view-header">
                <h1>Good Evening</h1>
                <p>Curated just for you today.</p>
            </header>
            
            <h2 class="section-title">Trending Now</h2>
            <div class="grid-container">
                ${songs.slice(0, 4).map(song => createSongCard(song)).join('')}
            </div>

            <h2 class="section-title">Recently Played</h2>
            <div class="grid-container">
                ${songs.slice(4, 8).map(song => createSongCard(song)).join('')}
            </div>
        </div>
    `;
    attachCardListeners();
}

function renderExplore() {
    viewContainer.innerHTML = `
        <div class="animate-fade-in">
            <header class="view-header">
                <h1>Explore</h1>
                <p>Discover new sounds and artists.</p>
            </header>
            <div class="grid-container">
                ${songs.map(song => createSongCard(song)).join('')}
            </div>
        </div>
    `;
    attachCardListeners();
}

function renderLibrary() {
    viewContainer.innerHTML = `
        <div class="animate-fade-in">
            <header class="view-header">
                <h1>Your Library</h1>
                <p>Everything you've liked and created.</p>
            </header>
            <h2 class="section-title">Your Playlists</h2>
            <div class="grid-container">
                ${playlists.map(p => `
                    <div class="card" onclick="renderPlaylist(${p.id})">
                        <img src="https://picsum.photos/seed/playlist${p.id}/300/300" class="card-img">
                        <div class="card-title">${p.name}</div>
                        <div class="card-subtitle">${p.tracks.length} tracks</div>
                        <div class="btn-play-card"><i class="fas fa-play"></i></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderSharing() {
    viewContainer.innerHTML = `
        <div class="animate-fade-in">
            <header class="view-header">
                <h1>Shared with Me</h1>
                <p>Music sent by your friends.</p>
            </header>
            <div class="sharing-list">
                ${sharedSongs.map(share => {
                    const song = songs.find(s => s.id === share.songId);
                    return `
                        <div class="card" style="display: flex; flex-direction: row; align-items: center; gap: 20px; width: 100%; margin-bottom: 16px;">
                            <img src="${song.cover}" style="width: 80px; height: 80px; border-radius: 8px;">
                            <div style="flex: 1;">
                                <div class="card-title">${song.title}</div>
                                <div class="card-subtitle">${song.artist}</div>
                                <div style="margin-top: 8px; font-style: italic; color: var(--accent);">
                                    "${share.message}" — ${share.from}
                                </div>
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">${share.timestamp}</div>
                            <button class="btn-primary btn-play-shared" data-id="${song.id}">Play</button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.querySelectorAll('.btn-play-shared').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            playSong(id);
        });
    });
}

function renderPlaylist(id) {
    const playlist = playlists.find(p => p.id === id);
    const playlistSongs = songs.filter(s => playlist.tracks.includes(s.id));
    
    viewContainer.innerHTML = `
        <div class="animate-fade-in">
            <header class="view-header" style="display: flex; gap: 32px; align-items: flex-end;">
                <img src="https://picsum.photos/seed/playlist${id}/300/300" style="width: 200px; height: 200px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                <div>
                    <p style="text-transform: uppercase; font-size: 0.8rem; font-weight: bold; margin-bottom: 8px;">Playlist</p>
                    <h1 style="font-size: 4rem; margin-bottom: 16px;">${playlist.name}</h1>
                    <p>${playlistSongs.length} songs • SonicShare Curated</p>
                </div>
            </header>
            
            <div style="margin-top: 32px;">
                <div style="display: grid; grid-template-columns: 40px 1fr 1fr 100px; padding: 12px; color: var(--text-secondary); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem;">
                    <div>#</div>
                    <div>Title</div>
                    <div>Album</div>
                    <div style="text-align: right;"><i class="far fa-clock"></i></div>
                </div>
                ${playlistSongs.map((song, index) => `
                    <div class="song-row" onclick="playSong(${song.id})" style="display: grid; grid-template-columns: 40px 1fr 1fr 100px; padding: 12px; align-items: center; cursor: pointer; border-radius: 8px; transition: var(--transition);">
                        <div style="color: var(--text-secondary);">${index + 1}</div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${song.cover}" style="width: 40px; height: 40px; border-radius: 4px;">
                            <div>
                                <div style="font-weight: 500;">${song.title}</div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">${song.artist}</div>
                            </div>
                        </div>
                        <div style="color: var(--text-secondary);">${song.album}</div>
                        <div style="text-align: right; color: var(--text-secondary);">${formatTime(song.duration)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add some style for the song row hover
    const style = document.createElement('style');
    style.innerHTML = `
        .song-row:hover { background: rgba(255,255,255,0.05); }
    `;
    document.head.appendChild(style);
}

function renderSearch(query) {
    const results = songs.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.artist.toLowerCase().includes(query)
    );
    
    viewContainer.innerHTML = `
        <div class="animate-fade-in">
            <header class="view-header">
                <h1>Search Results for "${query}"</h1>
            </header>
            <div class="grid-container">
                ${results.length > 0 ? results.map(song => createSongCard(song)).join('') : '<p>No results found.</p>'}
            </div>
        </div>
    `;
    attachCardListeners();
}

// Helpers
function createSongCard(song) {
    return `
        <div class="card" data-id="${song.id}">
            <img src="${song.cover}" class="card-img" alt="${song.title}">
            <div class="card-title">${song.title}</div>
            <div class="card-subtitle">${song.artist}</div>
            <div class="btn-play-card"><i class="fas fa-play"></i></div>
        </div>
    `;
}

function attachCardListeners() {
    document.querySelectorAll('.card[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.getAttribute('data-id'));
            playSong(id);
        });
    });
}

function populateShareSelect() {
    songs.forEach(song => {
        const option = document.createElement('option');
        option.value = song.id;
        option.textContent = `${song.title} - ${song.artist}`;
        shareSongSelect.appendChild(option);
    });
}

// Player Logic
function playSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    currentState.currentSong = song;
    currentState.isPlaying = true;
    currentState.currentTime = 0;
    currentState.currentQueueIndex = currentState.queue.findIndex(s => s.id === id);

    updatePlayerUI();
    startTimer();
}

function togglePlay() {
    if (!currentState.currentSong) {
        playSong(songs[0].id);
        return;
    }
    
    currentState.isPlaying = !currentState.isPlaying;
    updatePlayerUI();
    
    if (currentState.isPlaying) startTimer();
    else stopTimer();
}

function playNext() {
    let nextIndex = currentState.currentQueueIndex + 1;
    if (nextIndex >= currentState.queue.length) nextIndex = 0;
    playSong(currentState.queue[nextIndex].id);
}

function playPrevious() {
    let prevIndex = currentState.currentQueueIndex - 1;
    if (prevIndex < 0) prevIndex = currentState.queue.length - 1;
    playSong(currentState.queue[prevIndex].id);
}

function updatePlayerUI() {
    const song = currentState.currentSong;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerArt.src = song.cover;
    totalTimeEl.textContent = formatTime(song.duration);
    
    btnPlay.innerHTML = currentState.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

let timer;
function startTimer() {
    stopTimer();
    timer = setInterval(() => {
        if (currentState.currentTime >= currentState.currentSong.duration) {
            playNext();
            return;
        }
        
        currentState.currentTime++;
        updateProgress();
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function updateProgress() {
    const song = currentState.currentSong;
    const percent = (currentState.currentTime / song.duration) * 100;
    progressFill.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentState.currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 110px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: fadeIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Start the app
init();
