/**
 * LEXXA BARBERIA - Main Script
 */

// 1. DATA CONFIGURATION
const branchData = {
    'juanda': {
        studio: 'LEXXA BARBERIA',
        location: 'Jl. Ir. H. Juanda',
        address: 'Jl. Ir. H. Juanda, Air Putih, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75124',
        services: ['Wash', 'Curly Perm', 'Haircut', 'Massage'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lexxa+Barberia+Juanda'
    },
    'wijaya': {
        studio: 'LEXXA BARBERIA',
        location: 'Jl. Wijaya Kusuma',
        address: 'Jl. Wijaya Kusuma No.12, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75124',
        services: ['Haircut', 'Wash', 'Hair Dyeing', 'Massage'],
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lexxa+Barberia+Wijaya+Kusuma'
    }
};

// DOM Elements
const navbar = document.getElementById('mainNavbar');
const menuToggle = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');

// 2. NAVBAR SCROLL LOGIC
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 3. MENU TOGGLE (3 DOTS / HAMBURGER)
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
            
            // Close menu
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

    // Update UI
    document.getElementById('studio-name').innerText = data.studio;
    document.getElementById('location-title').innerText = data.location;
    document.getElementById('address-text').innerText = data.address;
    document.getElementById('map-link').onclick = () => window.open(data.mapUrl, '_blank');

    // Update Tags
    const tagContainer = document.getElementById('service-tags');
    tagContainer.innerHTML = '';
    data.services.forEach(service => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerText = service;
        tagContainer.appendChild(span);
    });

    // Toggle Active Tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (element) element.classList.add('active');

    // Auto-filter artists based on branch
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

function scrollToArtist() {
    const section = document.getElementById('artist-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// 7. INITIALIZE ON LOAD
window.onload = () => {
    // Default to Juanda
    changeBranch('juanda', document.querySelector('.tab.active'));
    
    // Default to show all artists
    filterLogic('all');
};
const canvas = document.getElementById("bg-sequence");
const context = canvas.getContext("2d");

const frameCount = 240; // Total foto sequence kamu
const currentFrame = index => (
  `img/sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const airbnb = { frame: 0 };

// Pre-load semua gambar agar tidak berkedip saat scroll
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}
// --- BAGIAN YANG DIPERBAIKI (GANTI DARI SINI) ---

// Fungsi menggambar gambar ke canvas dengan optimasi performa
function render() {
    // Gunakan offsetWidth agar sesuai dengan ukuran container, bukan seluruh layar
    const parent = document.getElementById('branch-info');
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    const img = images[airbnb.frame];
    if (!img || !img.complete) return; // Cek apakah gambar benar-benar sudah siap

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let dWidth, dHeight, dx, dy;

    // Logika Cover (tetap dipertahankan agar background penuh)
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

// Deteksi Scroll yang lebih responsif
window.addEventListener("scroll", () => {
    const section = document.getElementById('branch-info');
    const scrollTop = window.scrollY;
    const winHeight = window.innerHeight;
    
    // Titik awal: saat bagian bawah layar menyentuh bagian atas section
    // Titik akhir: saat bagian atas layar melewati bagian bawah section
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    const startAnim = sectionTop - winHeight; 
    const endAnim = sectionTop + sectionHeight;

    if (scrollTop >= startAnim && scrollTop <= endAnim) {
        // Hitung progress relatif terhadap posisi section di layar
        const scrollFraction = (scrollTop - startAnim) / (endAnim - startAnim);
        
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        if (airbnb.frame !== frameIndex) {
            airbnb.frame = frameIndex;
            requestAnimationFrame(render);
        }
    }
});

// Pastikan render pertama kali saat gambar dimuat
images[0].onload = () => {
    render();
};

// Cek ulang jika window di-resize
window.addEventListener("resize", render);