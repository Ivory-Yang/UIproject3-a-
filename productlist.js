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