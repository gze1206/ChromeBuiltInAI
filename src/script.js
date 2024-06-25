let session;

const promptInput = document.getElementById("prompt");
const sendButton = document.getElementById("send-button");
const loadingIndicator = document.getElementById("loading");
const messagesContainer = document.getElementById("messages");
const chatWindow = document.getElementById("chat-window");
const popup = document.getElementById("popup");
const popupButton = document.getElementById("popup-button");

async function initialize() {
    try {
        if (!window.ai || (await window.ai.canCreateTextSession()) !== 'readily') {
            throw new Error('AI API is not available');
        }
    } catch (error) {
        showPopup();
        promptInput.disabled = true;
        sendButton.disabled = true;
        return;
    }

    session = await window.ai.createTextSession();
}

function showPopup() {
    popup.classList.remove('hidden');
    popupButton.onclick = () => {
        window.open('https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit', '_blank').focus();
    };
}

async function sendPrompt() {
    if (!session) return;

    const prompt = promptInput.value;
    if (!prompt.trim()) return;

    appendMessage(prompt, 'user-message');
    promptInput.value = '';
    promptInput.disabled = true; // Disable input
    sendButton.disabled = true; // Disable button

    loadingIndicator.style.display = 'flex'; // Show loading animation

    const result = await session.prompt(prompt);
    
    appendMessage(result, 'ai-message');

    promptInput.disabled = false; // Enable input
    sendButton.disabled = false; // Enable button
    loadingIndicator.style.display = 'none'; // Hide loading animation
    promptInput.focus(); // Keep focus on input field
}

function appendMessage(text, className) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${className}`;
    messageContainer.innerHTML = marked.parse(text);
    messagesContainer.appendChild(messageContainer);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Initialize the AI session on page load
initialize();
