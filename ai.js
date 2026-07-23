/* =========================================================
   SAEED AI — AI.JS V4.2 COMPLETE
   Frontend controller for AI.HTML V4.1 + AI.CSS V4.1
   Backend/API connection: /api/chat
   ========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector)
  ];

  const on = (el, event, fn, options) =>
    el && el.addEventListener(event, fn, options);

  const els = {
    authScreen: $("authScreen"),
    app: $("app"),
    loginForm: $("loginForm"),
    signupForm: $("signupForm"),
    loginEmail: $("loginEmail"),
    loginPassword: $("loginPassword"),
    signupName: $("signupName"),
    signupEmail: $("signupEmail"),
    signupPassword: $("signupPassword"),
    logoutBtn: $("logoutBtn"),

    userName: $("userName"),
    userAvatar: $("userAvatar"),

    chatList: $("chatList"),
    newChatBtn: $("newChatBtn"),
    deleteChatBtn: $("deleteChatBtn"),

    messages: $("messages"),
    messageInput: $("messageInput"),
    sendBtn: $("sendBtn"),
    stopBtn: $("stopBtn"),

    fileInput: $("fileInput"),
    attachBtn: $("attachBtn"),
    attachmentPreview: $("attachmentPreview"),

    voiceBtn: $("voiceBtn"),
    micBtn: $("micBtn"),

    modelSelect: $("modelSelect"),
    temperature: $("temperature"),
    temperatureValue: $("temperatureValue"),

    settingsBtn: $("settingsBtn"),
    settingsModal: $("settingsModal"),
    closeSettings: $("closeSettings"),

    themeToggle: $("themeToggle"),
    clearHistoryBtn: $("clearHistoryBtn"),

    welcomeScreen: $("welcomeScreen"),
    typingIndicator: $("typingIndicator"),

    toast: $("toast")
  };

  /* =========================================================
     STATE
     ========================================================= */

  const state = {
    user: null,
    chats: [],
    activeChatId: null,
    attachments: [],
    currentRequest: null,
    recognition: null,
    isRecording: false,
    isGenerating: false,
    settings: {
      model: "default",
      temperature: 0.7,
      theme: "dark"
    }
  };

  /* =========================================================
     STORAGE KEYS
     ========================================================= */

  const STORAGE = {
    USER: "saeed_ai_user",
    CHATS: "saeed_ai_chats",
    SETTINGS: "saeed_ai_settings"
  };

  /* =========================================================
     HELPERS
     ========================================================= */

  function uid(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;
  }

  function escapeHTML(value = "") {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  function showToast(message) {
    if (!els.toast) return;

    els.toast.textContent = message;
    els.toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      els.toast.classList.remove("show");
    }, 2500);
  }

  function saveChats() {
    localStorage.setItem(
      STORAGE.CHATS,
      JSON.stringify(state.chats)
    );
  }

  function saveSettings() {
    localStorage.setItem(
      STORAGE.SETTINGS,
      JSON.stringify(state.settings)
    );
  }

  function loadSettings() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE.SETTINGS) || "null"
      );

      if (saved) {
        state.settings = {
          ...state.settings,
          ...saved
        };
      }
    } catch (error) {
      console.warn("Could not load settings:", error);
    }
  }

  function loadChats() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE.CHATS) || "[]"
      );

      state.chats = Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("Could not load chats:", error);
      state.chats = [];
    }
  }

  function loadUser() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE.USER) || "null"
      );

      state.user = saved;
    } catch (error) {
      state.user = null;
    }
  }

  function saveUser(user) {
    state.user = user;

    localStorage.setItem(
      STORAGE.USER,
      JSON.stringify(user)
    );
  }

  function removeUser() {
    state.user = null;
    localStorage.removeItem(STORAGE.USER);
  }

  /* =========================================================
     AUTH
     ========================================================= */

  function showAuth() {
    if (els.authScreen) {
      els.authScreen.classList.remove("hidden");
    }

    if (els.app) {
      els.app.classList.add("hidden");
    }
  }

  function showApp() {
    if (els.authScreen) {
      els.authScreen.classList.add("hidden");
    }

    if (els.app) {
      els.app.classList.remove("hidden");
    }

    updateUserUI();
  }

  function updateUserUI() {
    if (!state.user) return;

    if (els.userName) {
      els.userName.textContent =
        state.user.name || "Saeed AI User";
    }

    if (els.userAvatar) {
      const name = state.user.name || "User";
      els.userAvatar.textContent =
        name.charAt(0).toUpperCase();
    }
  }

  function handleLogin(event) {
    event.preventDefault();

    const email =
      els.loginEmail?.value.trim() || "";

    const password =
      els.loginPassword?.value || "";

    if (!email || !password) {
      showToast("Please enter your email and password.");
      return;
    }

    const user = {
      id: uid("user"),
      name: email.split("@")[0],
      email
    };

    saveUser(user);
    showApp();

    if (els.loginForm) {
      els.loginForm.reset();
    }

    showToast("Welcome back to Saeed AI.");
  }

  function handleSignup(event) {
    event.preventDefault();

    const name =
      els.signupName?.value.trim() || "";

    const email =
      els.signupEmail?.value.trim() || "";

    const password =
      els.signupPassword?.value || "";

    if (!name || !email || !password) {
      showToast("Please complete all fields.");
      return;
    }

    const user = {
      id: uid("user"),
      name,
      email
    };

    saveUser(user);
    showApp();

    if (els.signupForm) {
      els.signupForm.reset();
    }

    showToast("Account created successfully.");
  }

  function logout() {
    removeUser();
    showAuth();
    showToast("You have been logged out.");
  }

  /* =========================================================
     CHAT MANAGEMENT
     ========================================================= */

  function createChat() {
    const chat = {
      id: uid("chat"),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    state.chats.unshift(chat);
    state.activeChatId = chat.id;

    saveChats();
    renderChatList();
    renderMessages();

    return chat;
  }

  function getActiveChat() {
    return state.chats.find(
      (chat) => chat.id === state.activeChatId
    );
  }

  function ensureActiveChat() {
    let chat = getActiveChat();

    if (!chat) {
      chat = createChat();
    }

    return chat;
  }

  function deleteActiveChat() {
    if (!state.activeChatId) return;

    state.chats = state.chats.filter(
      (chat) => chat.id !== state.activeChatId
    );

    state.activeChatId =
      state.chats[0]?.id || null;

    saveChats();
    renderChatList();
    renderMessages();

    showToast("Chat deleted.");
  }

  function clearHistory() {
    const chat = getActiveChat();

    if (!chat) return;

    chat.messages = [];
    chat.updatedAt = Date.now();

    saveChats();
    renderMessages();

    showToast("Chat history cleared.");
  }

  function selectChat(chatId) {
    state.activeChatId = chatId;
    renderChatList();
    renderMessages();
  }

  function updateChatTitle(chat, prompt) {
    if (!chat || chat.title !== "New Chat") {
      return;
    }

    const cleanPrompt =
      prompt.replace(/\s+/g, " ").trim();

    if (!cleanPrompt) return;

    chat.title =
      cleanPrompt.length > 35
        ? `${cleanPrompt.slice(0, 35)}...`
        : cleanPrompt;

    chat.updatedAt = Date.now();
  }

  function renderChatList() {
    if (!els.chatList) return;

    els.chatList.innerHTML = "";

    state.chats.forEach((chat) => {
      const item = document.createElement("button");

      item.className =
        "chat-list-item" +
        (chat.id === state.activeChatId
          ? " active"
          : "");

      item.type = "button";

      item.innerHTML = `
        <span class="chat-list-icon">💬</span>
        <span class="chat-list-title">
          ${escapeHTML(chat.title)}
        </span>
      `;

      on(item, "click", () => {
        selectChat(chat.id);
      });

      els.chatList.appendChild(item);
    });
  }

  /* =========================================================
     MESSAGE RENDERING
     ========================================================= */

  function formatMessage(text = "") {
    let html = escapeHTML(text);

    html = html.replace(
      /```([\s\S]*?)```/g,
      "<pre><code>$1</code></pre>"
    );

    html = html.replace(
      /`([^`]+)`/g,
      "<code>$1</code>"
    );

    html = html.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    html = html.replace(
      /\n/g,
      "<br>"
    );

    return html;
  }

  function renderMessages() {
    if (!els.messages) return;

    const chat = getActiveChat();

    els.messages.innerHTML = "";

    if (!chat || !chat.messages.length) {
      if (els.welcomeScreen) {
        els.welcomeScreen.classList.remove("hidden");
      }

      return;
    }

    if (els.welcomeScreen) {
      els.welcomeScreen.classList.add("hidden");
    }

    chat.messages.forEach((message) => {
      renderMessageElement(message);
    });

    scrollMessages();
  }

  function renderMessageElement(message) {
    if (!els.messages) return null;

    const wrapper =
      document.createElement("div");

    wrapper.className =
      `message ${message.role}`;

    wrapper.dataset.messageId =
      message.id;

    const avatar =
      message.role === "user"
        ? "👤"
        : "🤖";

    wrapper.innerHTML = `
      <div class="message-avatar">
        ${avatar}
      </div>

      <div class="message-content">
        <div class="message-text">
          ${formatMessage(message.content || "")}
        </div>

        ${
          message.attachments?.length
            ? `
              <div class="message-attachments">
                ${message.attachments
                  .map(
                    (file) => `
                      <div class="attachment-item">
                        📎 ${escapeHTML(file.name || "File")}
                      </div>
                    `
                  )
                  .join("")}
              </div>
            `
            : ""
        }

        ${
          message.role === "assistant"
            ? `
              <div class="message-actions">
                <button
                  type="button"
                  data-action="copy"
                >
                  Copy
                </button>

                <button
                  type="button"
                  data-action="regenerate"
                >
                  Regenerate
                </button>
              </div>
            `
            : ""
        }
      </div>
    `;

    const copyBtn =
      wrapper.querySelector(
        '[data-action="copy"]'
      );

    const regenerateBtn =
      wrapper.querySelector(
        '[data-action="regenerate"]'
      );

    on(copyBtn, "click", () => {
      copyText(message.content);
    });

    on(regenerateBtn, "click", () => {
      regenerateMessage(message.id);
    });

    els.messages.appendChild(wrapper);

    return wrapper;
  }

  function scrollMessages() {
    if (!els.messages) return;

    els.messages.scrollTop =
      els.messages.scrollHeight;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard.");
    } catch (error) {
      showToast("Unable to copy text.");
    }
  }

  /* =========================================================
     ATTACHMENTS
     ========================================================= */

  function handleFiles(files) {
    const selected =
      Array.from(files || []);

    selected.forEach((file) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        state.attachments.push({
          id: uid("file"),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result
        });

        renderAttachmentPreview();
      };

      reader.readAsDataURL(file);
    });
  }

  function renderAttachmentPreview() {
    if (!els.attachmentPreview) return;

    els.attachmentPreview.innerHTML = "";

    state.attachments.forEach((file) => {
      const item =
        document.createElement("div");

      item.className =
        "attachment-preview-item";

      item.innerHTML = `
        <span>
          📎 ${escapeHTML(file.name)}
        </span>

        <button
          type="button"
          aria-label="Remove attachment"
        >
          ×
        </button>
      `;

      const removeBtn =
        item.querySelector("button");

      on(removeBtn, "click", () => {
        state.attachments =
          state.attachments.filter(
            (attachment) =>
              attachment.id !== file.id
          );

        renderAttachmentPreview();
      });

      els.attachmentPreview.appendChild(item);
    });
  }

  /* =========================================================
     TYPING INDICATOR
     ========================================================= */

  function setGenerating(value) {
    state.isGenerating = value;

    if (els.typingIndicator) {
      els.typingIndicator.classList.toggle(
        "hidden",
        !value
      );
    }

    if (els.sendBtn) {
      els.sendBtn.disabled = value;
    }

    if (els.stopBtn) {
      els.stopBtn.classList.toggle(
        "hidden",
        !value
      );
    }
  }

  /* =========================================================
     BACKEND/API — SAEED AI V4.2
     ========================================================= */

  async function requestAI(
    prompt,
    context = [],
    attachments = []
  ) {
    const controller =
      new AbortController();

    state.currentRequest =
      controller;

    try {
      const response =
        await fetch("/api/chat", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            message: prompt,

            history: context,

            attachments
          }),

          signal:
            controller.signal
        });

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          errorData.error ||
          `AI request failed with status ${response.status}`
        );
      }

      const data =
        await response.json();

      if (!data.reply) {
        throw new Error(
          "No AI reply was returned by the backend."
        );
      }

      return data.reply;
    } finally {
      state.currentRequest =
        null;
    }
  }

  /* =========================================================
     SEND MESSAGE
     ========================================================= */

  async function sendMessage() {
    const prompt =
      els.messageInput?.value.trim() || "";

    if (!prompt && !state.attachments.length) {
      return;
    }

    if (state.isGenerating) {
      return;
    }

    const chat =
      ensureActiveChat();

    const userMessage = {
      id: uid("message"),
      role: "user",
      content: prompt,
      attachments: state.attachments.map(
        (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          data: file.data
        })
      ),
      createdAt: Date.now()
    };

    updateChatTitle(chat, prompt);

    chat.messages.push(userMessage);
    chat.updatedAt = Date.now();

    const attachments =
      state.attachments.map(
        (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          data: file.data
        })
      );

    state.attachments = [];

    if (els.messageInput) {
      els.messageInput.value = "";
    }

    renderAttachmentPreview();
    saveChats();
    renderChatList();
    renderMessages();

    setGenerating(true);

    try {
      const history =
        chat.messages
          .filter(
            (message) =>
              message.role === "user" ||
              message.role === "assistant"
          )
          .map(
            (message) => ({
              role: message.role,
              content: message.content
            })
          );

      const reply =
        await requestAI(
          prompt,
          history,
          attachments
        );

      chat.messages.push({
        id: uid("message"),
        role: "assistant",
        content: reply,
        attachments: [],
        createdAt: Date.now()
      });

      chat.updatedAt = Date.now();

      saveChats();
      renderMessages();
    } catch (error) {
      if (
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Saeed AI Backend Error:",
        error
      );

      chat.messages.push({
        id: uid("message"),
        role: "assistant",
        content:
          "Sorry, I couldn't connect to Saeed AI right now. Please check your internet connection or try again.",
        attachments: [],
        createdAt: Date.now()
      });

      saveChats();
      renderMessages();

      showToast(
        "Saeed AI connection error."
      );
    } finally {
      setGenerating(false);
    }
  }

  /* =========================================================
     STOP GENERATION
     ========================================================= */

  function stopGeneration() {
    if (
      state.currentRequest
    ) {
      state.currentRequest.abort();
      state.currentRequest = null;
    }

    setGenerating(false);

    showToast(
      "AI response stopped."
    );
  }

  /* =========================================================
     REGENERATE
     ========================================================= */

  async function regenerateMessage(
    messageId
  ) {
    const chat =
      getActiveChat();

    if (!chat || state.isGenerating) {
      return;
    }

    const index =
      chat.messages.findIndex(
        (message) =>
          message.id === messageId
      );

    if (index === -1) return;

    const previousUserMessage =
      [...chat.messages]
        .slice(0, index)
        .reverse()
        .find(
          (message) =>
            message.role === "user"
        );

    if (!previousUserMessage) {
      return;
    }

    chat.messages =
      chat.messages.slice(0, index);

    saveChats();
    renderMessages();

    setGenerating(true);

    try {
      const history =
        chat.messages
          .map(
            (message) => ({
              role: message.role,
              content: message.content
            })
          );

      const reply =
        await requestAI(
          previousUserMessage.content,
          history,
          previousUserMessage.attachments ||
            []
        );

      chat.messages.push({
        id: uid("message"),
        role: "assistant",
        content: reply,
        attachments: [],
        createdAt: Date.now()
      });

      chat.updatedAt = Date.now();

      saveChats();
      renderMessages();
    } catch (error) {
      if (
        error.name !== "AbortError"
      ) {
        console.error(
          "Regeneration error:",
          error
        );

        showToast(
          "Unable to regenerate response."
        );
      }
    } finally {
      setGenerating(false);
    }
  }

  /* =========================================================
     VOICE INPUT
     ========================================================= */

  function setupVoiceRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    state.recognition =
      new SpeechRecognition();

    state.recognition.continuous =
      false;

    state.recognition.interimResults =
      true;

    state.recognition.lang =
      "en-US";

    state.recognition.onstart =
      () => {
        state.isRecording = true;

        els.voiceBtn?.classList.add(
          "recording"
        );

        els.micBtn?.classList.add(
          "recording"
        );
      };

    state.recognition.onresult =
      (event) => {
        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          transcript +=
            event.results[i][0]
              .transcript;
        }

        if (els.messageInput) {
          els.messageInput.value =
            transcript;
        }
      };

    state.recognition.onend =
      () => {
        state.isRecording = false;

        els.voiceBtn?.classList.remove(
          "recording"
        );

        els.micBtn?.classList.remove(
          "recording"
        );
      };

    state.recognition.onerror =
      (event) => {
        console.warn(
          "Speech recognition error:",
          event.error
        );

        state.isRecording = false;

        els.voiceBtn?.classList.remove(
          "recording"
        );

        els.micBtn?.classList.remove(
          "recording"
        );
      };
  }

  function toggleVoice() {
    if (!state.recognition) {
      showToast(
        "Voice recognition is not supported in this browser."
      );

      return;
    }

    if (state.isRecording) {
      state.recognition.stop();
    } else {
      state.recognition.start();
    }
  }

  /* =========================================================
     THEME
     ========================================================= */

  function applyTheme() {
    document.documentElement.dataset.theme =
      state.settings.theme;

    document.body.classList.toggle(
      "light-theme",
      state.settings.theme ===
        "light"
    );
  }

  function toggleTheme() {
    state.settings.theme =
      state.settings.theme ===
      "dark"
        ? "light"
        : "dark";

    applyTheme();
    saveSettings();
  }

  /* =========================================================
     SETTINGS
     ========================================================= */

  function openSettings() {
    if (!els.settingsModal) return;

    els.settingsModal.classList.remove(
      "hidden"
    );
  }

  function closeSettings() {
    if (!els.settingsModal) return;

    els.settingsModal.classList.add(
      "hidden"
    );
  }

  function updateTemperature() {
    if (!els.temperature) return;

    const value =
      Number(
        els.temperature.value
      );

    state.settings.temperature =
      value;

    if (els.temperatureValue) {
      els.temperatureValue.textContent =
        value.toFixed(1);
    }

    saveSettings();
  }

  function updateModel() {
    if (!els.modelSelect) return;

    state.settings.model =
      els.modelSelect.value;

    saveSettings();
  }

  /* =========================================================
     INITIALIZE SETTINGS UI
     ========================================================= */

  function syncSettingsUI() {
    if (els.temperature) {
      els.temperature.value =
        state.settings.temperature;
    }

    if (els.temperatureValue) {
      els.temperatureValue.textContent =
        Number(
          state.settings.temperature
        ).toFixed(1);
    }

    if (els.modelSelect) {
      els.modelSelect.value =
        state.settings.model;
    }
  }

  /* =========================================================
     EVENT LISTENERS
     ========================================================= */

  function setupEvents() {
    on(
      els.loginForm,
      "submit",
      handleLogin
    );

    on(
      els.signupForm,
      "submit",
      handleSignup
    );

    on(
      els.logoutBtn,
      "click",
      logout
    );

    on(
      els.newChatBtn,
      "click",
      () => {
        createChat();
        showToast(
          "New chat created."
        );
      }
    );

    on(
      els.deleteChatBtn,
      "click",
      deleteActiveChat
    );

    on(
      els.clearHistoryBtn,
      "click",
      clearHistory
    );

    on(
      els.sendBtn,
      "click",
      sendMessage
    );

    on(
      els.stopBtn,
      "click",
      stopGeneration
    );

    on(
      els.attachBtn,
      "click",
      () => {
        els.fileInput?.click();
      }
    );

    on(
      els.fileInput,
      "change",
      (event) => {
        handleFiles(
          event.target.files
        );

        event.target.value = "";
      }
    );

    on(
      els.voiceBtn,
      "click",
      toggleVoice
    );

    on(
      els.micBtn,
      "click",
      toggleVoice
    );

    on(
      els.themeToggle,
      "click",
      toggleTheme
    );

    on(
      els.settingsBtn,
      "click",
      openSettings
    );

    on(
      els.closeSettings,
      "click",
      closeSettings
    );

    on(
      els.temperature,
      "input",
      updateTemperature
    );

    on(
      els.modelSelect,
      "change",
      updateModel
    );

    on(
      els.messageInput,
      "keydown",
      (event) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {
          event.preventDefault();
          sendMessage();
        }
      }
    );

    on(
      els.settingsModal,
      "click",
      (event) => {
        if (
          event.target ===
          els.settingsModal
        ) {
          closeSettings();
        }
      }
    );
  }

  /* =========================================================
     START APPLICATION
     ========================================================= */

  function init() {
    loadSettings();
    loadChats();
    loadUser();

    applyTheme();
    syncSettingsUI();

    setupEvents();
    setupVoiceRecognition();

    if (
      state.user
    ) {
      showApp();
    } else {
      showAuth();
    }

    if (
      state.chats.length &&
      !state.activeChatId
    ) {
      state.activeChatId =
        state.chats[0].id;
    }

    if (
      !state.chats.length &&
      state.user
    ) {
      createChat();
    }

    renderChatList();
    renderMessages();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
