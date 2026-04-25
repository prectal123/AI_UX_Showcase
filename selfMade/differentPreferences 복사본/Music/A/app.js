// Mock Song Data
const songs = [
    {
        id: 1,
        title: "Neon Dreams",
        artist: "Midnight City",
        art: "https://picsum.photos/seed/music1/400",
        duration: 215,
        genre: "Electronic"
    },
    {
        id: 2,
        title: "Golden Hour",
        artist: "The Sunsets",
        art: "https://picsum.photos/seed/music2/400",
        duration: 188,
        genre: "Pop"
    },
    {
        id: 3,
        title: "Lost in Tokyo",
        artist: "Haruto K.",
        art: "https://picsum.photos/seed/music3/400",
        duration: 242,
        genre: "Lofi"
    },
    {
        id: 4,
        title: "Electric Pulse",
        artist: "Volt",
        art: "https://picsum.photos/seed/music4/400",
        duration: 195,
        genre: "Rock"
    },
    {
        id: 5,
        title: "Velvet Sky",
        artist: "Luna Blue",
        art: "https://picsum.photos/seed/music5/400",
        duration: 210,
        genre: "Jazz"
    },
    {
        id: 6,
        title: "Mountain Echo",
        artist: "Wilderness",
        art: "https://picsum.photos/seed/music6/400",
        duration: 305,
        genre: "Acoustic"
    }
];

// App State
let currentSongIndex = -1;
let isPlaying = false;
let currentTime = 0;
let playbackInterval = null;
let likedSongs = new Set();
let isShuffle = false;
let isRepeat = false;

// DOM Elements
const homeView = document.getElementById('home-view');
const searchView = document.getElementById('search-view');
const libraryView = document.getElementById('library-view');
const fullPlayer = document.getElementById('full-player');
const miniPlayer = document.getElementById('mini-player');
const shareModal = document.getElementById('share-modal');

// Initial Render
function init() {
    renderSongList('recommended-list', songs.slice(0, 3));
    renderSongList('new-releases-list', songs.slice(3));
    updateLibrary();
    setupEventListeners();
}

function renderSongList(containerId, songData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = songData.map((song, index) => `
        <div class="song-card" onclick="playSong(${songs.indexOf(song)})" role="button" aria-label="Play ${song.title} by ${song.artist}">
            <img src="${song.art}" alt="" class="song-art">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div style="font-size: 14px; color: var(--text-secondary);">${formatTime(song.duration)}</div>
        </div>
    `).join('');
}

// Navigation
function switchView(viewName) {
    [homeView, searchView, libraryView].forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

    if (viewName === 'home') {
        homeView.classList.add('active');
        document.getElementById('nav-home').classList.add('active');
    } else if (viewName === 'search') {
        searchView.classList.add('active');
        document.getElementById('nav-search').classList.add('active');
    } else if (viewName === 'library') {
        libraryView.classList.add('active');
        document.getElementById('nav-library').classList.add('active');
        updateLibrary();
    }
}

// Player Logic
function playSong(index) {
    if (index === currentSongIndex) {
        togglePlayPause();
        return;
    }

    currentSongIndex = index;
    const song = songs[currentSongIndex];
    
    // Update UI
    document.getElementById('mini-title').textContent = song.title;
    document.getElementById('mini-artist-name').textContent = song.artist;
    document.getElementById('mini-art').src = song.art;
    
    document.getElementById('full-title').textContent = song.title;
    document.getElementById('full-artist').textContent = song.artist;
    document.getElementById('full-art').src = song.art;
    document.getElementById('duration-time').textContent = formatTime(song.duration);
    
    // Reset Playback
    currentTime = 0;
    isPlaying = true;
    updatePlayerUI();
    startPlayback();
    
    // Show mini player if hidden
    miniPlayer.style.display = 'flex';
    
    // Update Like Button
    updateLikeButton();
}

function togglePlayPause() {
    if (currentSongIndex === -1) {
        playSong(0);
        return;
    }
    
    isPlaying = !isPlaying;
    updatePlayerUI();
    
    if (isPlaying) {
        startPlayback();
    } else {
        clearInterval(playbackInterval);
    }
}

