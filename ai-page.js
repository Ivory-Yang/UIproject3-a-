document.addEventListener("DOMContentLoaded", function () {
    const chatArea = document.getElementById("chatArea");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        const userMsg = document.createElement("div");
        userMsg.className = "message user-message";
        userMsg.innerHTML = `<div class="message-bubble user-bubble">${text}</div>`;
        chatArea.appendChild(userMsg);

        chatInput.value = "";

        const typingWrap = document.createElement("div");
        typingWrap.className = "typing-wrap";
        typingWrap.innerHTML = `
            <div class="msg-avatar"><span class="material-symbols-outlined">auto_awesome</span></div>
            <div class="typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>`;
        chatArea.appendChild(typingWrap);

        chatArea.scrollTop = chatArea.scrollHeight;

        setTimeout(() => {
            typingWrap.remove();
            const aiMsg = document.createElement("div");
            aiMsg.className = "message ai-message";
            aiMsg.innerHTML = `
                <div class="msg-avatar"><span class="material-symbols-outlined">auto_awesome</span></div>
                <div class="message-bubble ai-bubble">
                    I'd love to help with that! Could you tell me a bit more — for example, the occasion, number of guests, or any flavour preferences?
                </div>`;
            chatArea.appendChild(aiMsg);
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 1500);
    }

    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    document.querySelectorAll(".chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
            chatInput.value = chip.textContent.trim().replace(/^[^\w]+/, "");
            sendMessage();
        });
    });

    chatArea.scrollTop = chatArea.scrollHeight;
});
