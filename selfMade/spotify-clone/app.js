// Initialize Lucide Icons
lucide.createIcons();

// Mock Data
const albums = [
    {
        id: 1,
        title: "Neon Nights",
        artist: "AstroGlow",
        img: "assets/neon_nights.png",
        color: "#4F46E5"
    },
    {
        id: 2,
        title: "Nightfall Chills",
        artist: "Coastal Dream",
        img: "assets/lofi_vibes.png",
        color: "#F59E0B"
    },
    {
        id: 3,
        title: "Cyber Resonance",
        artist: "Glitch Unit",
        img: "assets/cyberpunk_beats.png",
        color: "#10B981"
    },
    {
        id: 4,
        title: "Wilder Shore",
        artist: "Acoustic Traditions",
        img: "assets/acoustic_soul.png",
        color: "#8B5CF6"
    }
];

// Populate Grids
function populateGrid(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(album => `
        <div class="card" onclick="playAlbum(${album.id})">
            <div class="card-img-container">
                <img src="${album.img}" alt="${album.title}" loading="lazy">
                <div class="play-btn-overlay">
                    <i data-lucide="play" fill="currentColor"></i>
                </div>
            </div>
            <h4>${album.title}</h4>
            <p>${album.artist}</p>
        </div>
    `).join('');
    
    // Re-initialize icons for new elements
    lucide.createIcons();
}

// Global state
let isPlaying = false;
let currentAlbum = albums[0];

// Player Logic
function playAlbum(id) {
    const album = albums.find(a => a.id === id);
    if (!album) return;

    currentAlbum = album;
    
    // Update Player UI
    document.getElementById('current-album-img').src = album.img;
    document.getElementById('current-track-title').innerText = album.title;
    document.getElementById('current-artist').innerText = album.artist;
    
    // Update Hero background based on album color
    document.querySelector('.hero').style.background = `linear-gradient(135deg, ${album.color} 0%, #1A1A1A 100%)`;
    document.querySelector('.hero-title').innerText = album.title;
    
    // Force play state
    setPlayState(true);
}

const playPauseBtn = document.getElementById('play-pause-btn');
playPauseBtn.addEventListener('click', () => {
    setPlayState(!isPlaying);
});

function setPlayState(state) {
    isPlaying = state;
    playPauseBtn.innerHTML = isPlaying ? 
        '<i data-lucide="pause" fill="currentColor"></i>' : 
        '<i data-lucide="play" fill="currentColor"></i>';
    lucide.createIcons();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateGrid('recommendations-grid', albums);
    populateGrid('recent-grid', [...albums].reverse());
    
    // Scroll effect for header
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    
    mainContent.addEventListener('scroll', () => {
        if (mainContent.scrollTop > 50) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.8)';
            header.style.backdropFilter = 'blur(12px)';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
        }
    });

    // Sidebar navigation interactivity
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
});