function updatePlayerUI() {
    const playIcon = isPlaying ? 'fa-pause' : 'fa-play';
    document.getElementById('mini-play-pause').innerHTML = `<i class="fa-solid ${playIcon}"></i><span class="sr-only">${isPlaying ? 'Pause' : 'Play'}</span>`;
    document.getElementById('full-play-pause').innerHTML = `<i class="fa-solid ${playIcon}"></i>`;
}

function startPlayback() {
    clearInterval(playbackInterval);
    playbackInterval = setInterval(() => {
        if (currentTime < songs[currentSongIndex].duration) {
            currentTime++;
            updateProgress();
        } else {
            if (isRepeat) {
                currentTime = 0;
            } else {
                nextSong();
            }
        }
    }, 1000);
}

function updateProgress() {
    const song = songs[currentSongIndex];
    const percent = (currentTime / song.duration) * 100;
    
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-handle').style.left = `${percent}%`;
    document.getElementById('current-time').textContent = formatTime(currentTime);
}

function nextSong() {
    let nextIndex;
    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * songs.length);
    } else {
        nextIndex = (currentSongIndex + 1) % songs.length;
    }
    playSong(nextIndex);
}

function prevSong() {
    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(prevIndex);
}

function seek(e) {
    if (currentSongIndex === -1) return;
    const bar = document.getElementById('progress-bar');
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percent = x / width;
    
    currentTime = Math.floor(percent * songs[currentSongIndex].duration);
    updateProgress();
}

// Utility
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Full Player View
function toggleFullPlayer(show) {
    if (show) {
        fullPlayer.classList.add('visible');
    } else {
        fullPlayer.classList.remove('visible');
    }
}

// Library Logic
function toggleLike() {
    if (currentSongIndex === -1) return;
    const songId = songs[currentSongIndex].id;
    if (likedSongs.has(songId)) {
        likedSongs.delete(songId);
    } else {
        likedSongs.add(songId);
    }
    updateLikeButton();
    updateLibrary();
}

function updateLikeButton() {
    const btn = document.getElementById('like-btn');
    if (currentSongIndex !== -1 && likedSongs.has(songs[currentSongIndex].id)) {
        btn.innerHTML = `<i class="fa-solid fa-heart" style="color: var(--error);"></i>`;
        btn.setAttribute('aria-label', 'Unlike');
    } else {
        btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
        btn.setAttribute('aria-label', 'Like');
    }
}

function updateLibrary() {
    const list = document.getElementById('liked-songs-list');
    if (!list) return;
    
    if (likedSongs.size === 0) {
        list.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 40px;">No liked songs yet.</p>`;
        return;
    }

    const likedData = songs.filter(s => likedSongs.has(s.id));
    list.innerHTML = likedData.map(song => `
        <div class="song-card" onclick="playSong(${songs.indexOf(song)})">
            <img src="${song.art}" alt="" class="song-art">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <i class="fa-solid fa-heart" style="color: var(--error);"></i>
        </div>
    `).join('');
}

// Search Logic
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const results = songs.filter(s => 
            s.title.toLowerCase().includes(query) || 
            s.artist.toLowerCase().includes(query)
        );
        renderSearchResults(results, query);
    });
}

function renderSearchResults(results, query) {
    const container = document.getElementById('search-results');
    if (!query) {
        container.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 40px;">Search for your favorite music.</p>`;
        return;
    }

    if (results.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 40px;">No results found for "${query}"</p>`;
        return;
    }

    container.innerHTML = results.map(song => `
        <div class="song-card" onclick="playSong(${songs.indexOf(song)})">
            <img src="${song.art}" alt="" class="song-art">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        </div>
    `).join('');
}

// Shuffle & Repeat
function toggleShuffle() {
    isShuffle = !isShuffle;
    const btn = document.getElementById('shuffle-btn');
    btn.style.color = isShuffle ? 'var(--accent-primary)' : 'white';
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    const btn = document.getElementById('repeat-btn');
    btn.style.color = isRepeat ? 'var(--accent-primary)' : 'white';
}

// Share Logic
function openShareModal() {
    shareModal.style.display = 'flex';
}

function closeShareModal() {
    shareModal.style.display = 'none';
}

function performShare(platform) {
    const song = songs[currentSongIndex];
    alert(`Shared "${song.title}" by ${song.artist} via ${platform}!`);
    closeShareModal();
}

// Initialize
window.onload = init;
