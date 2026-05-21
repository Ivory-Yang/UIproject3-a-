function toggleFavorite(event, button) {
    event.preventDefault();
    event.stopPropagation();
    button.classList.toggle("active");
}
function subscribeAnimate(event) {
    event.preventDefault();

    const form = event.target;
    const input = form.querySelector("input");
    const button = form.querySelector(".subscribe-button");
    const buttonText = form.querySelector(".button-text");

    if (input.value.trim() === "") {
        return;
    }

    button.classList.add("subscribed");
    buttonText.textContent = "SUBSCRIBED";

    setTimeout(function () {
        button.classList.remove("subscribed");
        buttonText.textContent = "SUBSCRIBE";
        input.value = "";
    }, 2500);
}
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