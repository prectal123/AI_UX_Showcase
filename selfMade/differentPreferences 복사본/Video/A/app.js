const MOCK_VIDEOS = [
    {
        id: 'v1',
        title: '평화로운 산속 호수의 하루 - 4K 자연 힐링',
        creator: '자연의소리',
        creatorAvatar: 'https://picsum.photos/id/10/100/100',
        views: '1.2M회',
        date: '2일 전',
        duration: '10:05',
        thumbnail: 'https://picsum.photos/id/10/640/360',
        description: '지친 일상을 떠나 산속 호수의 고요함을 만끽해보세요. 4K 고화질로 담아낸 자연의 아름다움입니다. 명상이나 공부할 때 틀어두기 좋습니다.'
    },
    {
        id: 'v2',
        title: '2026년형 최신 데스크탑 셋업 투어 (생산성 극대화)',
        creator: '테크마스터',
        creatorAvatar: 'https://picsum.photos/id/20/100/100',
        views: '450K회',
        date: '1주일 전',
        duration: '15:20',
        thumbnail: 'https://picsum.photos/id/20/640/360',
        description: '드디어 완성된 저의 새로운 작업실을 공개합니다! 어떤 장비들을 사용하는지, 케이블 정리는 어떻게 했는지 자세히 알려드릴게요.'
    },
    {
        id: 'v3',
        title: '실패 없는 정통 까르보나라 만들기 (이탈리아 셰프 비법)',
        creator: '쿠킹클래스',
        creatorAvatar: 'https://picsum.photos/id/30/100/100',
        views: '890K회',
        date: '3일 전',
        duration: '08:45',
        thumbnail: 'https://picsum.photos/id/30/640/360',
        description: '생크림 없이 계란 노른자와 치즈로만 만드는 진짜 까르보나라! 집에서도 레스토랑 맛을 낼 수 있는 핵심 포인트를 공개합니다.'
    },
    {
        id: 'v4',
        title: '초보자를 위한 자바스크립트 기초 강의 #1',
        creator: '코딩캠프',
        creatorAvatar: 'https://picsum.photos/id/40/100/100',
        views: '2.5M회',
        date: '1개월 전',
        duration: '22:10',
        thumbnail: 'https://picsum.photos/id/40/640/360',
        description: '코딩을 처음 시작하시나요? 가장 인기 있는 언어인 자바스크립트의 기초부터 차근차근 배워봅시다. 변수와 자료형에 대해 알아봅니다.'
    },
    {
        id: 'v5',
        title: '아이슬란드 오로라 여행 브이로그 | 꿈꾸던 그곳',
        creator: '트래블러',
        creatorAvatar: 'https://picsum.photos/id/50/100/100',
        views: '320K회',
        date: '5일 전',
        duration: '12:30',
        thumbnail: 'https://picsum.photos/id/50/640/360',
        description: '살면서 꼭 한번은 가봐야 할 아이슬란드! 밤하늘을 수놓는 환상적인 오로라와 대자연의 경이로움을 영상에 담았습니다.'
    },
    {
        id: 'v6',
        title: '아침을 깨우는 10분 요가 루틴',
        creator: '요가라이프',
        creatorAvatar: 'https://picsum.photos/id/60/100/100',
        views: '1.8M회',
        date: '2주일 전',
        duration: '10:00',
        thumbnail: 'https://picsum.photos/id/60/640/360',
        description: '몸이 찌뿌둥한 아침, 가벼운 스트레칭으로 활기를 되찾으세요. 누구나 따라 할 수 있는 쉬운 동작들로 구성했습니다.'
    },
    {
        id: 'v7',
        title: '최신 인디 팝 플레이리스트 (일할 때 듣기 좋은 노래)',
        creator: '뮤직박스',
        creatorAvatar: 'https://picsum.photos/id/70/100/100',
        views: '740K회',
        date: '4일 전',
        duration: '45:00',
        thumbnail: 'https://picsum.photos/id/70/640/360',
        description: '잔잔하면서도 감각적인 인디 팝 곡들을 모았습니다. 집중이 필요할 때나 카페 분위기를 내고 싶을 때 추천합니다.'
    },
    {
        id: 'v8',
        title: '강아지와 함께하는 주말 일상 VLOG',
        creator: '해피독',
        creatorAvatar: 'https://picsum.photos/id/80/100/100',
        views: '510K회',
        date: '1일 전',
        duration: '09:15',
        thumbnail: 'https://picsum.photos/id/80/640/360',
        description: '우리 집 귀염둥이 초코와 함께 산책도 가고 맛있는 간식도 만드는 평범하지만 행복한 주말 이야기입니다.'
    }
];

