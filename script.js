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