function updateSummary() {
    const items = document.querySelectorAll('.cart-item');
    const summary = document.getElementById('cartSummary');
    const emptyState = document.getElementById('cartEmpty');
    const selectAllRow = document.getElementById('selectAllRow');

    if (items.length === 0) {
        emptyState.classList.add('show');
        summary.style.display = 'none';
        selectAllRow.style.display = 'none';
        return;
    }

    emptyState.classList.remove('show');
    summary.style.display = '';
    selectAllRow.style.display = '';

    let subtotal = 0;
    items.forEach(item => {
        const unit = parseFloat(item.dataset.unit);
        const qty = parseInt(item.querySelector('.qty-num').textContent);
        subtotal += unit * qty;
    });

    const delivery = 5.00;
    const taxes = subtotal * 0.09;
    const total = subtotal + delivery + taxes;

    document.getElementById('summarySubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('summaryTaxes').textContent = '$' + taxes.toFixed(2);
    document.getElementById('summaryTotal').textContent = '$' + total.toFixed(2);
    document.getElementById('selectCount').textContent = items.length;

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
    if (active.length === all.length && all.length > 0) {
        selectAllCb.classList.add('cb-active');
    } else {
        selectAllCb.classList.remove('cb-active');
    }
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
