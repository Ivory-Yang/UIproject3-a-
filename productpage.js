// ── option selection ──────────────────────────────────────
function selectPpOption(btn) {
    btn.closest('.pp-option-row')
        .querySelectorAll('.pp-option')
        .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updatePpPrice();
}

function updatePpPrice() {
    const p = window._ppProduct;
    if (!p) return;
    const base = p.basePrice;
    let unit = base;
    const cat = p.categoryType || 'cake';

    if (cat === 'cake') {
        const sizeActive = document.querySelector('#ppSizeOptions .pp-option.active');
        if (sizeActive) unit = base + (parseFloat(sizeActive.dataset.priceAdd) || 0);
    } else if (cat === 'cupcake') {
        const boxActive = document.querySelector('#ppBoxOptions .pp-option.active');
        if (boxActive) unit = base * (parseFloat(boxActive.dataset.priceMult) || 1);
    }

    window._ppUnitPrice = unit;
    document.getElementById('ppPrice').textContent = '$' + (unit * _qty).toFixed(2);
}

const INGREDIENTS = {
    cake: [
        { icon: 'nutrition',   name: 'Organic Berries',     sub: 'Hand-picked from alpine farms' },
        { icon: 'spa',         name: 'Madagascar Vanilla',  sub: 'Pure bourbon vanilla bean infusion' },
        { icon: 'water_drop',  name: 'Farm-Fresh Cream',    sub: 'Triple-churned for velvet texture' },
    ],
    cupcake: [
        { icon: 'grain',       name: 'Artisan Flour',       sub: 'Stone-milled for a light crumb' },
        { icon: 'egg_alt',     name: 'Free-Range Eggs',     sub: 'Sourced from local family farms' },
        { icon: 'nutrition',   name: 'Belgian Chocolate',   sub: 'Single-origin 72% dark cacao' },
    ],
    cookie: [
        { icon: 'grain',       name: 'Brown Butter',        sub: 'Slow-cooked for nutty depth' },
        { icon: 'spa',         name: 'Sea Salt Flakes',     sub: 'Harvested from Brittany coastline' },
        { icon: 'nutrition',   name: 'Dark Chocolate Chips',sub: 'Premium 60% cacao chunks' },
    ],
    diy: [
        { icon: 'spa',         name: 'Vanilla Frosting Base',sub: 'Ready-to-color buttercream' },
        { icon: 'nutrition',   name: 'Sprinkle Mix',        sub: 'Custom royal confetti blend' },
        { icon: 'water_drop',  name: 'Edible Paint Set',    sub: 'Food-safe shimmer palette' },
    ],
};

const REVIEWS = [
    {
        name: 'Sophia L.',
        stars: 5,
        text: '"The frosting is truly like velvet. Not too sweet, just perfectly balanced berry notes. My new favorite!"',
    },
    {
        name: 'Marcus T.',
        stars: 5,
        text: '"Beautifully presented. The sponge is so light it practically melts. Highly recommend for special occasions."',
    },
];

const CATEGORY_LABELS = {
    cake:    'PREMIUM COLLECTION',
    cupcake: 'SIGNATURE COLLECTION',
    cookie:  'FRESH DAILY',
    diy:     'DIY STUDIO',
};

// ── qty state ─────────────────────────────────────────────
let _qty = 1;

function changeQty(delta) {
    _qty = Math.max(1, _qty + delta);
    document.getElementById('ppQty').textContent = _qty;
    const d = document.getElementById('ppQtyDesktop');
    if (d) d.textContent = _qty;
    updatePpPrice();
}

