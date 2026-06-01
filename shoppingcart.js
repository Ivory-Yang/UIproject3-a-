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
            <button class="cb item-cb" type="button" onclick="toggleItemCb(this)">
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
        if (item.querySelector('.item-cb').classList.contains('cb-active')) {
            subtotal += parseFloat(item.dataset.unit) * parseInt(item.querySelector('.qty-num').textContent);
        }
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
    if (totalDEl) totalDEl.textContent = '$' + (subtotal + 5 + taxes).toFixed(2);

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
    updateSummary();
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
    updateSummary();
}

function proceedToCheckout() {
    const selected = document.querySelectorAll('.item-cb.cb-active');
    if (selected.length === 0) {
        const toast = document.getElementById('cartToast');
        if (toast) {
            toast.textContent = 'Please select at least one item to checkout.';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2800);
        }
        return;
    }
    const selectedIds = Array.from(selected).map(cb => cb.closest('.cart-item').dataset.cartId);
    localStorage.setItem('cupcakeCheckout', JSON.stringify(selectedIds));
    location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('cartItemsList').addEventListener('click', function (e) {
        if (e.target.closest('.qty-btn') || e.target.closest('.ci-del') || e.target.closest('.item-cb')) return;
        const item = e.target.closest('.cart-item');
        if (item) openEditSheet(item);
    });
});

// ===========================
// EDIT ITEM SHEET
// ===========================

const CATEGORY_FROM_LABEL = {
    'LUXURY TIER': 'cake',
    'SIGNATURE COLLECTION': 'cupcake',
    'FRESH DAILY': 'cookie',
    'PREMIUM SELECTION': 'diy'
};

let _editId = '';
let _editBasePrice = 0;
let _editUnitPrice = 0;
let _editQtyVal = 1;

function openEditSheet(cartItemEl) {
    const cartId = cartItemEl.dataset.cartId;
    const cart = getCart();
    const entry = cart.find(i => i.id === cartId);
    if (!entry) return;

    _editId = cartId;
    _editBasePrice = entry.basePrice || entry.unitPrice;
    _editUnitPrice = entry.unitPrice;
    _editQtyVal = entry.qty;

    const categoryType = entry.categoryType || CATEGORY_FROM_LABEL[entry.category] || 'other';

    document.getElementById('editImg').src = entry.imgSrc;
    document.getElementById('editImg').alt = entry.name;
    document.getElementById('editName').textContent = entry.name;
    document.getElementById('editQty').textContent = _editQtyVal;
    document.getElementById('editPrice').textContent = '$' + (_editUnitPrice * _editQtyVal).toFixed(2);

    const sizeSection = document.getElementById('editSizeSection');
    const boxSection = document.getElementById('editBoxSection');

    if (categoryType === 'cake') {
        sizeSection.style.display = '';
        boxSection.style.display = 'none';
        const priceAdd = Math.round(entry.unitPrice - _editBasePrice);
        document.querySelectorAll('#editSizeOptions .qa-option').forEach(btn => {
            btn.classList.toggle('active', Math.round(parseFloat(btn.dataset.priceAdd || 0)) === priceAdd);
        });
    } else if (categoryType === 'cupcake') {
        sizeSection.style.display = 'none';
        boxSection.style.display = '';
        const priceMult = _editBasePrice > 0 ? entry.unitPrice / _editBasePrice : 1;
        document.querySelectorAll('#editBoxOptions .qa-option').forEach(btn => {
            btn.classList.toggle('active', Math.abs(parseFloat(btn.dataset.priceMult || 1) - priceMult) < 0.01);
        });
    } else {
        sizeSection.style.display = 'none';
        boxSection.style.display = 'none';
    }

    document.querySelectorAll('#editFlavorOptions .qa-option').forEach((btn, i) => {
        btn.classList.toggle('active', i === 1);
    });

    const saveBtn = document.getElementById('editSaveBtn');
    saveBtn.classList.remove('added');
    saveBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Update Cart';

    document.getElementById('editOverlay').classList.add('open');
    document.getElementById('editSheet').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeEditSheet() {
    document.getElementById('editOverlay').classList.remove('open');
    document.getElementById('editSheet').classList.remove('open');
    document.body.style.overflow = '';
}

function selectEditOption(btn) {
    const container = btn.closest('.qa-options');
    container.querySelectorAll('.qa-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.priceAdd !== undefined) {
        _editUnitPrice = _editBasePrice + parseFloat(btn.dataset.priceAdd);
    } else if (btn.dataset.priceMult !== undefined) {
        _editUnitPrice = _editBasePrice * parseFloat(btn.dataset.priceMult);
    }
    document.getElementById('editPrice').textContent = '$' + (_editUnitPrice * _editQtyVal).toFixed(2);
}

function changeEditQty(delta) {
    _editQtyVal = Math.max(1, _editQtyVal + delta);
    document.getElementById('editQty').textContent = _editQtyVal;
    document.getElementById('editPrice').textContent = '$' + (_editUnitPrice * _editQtyVal).toFixed(2);
}

function saveEditChanges() {
    const cart = getCart();
    const entry = cart.find(i => i.id === _editId);
    if (entry) {
        entry.unitPrice = _editUnitPrice;
        entry.basePrice = _editBasePrice;
        entry.qty = _editQtyVal;
        saveCart(cart);
    }

    const saveBtn = document.getElementById('editSaveBtn');
    saveBtn.classList.add('added');
    saveBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Updated!';

    setTimeout(() => {
        closeEditSheet();
        renderCart();
    }, 600);
}

// ===========================
// SEARCH PANEL
// ===========================

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