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
function openSearchPage() {
    const searchPage = document.getElementById("searchPage");
    searchPage.classList.add("active");

    const input = searchPage.querySelector("input");
    input.focus();
}

function closeSearchPage() {
    const searchPage = document.getElementById("searchPage");
    searchPage.classList.remove("active");
}