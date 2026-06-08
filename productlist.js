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
    if (e.key === 'Escape') {
        closeSearchPanel();
        closeQuickAdd();
    }
});

// ===========================
// QUICK ADD SHEET
// ===========================

let _qaQty = 1;
let _qaBasePrice = 0;
let _qaUnitPrice = 0;
let _qaImgSrc = '';
let _qaCategory = '';
let _qaDesc = '';

const CATEGORY_LABELS = {
    cake: 'LUXURY TIER',
    cupcake: 'SIGNATURE COLLECTION',
    cookie: 'FRESH DAILY',
    diy: 'PREMIUM SELECTION'
};

function getCart() {
    try { return JSON.parse(localStorage.getItem('cupcakeCart')) || []; }
    catch { return []; }
}

function saveToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.name === item.name && i.unitPrice === item.unitPrice);
    if (existing) {
        existing.qty += item.qty;
    } else {
        cart.push(item);
    }
    localStorage.setItem('cupcakeCart', JSON.stringify(cart));
}

function updateQaPrice(unitPrice) {
    _qaUnitPrice = unitPrice;
    document.getElementById('qaPrice').textContent = '$' + (_qaUnitPrice * _qaQty).toFixed(2);
}

function openQuickAdd(name, price, imgSrc, category, desc) {
    _qaBasePrice = parseFloat(price.replace('$', ''));
    _qaImgSrc = imgSrc;
    _qaCategory = category;
    _qaDesc = desc || '';

    document.getElementById('qaName').textContent = name;
    updateQaPrice(_qaBasePrice);

    const img = document.getElementById('qaImg');
    img.src = imgSrc;
    img.alt = name;

    _qaQty = 1;
    document.getElementById('qaQty').textContent = _qaQty;

    const sizeSection = document.getElementById('qaSizeSection');
    const boxSection = document.getElementById('qaBoxSection');

    if (category === 'cake') {
        sizeSection.style.display = '';
        boxSection.style.display = 'none';
        document.querySelectorAll('#qaSizeOptions .qa-option').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });
    } else if (category === 'cupcake') {
        sizeSection.style.display = 'none';
        boxSection.style.display = '';
        document.querySelectorAll('#qaBoxOptions .qa-option').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });
    } else {
        sizeSection.style.display = 'none';
        boxSection.style.display = 'none';
    }

    document.querySelectorAll('#qaFlavorOptions .qa-option').forEach((btn, i) => {
        btn.classList.toggle('active', i === 1);
    });

    // Reset button state
    const btn = document.getElementById('qaAddCartBtn');
    btn.classList.remove('added');
    btn.innerHTML = '<span class="material-symbols-outlined">shopping_bag</span> Add to Cart';

    document.getElementById('qaOverlay').classList.add('open');
    document.getElementById('quickAddSheet').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeQuickAdd() {
    document.getElementById('qaOverlay').classList.remove('open');
    document.getElementById('quickAddSheet').classList.remove('open');
    document.body.style.overflow = '';
}

function addToCart() {
    const btn = document.getElementById('qaAddCartBtn');
    const productName = document.getElementById('qaName').textContent;

    saveToCart({
        id: Date.now().toString(),
        name: productName,
        imgSrc: _qaImgSrc,
        unitPrice: _qaUnitPrice,
        basePrice: _qaBasePrice,
        qty: _qaQty,
        category: CATEGORY_LABELS[_qaCategory] || _qaCategory.toUpperCase(),
        categoryType: _qaCategory,
        desc: _qaDesc
    });

    btn.classList.add('added');
    btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Added to Cart';

    setTimeout(() => {
        closeQuickAdd();
        setTimeout(() => showCartToast(productName), 200);
    }, 600);
}

let _toastTimer = null;

function showCartToast(name) {
    document.getElementById('qaToastText').textContent = name + ' added to cart';
    const toast = document.getElementById('qaToast');
    toast.classList.add('show');

    if (_toastTimer) clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function selectQaOption(btn) {
    const container = btn.closest('.qa-options');
    container.querySelectorAll('.qa-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.priceAdd !== undefined) {
        updateQaPrice(_qaBasePrice + parseFloat(btn.dataset.priceAdd));
    } else if (btn.dataset.priceMult !== undefined) {
        updateQaPrice(_qaBasePrice * parseFloat(btn.dataset.priceMult));
    }
}

function changeQty(delta) {
    _qaQty = Math.max(1, _qaQty + delta);
    document.getElementById('qaQty').textContent = _qaQty;
    document.getElementById('qaPrice').textContent = '$' + (_qaUnitPrice * _qaQty).toFixed(2);
}

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

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const initialCat = params.get('cat') || 'cake';
    const chip = document.querySelector(`.cat-chip[data-cat="${initialCat}"]`);
    if (chip) setChip(chip);
    else filterProducts(initialCat);

    document.querySelector('.product-grid').addEventListener('click', function (e) {
        const imgClick = e.target.closest('.card-image-wrap');
        if (imgClick && !e.target.closest('.fav-btn')) {
            const card = imgClick.closest('.product-card');
            const name = card.querySelector('.card-name').textContent;
            const priceText = card.querySelector('.card-price').textContent;
            const imgSrc = card.querySelector('.card-image-wrap img').getAttribute('src');
            const category = card.dataset.cat;
            const desc = card.querySelector('.card-desc').textContent.trim();
            const ratingText = card.querySelector('.card-rating')?.textContent || '★ 4.9';
            const rating = parseFloat(ratingText.replace('★', '').trim()) || 4.9;
            const basePrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            sessionStorage.setItem('ppProduct', JSON.stringify({
                name, price: priceText, imgSrc, categoryType: category,
                desc, rating, basePrice
            }));
            location.href = 'productpage.html';
            return;
        }

        const btn = e.target.closest('.add-btn');
        if (!btn) return;
        const card = btn.closest('.product-card');
        const name = card.querySelector('.card-name').textContent;
        const price = card.querySelector('.card-price').textContent;
        const imgSrc = card.querySelector('.card-image-wrap img').getAttribute('src');
        const category = card.dataset.cat;
        const desc = card.querySelector('.card-desc').textContent.trim();
        openQuickAdd(name, price, imgSrc, category, desc);
    });
});