// ── star render ───────────────────────────────────────────
function renderStars(rating) {
    const full = Math.round(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="${i <= full ? 'filled' : ''}">${i <= full ? '★' : '☆'}</span>`;
    }
    return html;
}

// ── load product ──────────────────────────────────────────
function loadProduct() {
    let product;
    try { product = JSON.parse(sessionStorage.getItem('ppProduct')); } catch {}
    if (!product) return;

    document.title = product.name + ' — The Cupcake Princess';

    const cat = product.categoryType || 'cake';

    document.getElementById('ppHeroImg').src = product.imgSrc || '';
    document.getElementById('ppHeroImg').alt = product.name;
    document.getElementById('ppCategory').textContent = CATEGORY_LABELS[cat] || cat.toUpperCase();
    document.getElementById('ppName').textContent = product.name;
    document.getElementById('ppPrice').textContent = product.price;

    const rating = product.rating || 4.9;
    const reviewCount = product.reviewCount || (Math.floor(product.basePrice || 42) * 2 + 40);
    document.getElementById('ppStars').innerHTML = renderStars(rating);
    document.getElementById('ppRatingText').textContent = rating + ' stars from ' + reviewCount + ' reviews';

    document.getElementById('ppQuote').textContent =
        product.desc ? '”' + product.desc + '”' : '”A royal treat crafted with love and the finest ingredients.”';

    // show correct size/box section based on category
    const sizeSection = document.getElementById('ppSizeSection');
    const boxSection  = document.getElementById('ppBoxSection');
    if (cat === 'cake') {
        sizeSection.style.display = '';
        boxSection.style.display  = 'none';
    } else if (cat === 'cupcake') {
        sizeSection.style.display = 'none';
        boxSection.style.display  = '';
    } else {
        sizeSection.style.display = 'none';
        boxSection.style.display  = 'none';
    }

    window._ppUnitPrice = product.basePrice;
    document.getElementById('ppPrice').textContent = '$' + (product.basePrice * _qty).toFixed(2);

    // ingredients
    const ings = INGREDIENTS[cat] || INGREDIENTS.cake;
    document.getElementById('ppIngredients').innerHTML = ings.map(ing => `
        <div class="pp-ing-item">
            <div class="pp-ing-icon-wrap">
                <span class="material-symbols-outlined">${ing.icon}</span>
            </div>
            <div>
                <p class="pp-ing-name">${ing.name}</p>
                <p class="pp-ing-sub">${ing.sub}</p>
            </div>
        </div>
    `).join('');

    // reviews
    document.getElementById('ppReviews').innerHTML = REVIEWS.map(r => `
        <div class="pp-review-card">
            <div class="pp-review-top">
                <span class="pp-reviewer">${r.name}</span>
                <span class="pp-rev-stars">${'★'.repeat(r.stars)}</span>
            </div>
            <p class="pp-rev-text">${r.text}</p>
        </div>
    `).join('');

    window._ppProduct = product;
}

function toggleHeart(btn) {
    btn.classList.toggle('active');
}

function addToCartFromPage() {
    const p = window._ppProduct;
    if (!p) return;

    let cart;
    try { cart = JSON.parse(localStorage.getItem('cupcakeCart')) || []; }
    catch { cart = []; }

    const flavorBtn = document.querySelector('#ppFlavorOptions .pp-option.active');
    const flavor = flavorBtn ? flavorBtn.textContent.trim() : '';
    const sizeBtn = document.querySelector('#ppSizeOptions .pp-option.active') ||
                    document.querySelector('#ppBoxOptions .pp-option.active');
    const size = sizeBtn ? sizeBtn.textContent.trim() : '';
    const unitPrice = window._ppUnitPrice || p.basePrice;

    cart.push({
        id: Date.now().toString(),
        name: p.name,
        imgSrc: p.imgSrc,
        unitPrice,
        basePrice: p.basePrice,
        qty: _qty,
        flavor,
        size,
        category: (CATEGORY_LABELS[p.categoryType] || 'COLLECTION'),
        categoryType: p.categoryType || 'cake',
        desc: p.desc || '',
    });
    localStorage.setItem('cupcakeCart', JSON.stringify(cart));

    [document.getElementById('ppAddBtn'), document.getElementById('ppAddBtnDesktop')]
        .filter(Boolean).forEach(btn => {
            btn.textContent = 'Added!';
            btn.classList.add('added');
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.classList.remove('added');
            }, 1800);
        });
}

// ── search panel (desktop) ────────────────────────────────
function handleSearchClick(e) {
    if (window.innerWidth >= 1000) { e.preventDefault(); openSearchPanel(); }
}
function openSearchPanel() {
    const frame = document.getElementById('searchPanelFrame');
    if (!frame.dataset.loaded) { frame.src = 'search-page.html?panel=1'; frame.dataset.loaded = '1'; }
    document.getElementById('searchOverlay').classList.add('open');
    document.getElementById('searchPanel').classList.add('open');
}
function closeSearchPanel() {
    document.getElementById('searchOverlay').classList.remove('open');
    document.getElementById('searchPanel').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearchPanel(); });

document.addEventListener('DOMContentLoaded', loadProduct);
