/**
 * LEXXA BARBERIA - Main Script
 * Full Integrated with Smooth Sequence Animation
 */

// 1. DATA CONFIGURATION
const branchData = {
    'juanda': {
        studio: 'LEXXA BARBERIA',
        location: 'Jl. Ir. H. Juanda',
        address: 'Jl. Ir. H. Juanda, Air Putih, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75124',
        services: ['Wash', 'Curly Perm', 'Haircut', 'Massage'],
        mapUrl: 'https://maps.google.com/?q=Lexxa+Barberia+Juanda'
    },
    'wijaya': {
        studio: 'LEXXA BARBERIA',
        location: 'Jl. Wijaya Kusuma',
        address: 'Jl. Wijaya Kusuma No.12, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75124',
        services: ['Haircut', 'Wash', 'Hair Dyeing', 'Massage'],
        mapUrl: 'https://maps.google.com/?q=Lexxa+Barberia+Wijaya'
    }
};

// DOM Elements
const navbar = document.getElementById('mainNavbar');
const menuToggle = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');
const canvas = document.getElementById("bg-sequence");
const context = canvas.getContext("2d");

// 2. NAVBAR SCROLL LOGIC
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 3. MENU TOGGLE
menuToggle.onclick = () => {
    menuToggle.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : 'auto';
};

// 4. SMOOTH SCROLL FOR MENU ITEMS
document.querySelectorAll('.menu-item').forEach(item => {
    item.onclick = (e) => {
        const targetId = item.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            menuToggle.classList.remove('open');
            navOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';

            const target = targetId === '#' ? document.body : document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    };
});

// 5. BRANCH SWITCHING LOGIC
function changeBranch(branchKey, element) {
    const data = branchData[branchKey];
    if (!data) return;

    document.getElementById('studio-name').innerText = data.studio;
    document.getElementById('location-title').innerText = data.location;
    document.getElementById('address-text').innerText = data.address;
    document.getElementById('map-link').onclick = () => window.open(data.mapUrl, '_blank');

    const tagContainer = document.getElementById('service-tags');
    tagContainer.innerHTML = '';
    data.services.forEach(service => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerText = service;
        tagContainer.appendChild(span);
    });

    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (element) element.classList.add('active');

    filterLogic(branchKey);
    syncFilterButtons(branchKey);
}

// 6. ARTIST FILTER LOGIC
function filterArtistManual(category, element) {
    filterLogic(category);
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

function filterLogic(category) {
    const artists = document.querySelectorAll('.artist-card');
    artists.forEach(card => {
        const cardBranch = card.getAttribute('data-branch');
        const cardParent = card.parentElement;

        if (category === 'all' || cardBranch === category) {
            cardParent.style.display = 'block';
            setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
            card.style.opacity = '0';
            cardParent.style.display = 'none';
        }
    });
}

function syncFilterButtons(branchKey) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const btnId = branchKey === 'all' ? 'filter-all' : `filter-${branchKey}`;
    const targetBtn = document.getElementById(btnId);
    if (targetBtn) targetBtn.classList.add('active');
}

// ---------------------------------------------------------
// 7. SEQUENCE ANIMATION LOGIC (CANVAS)
// ---------------------------------------------------------

const frameCount = 240;
const currentFrame = index => (
  `img/sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const airbnb = { frame: 0 };
let isInitialLoad = true; // Menandai saat web baru dibuka

// Pre-load gambar
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

function render() {
    const parent = document.getElementById('branch-info');
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    const img = images[airbnb.frame];
    if (!img || !img.complete) return;

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let dWidth, dHeight, dx, dy;

    if (imgRatio > canvasRatio) {
        dHeight = canvas.height;
        dWidth = dHeight * imgRatio;
        dx = (canvas.width - dWidth) / 2;
        dy = 0;
    } else {
        dWidth = canvas.width;
        dHeight = dWidth / imgRatio;
        dx = 0;
        dy = (canvas.height - dHeight) / 2;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, dx, dy, dWidth, dHeight);
}

// Deteksi Scroll yang dikalibrasi (DIPERLAMBAT)
window.addEventListener("scroll", () => {
    isInitialLoad = false; 

    const section = document.getElementById('branch-info');
    const scrollTop = window.scrollY;
    const winHeight = window.innerHeight;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    // TITIK MULAI: Saat bagian BAWAH layar menyentuh ATAS section
    const startAnim = sectionTop - winHeight; 
    
    // TITIK SELESAI: Saat bagian ATAS layar menyentuh BAWAH section
    const endAnim = sectionTop + sectionHeight;

    if (scrollTop >= startAnim && scrollTop <= endAnim) {
        // Hitung progress berdasarkan kemunculan section di layar
        let progress = (scrollTop - startAnim) / (endAnim - startAnim);
        
        // Memastikan nilai progress tetap di antara 0 dan 1
        progress = Math.max(0, Math.min(1, progress));

        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(progress * frameCount)
        );

        if (airbnb.frame !== frameIndex) {
            airbnb.frame = frameIndex;
            requestAnimationFrame(render);
        }
    }
});

// Perbaikan Intro (DIPERLAMBAT)
window.onload = () => {
    changeBranch('juanda', document.querySelector('.tab.active'));
    filterLogic('all');

    images[0].onload = () => {
        render();
        
        let introFrame = 0;
        const introInterval = setInterval(() => {
            // Kita percepat sedikit durasi intervalnya tapi kurangi frame per step
            if (!isInitialLoad || introFrame >= 30) { 
                clearInterval(introInterval);
            } else {
                airbnb.frame = introFrame;
                render();
                introFrame++;
            }
        }, 60); // Diubah ke 60ms agar gerakan pembuka lebih santai/lambat
    };
};

window.addEventListener("resize", render);