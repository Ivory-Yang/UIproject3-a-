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

// ── render orders from localStorage ──────────────────────
function escapeHTML(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderSavedOrders() {
    const orders = JSON.parse(localStorage.getItem('proOrders') || '[]');
    const scroll = document.getElementById('proOrdersScroll');
    const empty  = document.getElementById('proOrdersEmpty');

    if (!orders.length) {
        if (empty) empty.style.display = '';
        return;
    }
    if (empty) empty.style.display = 'none';
    if (!scroll) return;

    scroll.innerHTML = '';
    orders.forEach(o => {
        const card = document.createElement('div');
        card.className = 'pro-order-card';
        card.innerHTML = `
            <div class="pro-order-top">
                <span class="material-symbols-outlined pro-order-icon">${escapeHTML(o.icon)}</span>
                <span class="pro-order-status in-oven">${escapeHTML(o.statusLabel)}</span>
            </div>
            <p class="pro-order-name">${escapeHTML(o.name)}</p>
            <p class="pro-order-meta">Order #${escapeHTML(o.orderNum)}</p>
            <div class="pro-order-card-footer">
                <div>
                    <p class="pro-order-date-label">${escapeHTML(o.dateLabel)}</p>
                    <p class="pro-order-date-value">${escapeHTML(o.dateValue)}</p>
                </div>
                <button class="pro-order-arrow" type="button">
                    <span class="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>`;
        scroll.appendChild(card);
    });
}

function dismissOrderBanner() {
    const banner = document.getElementById('proOrderBanner');
    if (banner) {
        banner.classList.remove('show');
    }
}

function showOrderAnimation() {
    if (!localStorage.getItem('justOrdered')) return;
    localStorage.removeItem('justOrdered');

    // mark new cards for pulse, then remove class after 2 s so border disappears
    const scroll = document.getElementById('proOrdersScroll');
    if (scroll) {
        Array.from(scroll.children).forEach(card => {
            card.classList.add('new-order');
            setTimeout(() => card.classList.remove('new-order'), 2000);
        });
    }

    // show banner
    const banner = document.getElementById('proOrderBanner');
    if (banner) {
        setTimeout(() => banner.classList.add('show'), 200);
        // tap banner scrolls to orders
        banner.addEventListener('click', () => {
            document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            dismissOrderBanner();
        });
        // auto-dismiss after 5 s
        setTimeout(dismissOrderBanner, 5000);
    }

    // scroll to orders section after a short delay
    setTimeout(() => {
        document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
    renderSavedOrders();
    showOrderAnimation();
});

