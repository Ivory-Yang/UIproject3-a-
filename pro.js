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
    if (e.key === 'Escape') { closeSearchPanel(); closeEditSheet(); }
});

function openEditProfile() {
    document.getElementById('epOverlay').classList.add('open');
    document.getElementById('epSheet').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeEditProfile() {
    document.getElementById('epOverlay').classList.remove('open');
    document.getElementById('epSheet').classList.remove('open');
    document.body.style.overflow = '';
}
function saveEditProfile() {
    const name = document.getElementById('epName').value.trim();
    const email = document.getElementById('epEmail').value.trim();
    const phone = document.getElementById('epPhone').value.trim();
    // update visible detail rows
    document.querySelectorAll('.pro-detail-row').forEach(row => {
        const label = row.querySelector('.pro-detail-label')?.textContent;
        const val = row.querySelector('.pro-detail-value');
        if (!val) return;
        if (label === 'FULL NAME') val.textContent = name;
        if (label === 'EMAIL ADDRESS') val.textContent = email;
        if (label === 'PHONE') val.textContent = phone;
    });
    // update hero name
    const heroName = document.querySelector('.pro-name');
    if (heroName && name) heroName.textContent = name;
    const sidebarName = document.querySelector('.pro-sidebar-name');
    if (sidebarName && name) sidebarName.textContent = name;
    closeEditProfile();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeEditProfile(); });

