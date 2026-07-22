no/* =========================================
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
/* =========================================
   SAEED AI ASSISTANT — AI.JS V3.1
   PART 2 — ADVANCED INTERACTIONS
   ========================================= */


/* =========================================
   18. MOBILE SIDEBAR
========================================= */

const aiMenuBtn =
    document.getElementById("aiMenuBtn");

const aiSidebar =
    document.getElementById("aiSidebar");

if (
    aiMenuBtn &&
    aiSidebar
) {

    aiMenuBtn.addEventListener(
        "click",
        () => {

            aiSidebar.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================
   19. CLOSE SIDEBAR WHEN NAV LINK IS CLICKED
========================================= */

const aiNavLinks =
    document.querySelectorAll(
        ".ai-nav-link"
    );

aiNavLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 900 &&
                    aiSidebar
                ) {

                    aiSidebar.classList.remove(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================
   20. CLOSE SIDEBAR OUTSIDE
========================================= */

document.addEventListener(
    "click",
    (event) => {

        if (
            window.innerWidth <= 900 &&
            aiSidebar &&
            aiMenuBtn
        ) {

            const clickedInsideSidebar =
                aiSidebar.contains(
                    event.target
                );

            const clickedMenu =
                aiMenuBtn.contains(
                    event.target
                );


            if (
                !clickedInsideSidebar &&
                !clickedMenu
            ) {

                aiSidebar.classList.remove(
                    "active"
                );

            }

        }

    }
);


/* =========================================
   21. THEME SYSTEM
========================================= */

const aiThemeBtn =
    document.getElementById(
        "aiThemeBtn"
    );

const mobileThemeBtn =
    document.getElementById(
        "mobileThemeBtn"
    );


function updateThemeIcons() {

    const isLight =
        document.body.classList.contains(
            "light-mode"
        );


    if (aiThemeBtn) {

        aiThemeBtn.innerHTML =
            isLight
                ? "🌙 Dark Mode"
                : "☀️ Light Mode";

    }


    if (mobileThemeBtn) {

        mobileThemeBtn.innerHTML =
            isLight
                ? "🌙"
                : "☀️";

    }

}


function toggleAITheme() {

    document.body.classList.toggle(
        "light-mode"
    );


    const currentTheme =
        document.body.classList.contains(
            "light-mode"
        )
            ? "light"
            : "dark";


    localStorage.setItem(
        "saeedAITheme",
        currentTheme
    );


    updateThemeIcons();

}


/* Load saved theme */

const savedAITheme =
    localStorage.getItem(
        "saeedAITheme"
    );


if (
    savedAITheme === "light"
) {

    document.body.classList.add(
        "light-mode"
    );

}


updateThemeIcons();


if (aiThemeBtn) {

    aiThemeBtn.addEventListener(
        "click",
        toggleAITheme
    );

}


if (mobileThemeBtn) {

    mobileThemeBtn.addEventListener(
        "click",
        toggleAITheme
    );

}


/* =========================================
   22. COPY AI RESPONSE
========================================= */

document.addEventListener(
    "click",
    async (event) => {

        const aiMessage =
            event.target.closest(
                ".ai-message"
            );


        if (
            !aiMessage ||
            event.target.closest(
                ".copy-ai-btn"
            )
        ) {

            return;

        }


        const existingButton =
            aiMessage.querySelector(
                ".copy-ai-btn"
            );


        if (existingButton) {

            return;

        }


        const copyButton =
            document.createElement(
                "button"
            );


        copyButton.className =
            "copy-ai-btn";


        copyButton.innerHTML =
            "📋 Copy";


        copyButton.type =
            "button";


        copyButton.addEventListener(
            "click",
            async () => {

                const text =
                    aiMessage.innerText
                        .replace(
                            "📋 Copy",
                            ""
                        )
                        .trim();


                try {

                    await navigator.clipboard.writeText(
                        text
                    );


                    copyButton.innerHTML =
                        "✅ Copied";


                    setTimeout(
                        () => {

                            copyButton.innerHTML =
                                "📋 Copy";

                        },
                        2000
                    );


                } catch (error) {

                    console.error(
                        "Copy failed:",
                        error
                    );

                }

            }
        );


        aiMessage.appendChild(
            copyButton
        );

    }
);


/* =========================================
   23. VOICE INPUT
========================================= */

const voiceBtn =
    document.getElementById(
        "voiceBtn"
    );


if (voiceBtn) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        voiceBtn.title =
            "Voice input is not supported in this browser";


    } else {

        const recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-US";


        recognition.continuous =
            false;


        recognition.interimResults =
            false;


        voiceBtn.addEventListener(
            "click",
            () => {

                try {

                    recognition.start();


                    voiceBtn.innerHTML =
                        "🔴";


                    voiceBtn.classList.add(
                        "recording"
                    );

                } catch (error) {

                    console.log(
                        "Voice recognition already active."
                    );

                }

            }
        );


        recognition.onresult =
            (event) => {

                const transcript =
                    event
                        .results[0][0]
                        .transcript;


                if (chatInput) {

                    chatInput.value =
                        transcript;

                    chatInput.focus();

                }

            };


        recognition.onend =
            () => {

                voiceBtn.innerHTML =
                    "🎤";


                voiceBtn.classList.remove(
                    "recording"
                );

            };


        recognition.onerror =
            (event) => {

                console.error(
                    "Voice recognition error:",
                    event.error
                );


                voiceBtn.innerHTML =
                    "🎤";


                voiceBtn.classList.remove(
                    "recording"
                );

            };

    }

}


/* =========================================
   24. FILE ATTACHMENT
========================================= */

const attachBtn =
    document.getElementById(
        "attachBtn"
    );

const fileInput =
    document.getElementById(
        "fileInput"
    );


if (
    attachBtn &&
    fileInput
) {

    attachBtn.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        () => {

            const file =
                fileInput.files[0];


            if (!file) {

                return;

            }


            if (chatInput) {

                chatInput.value =
                    `📎 ${file.name}`;

                chatInput.focus();

            }


            console.log(
                "Selected file:",
                file.name
            );

        }
    );

}


/* =========================================
   25. ENTER TO SEND
========================================= */

if (chatInput) {

    chatInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                if (chatForm) {

                    chatForm.requestSubmit();

                }

            }

        }
    );

}


