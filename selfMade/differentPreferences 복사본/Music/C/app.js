// Mock Data
const tracks = [
    { id: 1, title: "Synthetic Dreams", artist: "Stardust Reflections", cover: "assets/cover1.png", duration: "3:45", genre: "Synthwave" },
    { id: 2, title: "Wilder Glow", artist: "Eliza Stone", cover: "assets/cover2.png", duration: "4:12", genre: "Indie Folk" },
    { id: 3, title: "Mechanical Dissidence", artist: "System Failure", cover: "assets/cover3.png", duration: "5:30", genre: "Dark Techno" },
    { id: 4, title: "Neon Nights", artist: "Cyber Runner", cover: "assets/cover1.png", duration: "3:20", genre: "Synthwave" },
    { id: 5, title: "Morning Dew", artist: "Forest Whisper", cover: "assets/cover2.png", duration: "2:55", genre: "Indie Folk" },
    { id: 6, title: "Data Stream", artist: "Binary Soul", cover: "assets/cover3.png", duration: "6:15", genre: "Dark Techno" },
];

let library = [tracks[0], tracks[1]];
let currentTrack = tracks[0];
let isPlaying = false;
let progressInterval;

// DOM Elements
const views = {
    home: document.getElementById('home-view'),
    search: document.getElementById('search-view'),
    library: document.getElementById('library-view'),
    share: document.getElementById('share-view')
};

const navBtns = {
    home: document.getElementById('nav-home'),
    search: document.getElementById('nav-search'),
    library: document.getElementById('nav-library'),
    share: document.getElementById('nav-share'),
    logo: document.getElementById('logo-home')
};

const player = {
    art: document.getElementById('player-art'),
    title: document.getElementById('player-title'),
    artist: document.getElementById('player-artist'),
    playBtn: document.getElementById('main-play-btn'),
    playIcon: document.getElementById('play-icon'),
    progress: document.getElementById('player-progress'),
    currentTime: document.getElementById('current-time'),
    totalTime: document.getElementById('total-time')
};

const trendingGrid = document.getElementById('trending-grid');
const searchResults = document.getElementById('search-results');
const libraryList = document.getElementById('library-list');
const toast = document.getElementById('toast');

// Initialize
function init() {
    renderTracks(tracks, trendingGrid);
    renderLibrary();
    setupEventListeners();
    lucide.createIcons();
}

// Navigation Logic
function switchView(viewName) {
    // Hide all views
    Object.values(views).forEach(v => v.classList.add('hidden'));
    // Show target view
    views[viewName].classList.remove('hidden');
    
    // Update nav states
    Object.keys(navBtns).forEach(k => {
        if (navBtns[k]) navBtns[k].classList.remove('active');
    });
    if (navBtns[viewName]) navBtns[viewName].classList.add('active');

    // Feedback: Scroll to top
    document.getElementById('app').scrollTop = 0;
}

// Render Functions
function renderTracks(data, container) {
    container.innerHTML = '';
    data.forEach(track => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = `
            <img src="${track.cover}" alt="${track.title}">
            <div class="play-overlay">
                <i data-lucide="play"></i>
            </div>
            <div class="track-info">
                <div class="title">${track.title}</div>
                <div class="artist">${track.artist}</div>
            </div>
            <button class="add-lib-btn" onclick="event.stopPropagation(); addToLibrary(${JSON.stringify(track).replace(/"/g, '&quot;')})">
                <i data-lucide="plus"></i>
            </button>
        `;
        card.onclick = () => playTrack(track);
        container.appendChild(card);
    });
    lucide.createIcons();
}

function renderLibrary() {
    libraryList.innerHTML = '';
    library.forEach(track => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <img src="${track.cover}" alt="${track.title}">
            <div class="list-item-info">
                <div class="title">${track.title}</div>
                <div class="artist">${track.artist}</div>
            </div>
            <button class="icon-btn" onclick="removeFromLibrary(event, ${track.id})">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        item.onclick = () => playTrack(track);
        libraryList.appendChild(item);
    });
    lucide.createIcons();
}

