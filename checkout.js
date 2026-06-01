// ── helpers ──────────────────────────────────────────────
function getCart() {
    try {
        const all = JSON.parse(localStorage.getItem('cupcakeCart')) || [];
        const ids = JSON.parse(localStorage.getItem('cupcakeCheckout') || 'null');
        if (!ids) return all;
        const set = new Set(ids);
        return all.filter(i => set.has(i.id));
    } catch { return []; }
}
function escapeHTML(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── fulfillment state ─────────────────────────────────────
let _fulfillment = 'delivery'; // 'delivery' | 'pickup'
const DELIVERY_FEE = 5.00;
const TAX_RATE = 0.085;

function selectFulfillment(mode) {
    _fulfillment = mode;
    document.getElementById('coDelivery').classList.toggle('selected', mode === 'delivery');
    document.getElementById('coPickup').classList.toggle('selected', mode === 'pickup');
    updateSummary();
}

// ── render items ──────────────────────────────────────────
function renderItems() {
    const cart = getCart();
    const list = document.getElementById('coItemsList');

    if (!cart.length) {
        list.innerHTML = '<p class="co-empty">Your cart is empty.</p>';
        document.getElementById('coItemCount').textContent = '0 ITEMS';
        return;
    }

    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('coItemCount').textContent = count + (count === 1 ? ' ITEM' : ' ITEMS');

    list.innerHTML = cart.map(item => {
        const subtotal = (item.unitPrice * item.qty).toFixed(2);
        const flavor = item.flavor || '';
        const size = item.size || '';
        const sub = [size, flavor].filter(Boolean).join(', ');
        const imgSrc = item.imgSrc ? escapeHTML(item.imgSrc) : (item.image ? escapeHTML(item.image) : 'Image/logo.png');

        return `
        <div class="co-item" data-id="${escapeHTML(item.id)}">
            <div class="co-item-img">
                <img src="${imgSrc}" alt="${escapeHTML(item.name)}">
            </div>
            <div class="co-item-body">
                <p class="co-item-name">${escapeHTML(item.name)}</p>
                ${sub ? `<p class="co-item-sub">${escapeHTML(sub)}</p>` : ''}
                <div class="co-item-qty-row">
                    <button class="co-qty-btn" onclick="changeQty('${escapeHTML(item.id)}', -1)">−</button>
                    <span class="co-qty-val">${item.qty}</span>
                    <button class="co-qty-btn" onclick="changeQty('${escapeHTML(item.id)}', 1)">+</button>
                    <button class="co-del-btn" onclick="removeItem('${escapeHTML(item.id)}')">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            <p class="co-item-price">$${subtotal}</p>
        </div>`;
    }).join('');
}

function changeQty(id, delta) {
    try {
        const all = JSON.parse(localStorage.getItem('cupcakeCart')) || [];
        const idx = all.findIndex(i => i.id === id);
        if (idx === -1) return;
        all[idx].qty = Math.max(1, all[idx].qty + delta);
        localStorage.setItem('cupcakeCart', JSON.stringify(all));
    } catch {}
    renderItems();
    updateSummary();
}

function removeItem(id) {
    try {
        const all = (JSON.parse(localStorage.getItem('cupcakeCart')) || []).filter(i => i.id !== id);
        localStorage.setItem('cupcakeCart', JSON.stringify(all));
        const ids = JSON.parse(localStorage.getItem('cupcakeCheckout') || '[]').filter(x => x !== id);
        localStorage.setItem('cupcakeCheckout', JSON.stringify(ids));
    } catch {}
    renderItems();
    updateSummary();
}

// ── summary ───────────────────────────────────────────────
function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const fee = _fulfillment === 'pickup' ? 0 : (subtotal >= 50 ? 0 : DELIVERY_FEE);
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + fee + taxes;

    const feeStr = fee === 0 ? 'FREE' : '$' + fee.toFixed(2);

    // update desktop delivery sub-label
    const delivSub = document.getElementById('coDeliverySub');
    if (delivSub) {
        delivSub.textContent = subtotal >= 50 ? 'Free for orders over $50' : 'To your doorstep';
    }

    // mobile
    document.getElementById('mSubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('mDeliveryFee').textContent = feeStr;
    document.getElementById('mTaxes').textContent = '$' + taxes.toFixed(2);
    document.getElementById('mTotal').textContent = '$' + total.toFixed(2);

    // desktop
    document.getElementById('dSubtotal').textContent = '$' + subtotal.toFixed(2);
    const dFeeEl = document.getElementById('dDeliveryFee');
    dFeeEl.textContent = feeStr;
    dFeeEl.className = fee === 0 ? 'co-free-tag' : '';
    document.getElementById('dTaxes').textContent = '$' + taxes.toFixed(2);
    document.getElementById('dTotal').textContent = '$' + total.toFixed(2);

    // rewards
    const crumbs = Math.floor(subtotal);
    const rewardsSub = document.getElementById('coRewardsSub');
    if (rewardsSub) rewardsSub.textContent = `Earn ${crumbs} crumbs on this order!`;
}

// ── calendar ──────────────────────────────────────────────
let _calYear, _calMonth, _selectedDate = null;

function initCalendar() {
    const now = new Date();
    _calYear = now.getFullYear();
    _calMonth = now.getMonth();
    renderCalendar();
}

function prevMonth() {
    _calMonth--;
    if (_calMonth < 0) { _calMonth = 11; _calYear--; }
    renderCalendar();
}

function nextMonth() {
    _calMonth++;
    if (_calMonth > 11) { _calMonth = 0; _calYear++; }
    renderCalendar();
}

function renderCalendar() {
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    document.getElementById('coCalMonthLabel').textContent = months[_calMonth] + ' ' + _calYear;

    const firstDay = new Date(_calYear, _calMonth, 1).getDay();
    const daysInMonth = new Date(_calYear, _calMonth + 1, 0).getDate();
    const today = new Date();

    const wrap = document.getElementById('coCalDays');
    wrap.innerHTML = '';

    // leading empty cells
    for (let i = 0; i < firstDay; i++) {
        wrap.insertAdjacentHTML('beforeend', '<div class="co-cal-day empty"></div>');
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(_calYear, _calMonth, d);
        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isToday = d === today.getDate() && _calMonth === today.getMonth() && _calYear === today.getFullYear();
        const isSelected = _selectedDate &&
            _selectedDate.getDate() === d &&
            _selectedDate.getMonth() === _calMonth &&
            _selectedDate.getFullYear() === _calYear;

        const classes = ['co-cal-day',
            isPast ? 'past' : '',
            isToday ? 'today' : '',
            isSelected ? 'selected' : ''
        ].filter(Boolean).join(' ');

        wrap.insertAdjacentHTML('beforeend',
            `<div class="${classes}" ${isPast ? '' : `onclick="selectDate(${d})"`}>${d}</div>`
        );
    }
}

function selectDate(d) {
    _selectedDate = new Date(_calYear, _calMonth, d);
    renderCalendar();
}

// ── place order ───────────────────────────────────────────
function placeOrder() {
    if (!_selectedDate) {
        alert('Please choose a delivery or pickup date.');
        return;
    }
    alert('Order placed! Thank you for your purchase.');
}

// ── init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderItems();
    updateSummary();
    selectFulfillment('delivery');
    initCalendar();
});
