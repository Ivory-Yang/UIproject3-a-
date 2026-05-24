function updateSummary() {
    const items = document.querySelectorAll('.cart-item');
    const emptyState = document.getElementById('cartEmpty');
    const selectAllRow = document.getElementById('selectAllRow');
    const mobileSummary = document.getElementById('cartSummaryMobile');
    const desktopRight = document.getElementById('cartRight');

    // Update subtitle
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
        const unit = parseFloat(item.dataset.unit);
        const qty = parseInt(item.querySelector('.qty-num').textContent);
        subtotal += unit * qty;
    });

    const deliveryMobile = 5.00;
    const deliveryDesk = 12.50;
    const taxes = subtotal * 0.09;

    // Mobile summary
    const smEl = document.getElementById('summarySubtotalM');
    const stEl = document.getElementById('summaryTaxesM');
    const totalMEl = document.getElementById('summaryTotalM');
    if (smEl) smEl.textContent = '$' + subtotal.toFixed(2);
    if (stEl) stEl.textContent = '$' + taxes.toFixed(2);
    if (totalMEl) totalMEl.textContent = '$' + (subtotal + deliveryMobile + taxes).toFixed(2);

    // Desktop summary
    const sdEl = document.getElementById('summarySubtotal');
    const tdEl = document.getElementById('summaryTaxes');
    const totalDEl = document.getElementById('summaryTotal');
    if (sdEl) sdEl.textContent = '$' + subtotal.toFixed(2);
    if (tdEl) tdEl.textContent = '$' + taxes.toFixed(2);
    if (totalDEl) totalDEl.textContent = '$' + (subtotal + deliveryDesk + taxes).toFixed(2);

    // Select All count
    const sc = document.getElementById('selectCount');
    if (sc) sc.textContent = items.length;

    updateSelectAllState();
}

function changeCartQty(btn, delta) {
    const item = btn.closest('.cart-item');
    const qtyEl = item.querySelector('.qty-num');
    const priceEl = item.querySelector('.ci-price');
    const unit = parseFloat(item.dataset.unit);

    const qty = Math.max(1, parseInt(qtyEl.textContent) + delta);
    qtyEl.textContent = qty;
    priceEl.textContent = '$' + (unit * qty).toFixed(2);

    updateSummary();
}

function deleteCartItem(btn) {
    const item = btn.closest('.cart-item');
    item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    item.style.opacity = '0';
    item.style.transform = 'translateX(16px)';
    setTimeout(() => {
        item.remove();
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

document.addEventListener('DOMContentLoaded', updateSummary);