// App State
const state = {
    currentView: 'home',
    currentVideo: null,
    searchQuery: '',
    history: ['home']
};

// DOM Elements
const views = {
    home: document.getElementById('view-home'),
    detail: document.getElementById('view-detail'),
    library: document.getElementById('view-library')
};

const mainGrid = document.getElementById('main-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const uploadModal = document.getElementById('upload-modal');

// --- Rendering Functions ---

function createVideoCard(video) {
    const card = document.createElement('article');
    card.className = 'video-card fade-in';
    card.innerHTML = `
        <div class="video-thumbnail" role="button" aria-label="${video.title} 재생" tabindex="0">
            <img src="${video.thumbnail}" alt="${video.title} 썸네일" loading="lazy">
            <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
            <img src="${video.creatorAvatar}" alt="${video.creator} 프로필" class="creator-avatar" loading="lazy">
            <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <span class="creator-name">${video.creator}</span><br>
                    <span>조회수 ${video.views} • ${video.date}</span>
                </div>
            </div>
        </div>
    `;
    
    // Accessibility: Keyboard support
    const thumb = card.querySelector('.video-thumbnail');
    const handleAction = () => navigateToDetail(video.id);
    
    thumb.addEventListener('click', handleAction);
    thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAction();
        }
    });
    
    return card;
}

function renderHome(videoList = MOCK_VIDEOS) {
    mainGrid.innerHTML = '';
    if (videoList.length === 0) {
        mainGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 100px;">검색 결과가 없습니다.</p>';
        return;
    }
    videoList.forEach(v => {
        mainGrid.appendChild(createVideoCard(v));
    });
}