/* =========================================
   26. BUTTON LOADING STATE
========================================= */

if (
    chatForm &&
    sendBtn
) {

    chatForm.addEventListener(
        "submit",
        () => {

            sendBtn.disabled =
                true;


            sendBtn.innerHTML =
                "⏳";


            setTimeout(
                () => {

                    sendBtn.disabled =
                        false;

                    sendBtn.innerHTML =
                        "➤";

                },
                1000
            );

        }
    );

}


/* =========================================
   27. TYPING INDICATOR STYLE CLASS
========================================= */

const typingStyle =
    document.createElement(
        "style"
    );


typingStyle.textContent = `

.typing-indicator{

display:flex;

align-items:center;

gap:5px;

width:max-content;

}

.typing-indicator span{

width:7px;

height:7px;

border-radius:50%;

background:#00E676;

animation:aiTyping 1.2s infinite ease-in-out;

}

.typing-indicator span:nth-child(2){

animation-delay:.15s;

}

.typing-indicator span:nth-child(3){

animation-delay:.30s;

}

@keyframes aiTyping{

0%,60%,100%{

transform:translateY(0);

opacity:.4;

}

30%{

transform:translateY(-5px);

opacity:1;

}

}

.copy-ai-btn{

display:block;

margin-top:10px;

padding:5px 9px;

border:none;

border-radius:7px;

background:rgba(255,255,255,.08);

color:#9fb0c8;

font-size:11px;

cursor:pointer;

transition:.3s;

}

.copy-ai-btn:hover{

background:#00E676;

color:#07142b;

}

body.light-mode .copy-ai-btn{

background:#eef3f8;

color:#52647a;

}

body.light-mode .copy-ai-btn:hover{

background:#00E676;

color:#07142b;

}

.recording{

background:#ff3b30 !important;

color:#fff !important;

animation:recordPulse 1s infinite;

}

@keyframes recordPulse{

0%{

box-shadow:0 0 0 0 rgba(255,59,48,.5);

}

70%{

box-shadow:0 0 0 10px rgba(255,59,48,0);

}

100%{

box-shadow:0 0 0 0 rgba(255,59,48,0);

}

}

`;


document.head.appendChild(
    typingStyle
);


/* =========================================
   28. FINAL CONSOLE MESSAGE
========================================= */

console.log(
    "🤖 Saeed AI V3.1 Advanced Interactions Loaded"
);
