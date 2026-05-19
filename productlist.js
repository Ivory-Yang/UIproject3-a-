function handleSearchClick(e) {
    if (window.innerWidth >= 1000) {
        e.preventDefault();
        openSearchPanel();
    }
    // mobile: link navigates to search-page.html normally
}

function openSearchPanel() {
    const frame = document.getElementById('searchPanelFrame');
    if (!frame.dataset.loaded) {
        frame.src = 'search-page.html?panel=1';
        frame.dataset.loaded = '1';
    }
    document.getElementById('searchOverlay').classList.add('open');
    document.getElementById('searchPanel').classList.add('open');
}

function closeSearchPanel() {
    document.getElementById('searchOverlay').classList.remove('open');
    document.getElementById('searchPanel').classList.remove('open');
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearchPanel();
});
function filterProducts(cat) {
    const cards = document.querySelectorAll('.product-card');
    let count = 0;
    cards.forEach(card => {
        const show = !cat || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) count++;
    });
    const countEl = document.querySelector('.item-count');
    if (countEl) countEl.textContent = count + ' Divine Items';
}

function setChip(el) {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.cat-item').forEach(c => {
        c.classList.toggle('active', c.dataset.cat === el.dataset.cat);
    });
    filterProducts(el.dataset.cat);
}

function setSidebarCat(e, el) {
    e.preventDefault();
    document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.cat-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.cat === el.dataset.cat);
    });
    filterProducts(el.dataset.cat);
}

function toggleFav(e, btn) {
    e.preventDefault();
    btn.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => filterProducts('cake'));

function handleSearchClick(e) {
    if (window.innerWidth >= 1000) {
        e.preventDefault();
        openSearchPanel();
    }
}

function openSearchPanel() {
    const frame = document.getElementById('searchPanelFrame');
    if (!frame.dataset.loaded) {
        frame.src = 'search-page.html?panel=1';
        frame.dataset.loaded = '1';
    }
    document.getElementById('searchOverlay').classList.add('open');
    document.getElementById('searchPanel').classList.add('open');
}

function closeSearchPanel() {
    document.getElementById('searchOverlay').classList.remove('open');
    document.getElementById('searchPanel').classList.remove('open');
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearchPanel();
});