function renderDetail(videoId) {
    const video = MOCK_VIDEOS.find(v => v.id === videoId);
    if (!video) return;
    
    state.currentVideo = video;
    
    const recommendations = MOCK_VIDEOS.filter(v => v.id !== videoId).slice(0, 5);
    
    views.detail.innerHTML = `
        <div class="video-player-section">
            <div class="player-container">
                <div class="player-wrapper">
                    <!-- In a real app, this would be a video element -->
                    <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; flex-direction:column; background: linear-gradient(45deg, #1a1a1a, #333);">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        <p style="margin-top:20px; font-weight:bold;">영상을 재생하는 중입니다...</p>
                    </div>
                    <div class="mock-player-controls">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                         <div style="flex:1; height:4px; background:rgba(255,255,255,0.3); border-radius:2px; position:relative;">
                            <div style="position:absolute; left:0; top:0; height:100%; width:30%; background:var(--accent); border-radius:2px;"></div>
                         </div>
                         <span style="color:white; font-size:0.8rem;">03:15 / ${video.duration}</span>
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </div>
                </div>
                
                <div class="video-content-info">
                    <div class="video-content-header">
                        <h1>${video.title}</h1>
                    </div>
                    
                    <div class="creator-strip">
                        <img src="${video.creatorAvatar}" alt="${video.creator} 프로필" class="creator-avatar" style="width:50px; height:50px;">
                        <div>
                            <div style="font-weight:800; font-size:1.1rem;">${video.creator}</div>
                            <div style="font-size:0.9rem; color:var(--text-secondary);">구독자 12.4만명</div>
                        </div>
                        <button class="subscribe-btn" id="sub-btn">구독</button>
                    </div>

                    <div class="video-content-actions">
                        <button class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                            좋아요 5.2K
                        </button>
                        <button class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                            싫어요
                        </button>
                        <button class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                            공유
                        </button>
                        <button class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            오프라인 저장
                        </button>
                    </div>

                    <div class="description-box">
                        <div style="font-weight:700; margin-bottom:8px;">조회수 ${video.views} • ${video.date}</div>
                        <p>${video.description}</p>
                    </div>
                </div>
            </div>

            <aside class="sidebar-list">
                <h2 style="font-size:1.2rem; margin-bottom:var(--spacing-md);">다음 동영상</h2>
                ${recommendations.map(rv => `
                    <div class="sidebar-item" role="button" tabindex="0" onclick="navigateToDetail('${rv.id}')">
                        <div class="sidebar-thumb">
                            <img src="${rv.thumbnail}" alt="${rv.title} 썸네일">
                        </div>
                        <div class="sidebar-info">
                            <h3 class="sidebar-title">${rv.title}</h3>
                            <div class="sidebar-meta">
                                <span>${rv.creator}</span><br>
                                <span>조회수 ${rv.views}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </aside>
        </div>
    `;

    // Re-bind subscribe button
    const subBtn = views.detail.querySelector('#sub-btn');
    subBtn.onclick = () => {
        const isSubscribed = subBtn.textContent === '구독중';
        subBtn.textContent = isSubscribed ? '구독' : '구독중';
        subBtn.style.background = isSubscribed ? 'var(--text-primary)' : 'var(--bg-secondary)';
        subBtn.style.color = isSubscribed ? 'var(--bg-primary)' : 'var(--text-primary)';
    };
}

// --- Navigation ---

function switchView(viewName) {
    state.currentView = viewName;
    Object.keys(views).forEach(v => {
        if (v === viewName) {
            views[v].classList.remove('hidden');
            views[v].classList.add('fade-in');
        } else {
            views[v].classList.add('hidden');
        }
    });
    window.scrollTo(0, 0);
}

function navigateToHome() {
    switchView('home');
    renderHome();
}

function navigateToDetail(videoId) {
    switchView('detail');
    renderDetail(videoId);
}

function navigateToLibrary() {
    switchView('library');
    const libGrid = document.getElementById('library-grid');
    libGrid.innerHTML = '';
    // Mock: just show some videos as "saved"
    MOCK_VIDEOS.slice(0, 3).forEach(v => {
        libGrid.appendChild(createVideoCard(v));
    });
}

// --- Event Listeners ---

// Global Navigation
document.getElementById('home-btn').onclick = (e) => { e.preventDefault(); navigateToHome(); };
document.getElementById('mob-home-btn').onclick = navigateToHome;
document.getElementById('lib-btn').onclick = navigateToLibrary;
document.getElementById('mob-lib-btn').onclick = navigateToLibrary;

// Search
searchForm.onsubmit = (e) => {
    e.preventDefault();
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        renderHome();
    } else {
        const filtered = MOCK_VIDEOS.filter(v => 
            v.title.toLowerCase().includes(query) || 
            v.creator.toLowerCase().includes(query)
        );
        renderHome(filtered);
        switchView('home');
    }
};

// Upload Modal
const closeBtn = document.getElementById('close-upload-btn');
const startBtn = uploadModal.querySelector('.btn-primary');

const hideModal = () => uploadModal.classList.add('hidden');

document.getElementById('upload-btn').onclick = () => uploadModal.classList.remove('hidden');
document.getElementById('mob-upload-btn').onclick = () => uploadModal.classList.remove('hidden');
closeBtn.onclick = hideModal;
startBtn.onclick = () => {
    alert('업로드가 시작되었습니다!');
    hideModal();
};
uploadModal.onclick = (e) => { if (e.target === uploadModal) hideModal(); };

// High Contrast Toggle
const contrastBtn = document.getElementById('contrast-btn');
contrastBtn.onclick = () => {
    document.body.classList.toggle('high-contrast');
    const isHigh = document.body.classList.contains('high-contrast');
    contrastBtn.querySelector('span').textContent = isHigh ? '일반 모드' : '고대비';
};

// Initialize
renderHome();
