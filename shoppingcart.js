// ===========================
// CART STORAGE
// ===========================

function getCart() {
    try { return JSON.parse(localStorage.getItem('cupcakeCart')) || []; }
    catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem('cupcakeCart', JSON.stringify(cart));
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ===========================
// RENDER
// ===========================

function renderCart() {
    const cart = getCart();
    const list = document.getElementById('cartItemsList');
    list.innerHTML = '';

    cart.forEach(item => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.dataset.unit = item.unitPrice.toFixed(2);
        el.dataset.cartId = item.id;

        const total = (item.unitPrice * item.qty).toFixed(2);

        el.innerHTML = `
            <button class="cb cb-active item-cb" type="button" onclick="toggleItemCb(this)">
                <span class="material-symbols-outlined">check</span>
            </button>
            <div class="ci-img">
                <img src="${escapeHTML(item.imgSrc)}" alt="${escapeHTML(item.name)}">
            </div>
            <div class="ci-body">
                <div class="ci-top">
                    <div class="ci-meta">
                        <p class="ci-category">${escapeHTML(item.category)}</p>
                        <p class="ci-name">${escapeHTML(item.name)}</p>
                        <p class="ci-desc">${escapeHTML(item.desc)}</p>
                    </div>
                    <span class="ci-price">$${total}</span>
                </div>
                <div class="ci-bottom">
                    <div class="ci-qty">
                        <button class="qty-btn" type="button" onclick="changeCartQty(this,-1)">−</button>
                        <span class="qty-num">${item.qty}</span>
                        <button class="qty-btn" type="button" onclick="changeCartQty(this,1)">+</button>
                    </div>
                    <button class="ci-del" type="button" onclick="deleteCartItem(this)">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>`;

        list.appendChild(el);
    });

    updateSummary();
}

// ===========================
// SUMMARY
// ===========================

function updateSummary() {
    const items = document.querySelectorAll('.cart-item');
    const emptyState = document.getElementById('cartEmpty');
    const selectAllRow = document.getElementById('selectAllRow');
    const mobileSummary = document.getElementById('cartSummaryMobile');
    const desktopRight = document.getElementById('cartRight');

    const subtitle = document.getElementById('cartSubtitle');
    if (subtitle) {
        const n = items.length;
        subtitle.textContent = n === 1
            ? 'You have 1 exquisite treat waiting for you.'
            : `You have ${n} exquisite treats waiting for you.`;
    }

    if (items.length === 0) {
        emptyState.classList.add('show');
        if (mobileSummary) mobileSummary.style.display = 'none';
        if (desktopRight) desktopRight.style.display = 'none';
        if (selectAllRow) selectAllRow.style.display = 'none';
        return;
    }

    emptyState.classList.remove('show');
    if (mobileSummary) mobileSummary.style.display = '';
    if (desktopRight) desktopRight.style.display = '';
    if (selectAllRow) selectAllRow.style.display = '';

    let subtotal = 0;
    items.forEach(item => {
        subtotal += parseFloat(item.dataset.unit) * parseInt(item.querySelector('.qty-num').textContent);
    });

    const taxes = subtotal * 0.09;

    // Mobile summary
    const smEl = document.getElementById('summarySubtotalM');
    const stEl = document.getElementById('summaryTaxesM');
    const totalMEl = document.getElementById('summaryTotalM');
    if (smEl) smEl.textContent = '$' + subtotal.toFixed(2);
    if (stEl) stEl.textContent = '$' + taxes.toFixed(2);
    if (totalMEl) totalMEl.textContent = '$' + (subtotal + 5 + taxes).toFixed(2);

    // Desktop summary
    const sdEl = document.getElementById('summarySubtotal');
    const tdEl = document.getElementById('summaryTaxes');
    const totalDEl = document.getElementById('summaryTotal');
    if (sdEl) sdEl.textContent = '$' + subtotal.toFixed(2);
    if (tdEl) tdEl.textContent = '$' + taxes.toFixed(2);
    if (totalDEl) totalDEl.textContent = '$' + (subtotal + 12.50 + taxes).toFixed(2);

    const sc = document.getElementById('selectCount');
    if (sc) sc.textContent = items.length;

    updateSelectAllState();
}

// ===========================
// CART ACTIONS
// ===========================

function changeCartQty(btn, delta) {
    const item = btn.closest('.cart-item');
    const qtyEl = item.querySelector('.qty-num');
    const priceEl = item.querySelector('.ci-price');
    const unit = parseFloat(item.dataset.unit);
    const cartId = item.dataset.cartId;

    const qty = Math.max(1, parseInt(qtyEl.textContent) + delta);
    qtyEl.textContent = qty;
    priceEl.textContent = '$' + (unit * qty).toFixed(2);

    // Sync to localStorage
    const cart = getCart();
    const entry = cart.find(i => i.id === cartId);
    if (entry) { entry.qty = qty; saveCart(cart); }

    updateSummary();
}

function deleteCartItem(btn) {
    const item = btn.closest('.cart-item');
    const cartId = item.dataset.cartId;

    item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    item.style.opacity = '0';
    item.style.transform = 'translateX(16px)';

    setTimeout(() => {
        item.remove();

        // Sync to localStorage
        const cart = getCart().filter(i => i.id !== cartId);
        saveCart(cart);

        updateSummary();
    }, 200);
}

function toggleItemCb(btn) {
    btn.classList.toggle('cb-active');
    updateSelectAllState();
}

function updateSelectAllState() {
    const all = document.querySelectorAll('.item-cb');
    const active = document.querySelectorAll('.item-cb.cb-active');
    const selectAllCb = document.getElementById('selectAllCb');
    if (!selectAllCb) return;
    selectAllCb.classList.toggle('cb-active', active.length === all.length && all.length > 0);
}

function toggleSelectAll() {
    const selectAllCb = document.getElementById('selectAllCb');
    const willActivate = !selectAllCb.classList.contains('cb-active');
    selectAllCb.classList.toggle('cb-active', willActivate);
    document.querySelectorAll('.item-cb').forEach(cb => {
        cb.classList.toggle('cb-active', willActivate);
    });
}

document.addEventListener('DOMContentLoaded', renderCart);
