document.addEventListener("DOMContentLoaded", function () {
    const clearAllRecent = document.getElementById("clearAllRecent");
    const recentSearchList = document.getElementById("recentSearchList");

    clearAllRecent.addEventListener("click", function () {
        recentSearchList.innerHTML = "";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const closeButtons = document.querySelectorAll(".recent-search-item .close");

    closeButtons.forEach(function (closeButton) {
        closeButton.addEventListener("click", function (event) {
            event.stopPropagation();

            const historyItem = closeButton.closest(".recent-search-item");
            historyItem.remove();
        });
    });
});
if (new URLSearchParams(window.location.search).get('panel') === '1') {
    document.documentElement.classList.add('panel-mode');
}