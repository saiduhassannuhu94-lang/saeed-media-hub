/* =========================================
   SAEED AI ASSISTANT — AI.JS V3.1
   PART 1 — CORE CHAT SYSTEM
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. GET ELEMENTS
    ===================================== */

    const aiLoader =
        document.getElementById("aiLoader");

    const chatForm =
        document.getElementById("chatForm");

    const chatInput =
        document.getElementById("chatInput");

    const sendBtn =
        document.getElementById("sendBtn");

    const messagesContainer =
        document.getElementById("messagesContainer");

    const welcomeScreen =
        document.getElementById("welcomeScreen");

    const newChatBtn =
        document.getElementById("newChatBtn");

    const clearChatBtn =
        document.getElementById("clearChatBtn");

    const quickPrompts =
        document.querySelectorAll(".quick-prompt");


    /* =====================================
       2. AI LOADER
    ===================================== */

    if (aiLoader) {

        setTimeout(() => {

            aiLoader.style.opacity = "0";
            aiLoader.style.visibility = "hidden";
            aiLoader.style.pointerEvents = "none";

            setTimeout(() => {

                aiLoader.style.display = "none";

            }, 600);

        }, 1200);

    }


    /* =====================================
       3. CHAT HISTORY
    ===================================== */

    let chatHistory =
        JSON.parse(
            localStorage.getItem(
                "saeedAIChat"
            )
        ) || [];


    /* =====================================
       4. SHOW / HIDE WELCOME SCREEN
    ===================================== */

    function updateWelcomeScreen() {

        if (!welcomeScreen) return;


        if (
            chatHistory.length > 0
        ) {

            welcomeScreen.style.display =
                "none";

        } else {

            welcomeScreen.style.display =
                "block";

        }

    }


    /* =====================================
       5. CREATE MESSAGE
    ===================================== */

    function createMessage(
        message,
        sender,
        save = true
    ) {

        if (
            !messagesContainer
        ) return;


        const messageElement =
            document.createElement(
                "div"
            );


        if (
            sender === "user"
        ) {

            messageElement.className =
                "user-message";

        } else {

            messageElement.className =
                "ai-message";

        }


        messageElement.textContent =
            message;


        messagesContainer.appendChild(
            messageElement
        );


        scrollToBottom();


        if (save) {

            chatHistory.push({

                sender:
                    sender,

                message:
                    message,

                time:
                    new Date().toISOString()

            });


            saveChatHistory();

        }

    }


    /* =====================================
       6. SAVE CHAT HISTORY
    ===================================== */

    function saveChatHistory() {

        localStorage.setItem(

            "saeedAIChat",

            JSON.stringify(
                chatHistory
            )

        );

    }


    /* =====================================
       7. LOAD CHAT HISTORY
    ===================================== */

    function loadChatHistory() {

        if (
            !messagesContainer
        ) return;


        messagesContainer.innerHTML =
            "";


        chatHistory.forEach(
            (chat) => {

                createMessage(

                    chat.message,

                    chat.sender,

                    false

                );

            }
        );


        updateWelcomeScreen();

    }


    /* =====================================
       8. SCROLL TO BOTTOM
    ===================================== */

    function scrollToBottom() {

        const chatArea =
            document.getElementById(
                "chatArea"
            );


        if (!chatArea) return;


        setTimeout(() => {

            chatArea.scrollTo({

                top:
                    chatArea.scrollHeight,

                behavior:
                    "smooth"

            });

        }, 100);

    }


    /* =====================================
       9. TYPING INDICATOR
    ===================================== */

    function showTypingIndicator() {

        if (
            !messagesContainer
        ) return;


        const typing =
            document.createElement(
                "div"
            );


        typing.className =
            "ai-message typing-indicator";


        typing.innerHTML = `

            <span></span>
            <span></span>
            <span></span>

        `;


        typing.id =
            "typingIndicator";


        messagesContainer.appendChild(
            typing
        );


        scrollToBottom();

    }


    /* =====================================
       10. REMOVE TYPING INDICATOR
    ===================================== */

    function removeTypingIndicator() {

        const typing =
            document.getElementById(
                "typingIndicator"
            );


        if (typing) {

            typing.remove();

        }

    }


    /* =====================================
       11. LOCAL DEMO AI
    ===================================== */

    function generateAIResponse(
        userMessage
    ) {

        const message =
            userMessage.toLowerCase();


        if (
            message.includes("hello") ||
            message.includes("hi") ||
            message.includes("sannu")
        ) {

            return `
Hello! 👋

Welcome to Saeed AI.

I'm your intelligent assistant from Saeed Media Hub. How can I help you today?
            `.trim();

        }


        if (
            message.includes("service") ||
            message.includes("services")
        ) {

            return `
Saeed Media Hub provides digital services including:

💻 Website Development
🎨 Graphic Design
🤖 AI Solutions
📱 Social Media Support
🎬 Creative Media Services
🛠️ Digital Technology Solutions

Ask me about any service and I'll be happy to help.
            `.trim();

        }


        if (
            message.includes("website") ||
            message.includes("web")
        ) {

            return `
Yes! 🌐

Saeed Media Hub can help you create modern, responsive and professional websites that work on:

📱 Mobile phones
📲 Tablets
💻 Computers

We focus on clean design, good user experience and modern technology.
            `.trim();

        }


        if (
            message.includes("ai")
        ) {

            return `
AI can help you with many things, including:

🤖 Content creation
🎨 Design ideas
💻 Programming
🌐 Website development
📚 Learning and research
📊 Data analysis
⚡ Automation

Tell me what you want to achieve and I'll guide you.
            `.trim();

        }


        if (
            message.includes("design") ||
            message.includes("graphic")
        ) {

            return `
🎨 Graphic design is about communicating ideas visually.

Saeed Media Hub can help with:

🖼️ Social media designs
📢 Advertisements
🎯 Brand identity
💼 Business flyers
🎬 Creative visuals
✨ AI-powered designs
            `.trim();

        }


        if (
            message.includes("who are you") ||
            message.includes("about you")
        ) {

            return `
I'm Saeed AI 🤖 — the AI Assistant of Saeed Media Hub.

I'm designed to help users explore technology, AI, web development, graphic design and digital solutions.
            `.trim();

        }


        return `
Thanks for your message! 🤖

I'm currently running in demo mode.

Your message was:

"${userMessage}"

My full AI intelligence will be connected through a secure AI backend in the next stage.

For now, try asking me about:

💻 Websites
🎨 Graphic Design
🤖 AI
💼 Services
📱 Technology
        `.trim();

    }


    /* =====================================
       12. SEND MESSAGE
    ===================================== */

    async function sendMessage(
        message
    ) {

        if (
            !message ||
            !message.trim()
        ) {

            return;

        }


        const cleanMessage =
            message.trim();


        createMessage(

            cleanMessage,

            "user"

        );


        if (chatInput) {

            chatInput.value =
                "";

        }


        showTypingIndicator();


        await new Promise(
            (resolve) => {

                setTimeout(
                    resolve,
                    900
                );

            }
        );


        removeTypingIndicator();


        const aiResponse =
            generateAIResponse(
                cleanMessage
            );


        createMessage(

            aiResponse,

            "ai"

        );

    }


    /* =====================================
       13. CHAT FORM SUBMIT
    ===================================== */

    if (
        chatForm &&
        chatInput
    ) {

        chatForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const message =
                    chatInput.value.trim();


                if (!message) {

                    return;

                }


                sendMessage(
                    message
                );

            }
        );

    }


    /* =====================================
       14. QUICK PROMPTS
    ===================================== */

    quickPrompts.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const prompt =
                        button.getAttribute(
                            "data-prompt"
                        );


                    if (prompt) {

                        sendMessage(
                            prompt
                        );

                    }

                }
            );

        }
    );


    /* =====================================
       15. NEW CHAT
    ===================================== */

    if (newChatBtn) {

        newChatBtn.addEventListener(
            "click",
            () => {

                chatHistory = [];


                saveChatHistory();


                if (
                    messagesContainer
                ) {

                    messagesContainer.innerHTML =
                        "";

                }


                updateWelcomeScreen();


                if (chatInput) {

                    chatInput.focus();

                }

            }
        );

    }


    /* =====================================
       16. CLEAR CHAT
    ===================================== */

    if (clearChatBtn) {

        clearChatBtn.addEventListener(
            "click",
            () => {

                const confirmClear =
                    confirm(
                        "Are you sure you want to clear this chat?"
                    );


                if (
                    !confirmClear
                ) {

                    return;

                }


                chatHistory = [];


                localStorage.removeItem(
                    "saeedAIChat"
                );


                if (
                    messagesContainer
                ) {

                    messagesContainer.innerHTML =
                        "";

                }


                updateWelcomeScreen();

            }
        );

    }


    /* =====================================
       17. INITIALIZE
    ===================================== */

    loadChatHistory();


    if (chatInput) {

        chatInput.focus();

    }


    console.log(
        "🤖 Saeed AI V3.1 Core Chat System Loaded"
    );

});