// Player Logic
function playTrack(track) {
    currentTrack = track;
    player.art.src = track.cover;
    player.title.innerText = track.title;
    player.artist.innerText = track.artist;
    player.totalTime.innerText = track.duration;
    
    isPlaying = true;
    updatePlayIcon();
    startProgress();
    
    showToast(`Playing ${track.title}`);
}

function togglePlay() {
    isPlaying = !isPlaying;
    updatePlayIcon();
    if (isPlaying) startProgress();
    else stopProgress();
}

function updatePlayIcon() {
    player.playIcon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    lucide.createIcons();
}

function startProgress() {
    stopProgress();
    let currentSeconds = 0;
    const [min, sec] = currentTrack.duration.split(':').map(Number);
    const totalSeconds = (min * 60) + sec;

    progressInterval = setInterval(() => {
        currentSeconds++;
        if (currentSeconds > totalSeconds) {
            stopProgress();
            isPlaying = false;
            updatePlayIcon();
            return;
        }
        
        const m = Math.floor(currentSeconds / 60);
        const s = currentSeconds % 60;
        player.currentTime.innerText = `${m}:${s.toString().padStart(2, '0')}`;
        
        const percent = (currentSeconds / totalSeconds) * 100;
        player.progress.style.width = `${percent}%`;
    }, 1000);
}

function stopProgress() {
    clearInterval(progressInterval);
}

// Library Actions
function addToLibrary(track) {
    if (!library.find(t => t.id === track.id)) {
        library.push(track);
        renderLibrary();
        showToast("Added to library!");
    } else {
        showToast("Already in library");
    }
}

function removeFromLibrary(event, id) {
    event.stopPropagation();
    library = library.filter(t => t.id !== id);
    renderLibrary();
    showToast("Removed from library");
}

// Search Logic
function handleSearch(query) {
    const filtered = tracks.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) || 
        t.artist.toLowerCase().includes(query.toLowerCase())
    );
    renderTracks(filtered, searchResults);
}

// Share Logic
function handlePostVibe() {
    const title = document.querySelector('.share-form input[placeholder*="track"]').value;
    const artist = document.querySelector('.share-form input[placeholder*="Who"]').value;
    const genre = document.querySelector('.share-form select').value;
    
    if (!title || !artist) {
        showToast("Please fill in all fields");
        return;
    }

    const newTrack = {
        id: tracks.length + 1,
        title: title,
        artist: artist,
        cover: genre === "Synthwave" ? "assets/cover1.png" : (genre === "Indie Folk" ? "assets/cover2.png" : "assets/cover3.png"),
        duration: "3:30",
        genre: genre
    };

    tracks.unshift(newTrack);
    renderTracks(tracks, trendingGrid);
    showToast("Vibe Shared Successfully!");
    switchView('home');
    
    // Clear form
    document.querySelectorAll('.share-form input').forEach(i => i.value = '');
}

// UI Feedback
function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function skipTrack(direction) {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = tracks.length - 1;
    if (nextIndex >= tracks.length) nextIndex = 0;
    playTrack(tracks[nextIndex]);
}

// Event Listeners
function setupEventListeners() {
    navBtns.home.onclick = () => switchView('home');
    navBtns.search.onclick = () => switchView('search');
    navBtns.library.onclick = () => switchView('library');
    navBtns.share.onclick = () => switchView('share');
    navBtns.logo.onclick = () => switchView('home');

    player.playBtn.onclick = togglePlay;
    
    // Skip Buttons
    document.querySelectorAll('.player-controls .icon-btn')[0].onclick = () => skipTrack(-1);
    document.querySelectorAll('.player-controls .icon-btn')[1].onclick = () => skipTrack(1);

    const searchBar = document.querySelector('.search-bar');
    searchBar.oninput = (e) => handleSearch(e.target.value);

    document.getElementById('post-vibe-btn').onclick = handlePostVibe;

    // Volume Slider Mock
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-fill');
    volumeSlider.onclick = (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        volumeFill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
        showToast(`Volume set to ${Math.round(percent)}%`);
    };

    // Progress Bar Interaction
    const progressBar = document.querySelector('.progress-bar');
    progressBar.onclick = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        player.progress.style.width = `${percent}%`;
        showToast(`Seek to ${Math.round(percent)}%`);
    };
}

init();
