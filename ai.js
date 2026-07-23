from pathlib import Path

js = r'''/* =========================================================
   SAEED AI — AI.JS V4.1 COMPLETE
   Frontend controller for AI.HTML V4.1 + AI.CSS V4.1
   ========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const on = (el, event, fn, options) => el && el.addEventListener(event, fn, options);

  const els = {
    authScreen: $("authScreen"),
    loginForm: $("loginForm"),
    signupForm: $("signupForm"),
    loginIdentifier: $("loginIdentifier"),
    loginPassword: $("loginPassword"),
    loginSubmitBtn: $("loginSubmitBtn"),
    signupName: $("signupName"),
    signupUsername: $("signupUsername"),
    signupEmail: $("signupEmail"),
    signupPassword: $("signupPassword"),
    signupSubmitBtn: $("signupSubmitBtn"),
    guestLoginBtn: $("guestLoginBtn"),
    showSignupBtn: $("showSignupBtn"),
    showLoginBtn: $("showLoginBtn"),
    toggleLoginPassword: $("toggleLoginPassword"),
    toggleSignupPassword: $("toggleSignupPassword"),

    mainAIApp: $("mainAIApp"),
    aiSidebar: $("aiSidebar"),
    mobileMenuOverlay: $("mobileMenuOverlay"),
    openSidebarBtn: $("openSidebarBtn"),
    closeSidebarBtn: $("closeSidebarBtn"),

    newChatBtn: $("newChatBtn"),
    chatHistoryList: $("chatHistoryList"),
    historySearchInput: $("historySearchInput"),
    clearHistoryBtn: $("clearHistoryBtn"),

    chatArea: $("chatArea"),
    chatContent: $("chatContent"),
    welcomeScreen: $("welcomeScreen"),
    suggestedPrompts: $("suggestedPrompts"),
    messagesContainer: $("messagesContainer"),
    typingIndicator: $("typingIndicator"),

    chatForm: $("chatForm"),
    chatInput: $("chatInput"),
    sendBtn: $("sendBtn"),
    clearInputBtn: $("clearInputBtn"),
    attachBtn: $("attachBtn"),
    fileInput: $("fileInput"),
    voiceBtn: $("voiceBtn"),
    attachmentPreview: $("attachmentPreview"),

    aiStatus: $("aiStatus"),
    liveClock: $("liveClock"),
    clockTime: $("clockTime"),
    clockDate: $("clockDate"),

    historyBtn: $("historyBtn"),
    historyOverlay: $("historyOverlay"),
    historyPanel: $("historyPanel"),
    closeHistoryBtn: $("closeHistoryBtn"),
    historyPanelSearch: $("historyPanelSearch"),
    historyPanelList: $("historyPanelList"),

    voiceRecordingPanel: $("voiceRecordingPanel"),
    voiceRecordingTime: $("voiceRecordingTime"),
    cancelVoiceBtn: $("cancelVoiceBtn"),
    stopVoiceBtn: $("stopVoiceBtn"),

    liveVoiceBtn: $("liveVoiceBtn"),
    liveVoicePanel: $("liveVoicePanel"),
    closeLiveVoiceBtn: $("closeLiveVoiceBtn"),
    startLiveVoiceBtn: $("startLiveVoiceBtn"),
    endLiveVoiceBtn: $("endLiveVoiceBtn"),
    liveVoiceMuteBtn: $("liveVoiceMuteBtn"),
    liveVoiceStatus: $("liveVoiceStatus"),

    settingsBtn: $("settingsBtn"),
    settingsModal: $("settingsModal"),
    closeSettingsBtn: $("closeSettingsBtn"),
    closeSettingsAction: $("closeSettingsAction"),
    themeToggle: $("themeToggle"),
    themeToggleBtn: $("themeToggleBtn"),
    sidebarThemeBtn: $("sidebarThemeBtn"),
    soundToggle: $("soundToggle"),
    settingsLanguage: $("settingsLanguage"),

    profileBtn: $("profileBtn"),
    topbarProfileBtn: $("topbarProfileBtn"),
    accountBtn: $("accountBtn"),
    profileMenu: $("profileMenu"),
    profileMenuBtn: $("profileMenuBtn"),
    signOutBtn: $("signOutBtn"),

    customerAvatar: $("customerAvatar"),
    customerName: $("customerName"),
    customerEmail: $("customerEmail"),
    topbarAvatar: $("topbarAvatar"),

    aiToastContainer: $("aiToastContainer"),
  };

  const STORAGE = {
    users: "saeed_ai_v41_users",
    session: "saeed_ai_v41_session",
    chats: "saeed_ai_v41_chats",
    settings: "saeed_ai_v41_settings",
    theme: "saeed_ai_v41_theme"
  };

  const state = {
    currentUser: null,
    currentChatId: null,
    chats: [],
    attachments: [],
    recognition: null,
    recording: false,
    recordingStartedAt: 0,
    recordingTimer: null,
    speechSynthesis: window.speechSynthesis || null,
    liveVoiceActive: false,
    liveVoiceMuted: false,
    currentRequest: null,
    isGenerating: false,
    settings: {
      theme: localStorage.getItem(STORAGE.theme) || "light",
      sound: true,
      language: "English"
    }
  };

  /* =========================================================
     STORAGE
  ========================================================= */

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadState() {
    state.settings = {
      ...state.settings,
      ...loadJSON(STORAGE.settings, {})
    };

    state.chats = loadJSON(STORAGE.chats, []);
    state.currentUser = loadJSON(STORAGE.session, null);
  }

  function saveSettings() {
    saveJSON(STORAGE.settings, state.settings);
    localStorage.setItem(STORAGE.theme, state.settings.theme);
  }

  function saveChats() {
    saveJSON(STORAGE.chats, state.chats);
  }

  /* =========================================================
     UTILITIES
  ========================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatText(text) {
    let safe = escapeHTML(text);

    safe = safe.replace(
      /```([\s\S]*?)```/g,
      '<pre><code>$1</code></pre>'
    );

    safe = safe.replace(
      /`([^`]+)`/g,
      "<code>$1</code>"
    );

    safe = safe.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    safe = safe.replace(
      /\*(.*?)\*/g,
      "<em>$1</em>"
    );

    safe = safe.replace(
      /\n/g,
      "<br>"
    );

    return safe;
  }

  function uid(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;
  }

  function now() {
    return new Date();
  }

  function timeString(date = now()) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function dateString(date = now()) {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }

  function fullDateString(date = now()) {
    return date.toISOString();
  }

  function showToast(message, type = "info") {
    if (!els.aiToastContainer) return;

    const toast = document.createElement("div");
    toast.className = `ai-toast ${type}`;

    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-exclamation",
      warning: "fa-triangle-exclamation",
      info: "fa-circle-info"
    };

    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info}"></i>
      <span>${escapeHTML(message)}</span>
    `;

    els.aiToastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 220);
    }, 3000);
  }

  function playNotification() {
    if (!state.settings.sound) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.frequency.value = 660;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.06,
        ctx.currentTime + 0.01
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + 0.12
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.13);
    } catch {}
  }

  /* =========================================================
     AUTH
  ========================================================= */

  function getUsers() {
    return loadJSON(STORAGE.users, []);
  }

  function saveUsers(users) {
    saveJSON(STORAGE.users, users);
  }

  function setAuthenticated(user) {
    state.currentUser = user;
    saveJSON(STORAGE.session, user);

    if (els.authScreen) els.authScreen.hidden = true;
    if (els.mainAIApp) els.mainAIApp.hidden = false;

    updateProfileUI();
    renderHistory();
    updateClock();

    if (!state.currentChatId) {
      createNewChat(false);
    } else {
      loadChat(state.currentChatId);
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE.session);
    state.currentUser = null;
    state.currentChatId = null;

    if (els.mainAIApp) els.mainAIApp.hidden = true;
    if (els.authScreen) els.authScreen.hidden = false;

    closeProfileMenu();
    showLoginForm();

    if (els.loginIdentifier) els.loginIdentifier.value = "";
    if (els.loginPassword) els.loginPassword.value = "";

    showToast("You have been signed out.", "success");
  }

  function showLoginForm() {
    if (els.loginForm) els.loginForm.classList.add("active");
    if (els.signupForm) els.signupForm.classList.remove("active");
  }

  function showSignupForm() {
    if (els.signupForm) els.signupForm.classList.add("active");
    if (els.loginForm) els.loginForm.classList.remove("active");
  }

  function updateProfileUI() {
    const user = state.currentUser;
    if (!user) return;

    const name =
      user.name ||
      user.username ||
      "Guest User";

    const email =
      user.email ||
      "Guest session";

    const letter =
      name.trim().charAt(0).toUpperCase() || "G";

    if (els.customerName)
      els.customerName.textContent = name;

    if (els.customerEmail)
      els.customerEmail.textContent = email;

    if (els.customerAvatar)
      els.customerAvatar.textContent = letter;

    if (els.topbarAvatar)
      els.topbarAvatar.textContent = letter;
  }

  on(els.showSignupBtn, "click", showSignupForm);
  on(els.showLoginBtn, "click", showLoginForm);

  on(els.guestLoginBtn, "click", () => {
    setAuthenticated({
      id: "guest",
      name: "Guest User",
      username: "guest",
      email: "Guest session",
      guest: true
    });

    showToast("Welcome to Saeed AI.", "success");
  });

  on(els.loginForm, "submit", (event) => {
    event.preventDefault();

    const identifier =
      els.loginIdentifier?.value.trim();

    const password =
      els.loginPassword?.value;

    if (!identifier || !password) {
      showToast(
        "Enter your username/email and password.",
        "warning"
      );
      return;
    }

    const users = getUsers();

    const user = users.find(
      (item) =>
        (
          item.username === identifier ||
          item.email === identifier
        ) &&
        item.password === password
    );

    if (!user) {
      showToast(
        "Invalid login details.",
        "error"
      );
      return;
    }

    setAuthenticated(user);
    showToast(
      `Welcome back, ${user.name || user.username}!`,
      "success"
    );
  });

  on(els.signupForm, "submit", (event) => {
    event.preventDefault();

    const name =
      els.signupName?.value.trim();

    const username =
      els.signupUsername?.value.trim();

    const email =
      els.signupEmail?.value.trim();

    const password =
      els.signupPassword?.value;

    if (!name || !username || !email || !password) {
      showToast(
        "Please complete all sign-up fields.",
        "warning"
      );
      return;
    }

    if (password.length < 6) {
      showToast(
        "Password must contain at least 6 characters.",
        "warning"
      );
      return;
    }

    const users = getUsers();

    if (
      users.some(
        (user) =>
          user.username === username ||
          user.email === email
      )
    ) {
      showToast(
        "Username or email already exists.",
        "error"
      );
      return;
    }

    const user = {
      id: uid("user"),
      name,
      username,
      email,
      password,
      createdAt: fullDateString()
    };

    users.push(user);
    saveUsers(users);

    setAuthenticated(user);

    showToast(
      "Account created successfully.",
      "success"
    );
  });

  function togglePassword(input) {
    if (!input) return;

    input.type =
      input.type === "password"
        ? "text"
        : "password";
  }

  on(
    els.toggleLoginPassword,
    "click",
    () => togglePassword(els.loginPassword)
  );

  on(
    els.toggleSignupPassword,
    "click",
    () => togglePassword(els.signupPassword)
  );

  /* =========================================================
     CLOCK
  ========================================================= */

  function updateClock() {
    const d = now();

    if (els.clockTime)
      els.clockTime.textContent =
        timeString(d);

    if (els.clockDate)
      els.clockDate.textContent =
        dateString(d);
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* =========================================================
     THEME
  ========================================================= */

  function applyTheme(theme) {
    state.settings.theme = theme;

    document.body.classList.toggle(
      "dark-mode",
      theme === "dark"
    );

    if (els.themeToggle)
      els.themeToggle.checked =
        theme === "dark";

    saveSettings();
  }

  function toggleTheme() {
    applyTheme(
      state.settings.theme === "dark"
        ? "light"
        : "dark"
    );
  }

  on(els.themeToggle, "change", (e) => {
    applyTheme(
      e.target.checked
        ? "dark"
        : "light"
    );
  });

  on(els.themeToggleBtn, "click", toggleTheme);
  on(els.sidebarThemeBtn, "click", toggleTheme);

  /* =========================================================
     SIDEBAR / MOBILE
  ========================================================= */

  function openSidebar() {
    els.aiSidebar?.classList.add("active");
    els.mobileMenuOverlay?.classList.add("active");
  }

  function closeSidebar() {
    els.aiSidebar?.classList.remove("active");
    els.mobileMenuOverlay?.classList.remove("active");
  }

  on(els.openSidebarBtn, "click", openSidebar);
  on(els.closeSidebarBtn, "click", closeSidebar);
  on(els.mobileMenuOverlay, "click", closeSidebar);

  /* =========================================================
     CHAT STORAGE
  ========================================================= */

  function userChats() {
    if (!state.currentUser) return [];

    const userId =
      state.currentUser.id;

    return state.chats.filter(
      (chat) =>
        chat.userId === userId
    );
  }

  function getChat(id) {
    return state.chats.find(
      (chat) =>
        chat.id === id &&
        chat.userId === state.currentUser?.id
    );
  }

  function createNewChat(render = true) {
    if (!state.currentUser) return;

    const chat = {
      id: uid("chat"),
      userId: state.currentUser.id,
      title: "New conversation",
      createdAt: fullDateString(),
      updatedAt: fullDateString(),
      messages: []
    };

    state.chats.unshift(chat);
    state.currentChatId = chat.id;

    saveChats();

    if (render) {
      clearMessages();
      renderHistory();
      showWelcome();
    }

    return chat;
  }

  function currentChat() {
    return getChat(
      state.currentChatId
    );
  }

  function clearMessages() {
    if (els.messagesContainer)
      els.messagesContainer.innerHTML = "";
  }

  function showWelcome() {
    if (els.welcomeScreen)
      els.welcomeScreen.hidden = false;
  }

  function hideWelcome() {
    if (els.welcomeScreen)
      els.welcomeScreen.hidden = true;
  }

  function saveCurrentChat() {
    saveChats();
    renderHistory();
  }

  function loadChat(chatId) {
    const chat = getChat(chatId);

    if (!chat) return;

    state.currentChatId = chat.id;

    clearMessages();

    if (!chat.messages.length) {
      showWelcome();
      return;
    }

    hideWelcome();

    chat.messages.forEach(
      (message) =>
        renderMessage(
          message,
          false
        )
    );

    scrollToBottom();
    renderHistory();
  }

  function newChat() {
    createNewChat(true);
    closeSidebar();
  }

  on(els.newChatBtn, "click", newChat);

  /* =========================================================
     MESSAGE RENDERING
  ========================================================= */

  function renderMessage(
    message,
    scroll = true
  ) {
    if (!els.messagesContainer)
      return;

    const wrapper =
      document.createElement("div");

    const isUser =
      message.role === "user";

    wrapper.className =
      `message ${
        isUser
          ? "user-message"
          : "ai-message"
      }`;

    const avatar =
      isUser
        ? (
          state.currentUser?.name
            ?.charAt(0)
            .toUpperCase() ||
          "U"
        )
        : "AI";

    let attachmentHTML = "";

    if (
      message.attachments &&
      message.attachments.length
    ) {
      attachmentHTML = `
        <div class="message-attachment">
          ${message.attachments
            .map(
              (file) =>
                file.type?.startsWith("image/")
                  ? `
                    <img
                      class="message-attachment-image"
                      src="${file.data}"
                      alt="${escapeHTML(file.name)}"
                    >
                  `
                  : `
                    <div class="attachment-file">
                      <i class="fa-solid fa-file attachment-file-icon"></i>
                      <span class="attachment-file-name">
                        ${escapeHTML(file.name)}
                      </span>
                    </div>
                  `
            )
            .join("")}
        </div>
      `;
    }

    const actions =
      !isUser
        ? `
          <div class="message-actions">
            <button
              class="message-action copy-message-btn"
              title="Copy"
            >
              <i class="fa-regular fa-copy"></i>
              Copy
            </button>

            <button
              class="message-action regenerate-btn"
              title="Regenerate"
            >
              <i class="fa-solid fa-rotate"></i>
              Regenerate
            </button>

            <button
              class="message-action like-btn"
              title="Helpful"
            >
              <i class="fa-regular fa-thumbs-up"></i>
            </button>

            <button
              class="message-action dislike-btn"
              title="Not helpful"
            >
              <i class="fa-regular fa-thumbs-down"></i>
            </button>
          </div>
        `
        : "";

    wrapper.innerHTML = `
      <div class="message-avatar">
        ${escapeHTML(avatar)}
      </div>

      <div class="message-body">

        <div class="message-meta">
          <strong class="message-author">
            ${
              isUser
                ? escapeHTML(
                    state.currentUser?.name ||
                    "You"
                  )
                : "Saeed AI"
            }
          </strong>

          <span class="message-time">
            ${escapeHTML(
              message.time ||
              timeString()
            )}
          </span>
        </div>

        <div class="${
          isUser
            ? "user-message-content"
            : "ai-message-content"
        } message-text">
          ${
            isUser
              ? formatText(message.content)
              : formatText(message.content)
          }
        </div>

        ${attachmentHTML}

        ${actions}

      </div>
    `;

    els.messagesContainer.appendChild(wrapper);

    const copyBtn =
      wrapper.querySelector(
        ".copy-message-btn"
      );

    const regenerateBtn =
      wrapper.querySelector(
        ".regenerate-btn"
      );

    const likeBtn =
      wrapper.querySelector(
        ".like-btn"
      );

    const dislikeBtn =
      wrapper.querySelector(
        ".dislike-btn"
      );

    on(copyBtn, "click", () => {
      navigator.clipboard
        ?.writeText(message.content)
        .then(() =>
          showToast(
            "Response copied.",
            "success"
          )
        )
        .catch(() =>
          showToast(
            "Could not copy response.",
            "error"
          )
        );
    });

    on(
      regenerateBtn,
      "click",
      () => regenerateMessage(message.id)
    );

    on(
      likeBtn,
      "click",
      () => {
        showToast(
          "Thanks for your feedback.",
          "success"
        );
      }
    );

    on(
      dislikeBtn,
      "click",
      () => {
        showToast(
          "Feedback recorded.",
          "success"
        );
      }
    );

    if (scroll)
      scrollToBottom();
  }

  function addMessage(
    role,
    content,
    attachments = []
  ) {
    const chat = currentChat();

    if (!chat) return null;

    const message = {
      id: uid("msg"),
      role,
      content,
      attachments,
      time: timeString(),
      createdAt: fullDateString()
    };

    chat.messages.push(message);

    chat.updatedAt =
      fullDateString();

    if (
      role === "user" &&
      chat.title === "New conversation"
    ) {
      chat.title =
        content
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 48) ||
        "New conversation";
    }

    saveCurrentChat();

    return message;
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (els.chatArea)
        els.chatArea.scrollTo({
          top: els.chatArea.scrollHeight,
          behavior: "smooth"
        });
    });
  }

  /* =========================================================
     HISTORY
  ========================================================= */

  function historyHTML(chats) {
    if (!chats.length) {
      return `
        <div class="empty-history-state">
          <i class="fa-regular fa-message"></i>
          <span>No conversations yet.</span>
        </div>
      `;
    }

    return chats
      .map(
        (chat) => `
          <button
            class="history-item ${
              chat.id === state.currentChatId
                ? "active"
                : ""
            }"
            data-chat-id="${chat.id}"
          >
            <span class="history-item-icon">
              <i class="fa-regular fa-message"></i>
            </span>

            <span class="history-item-content">
              <strong class="history-item-title">
                ${escapeHTML(chat.title)}
              </strong>

              <small class="history-item-date">
                ${escapeHTML(
                  new Date(
                    chat.updatedAt
                  ).toLocaleDateString()
                )}
              </small>
            </span>
          </button>
        `
      )
      .join("");
  }

  function renderHistory(query = "") {
    const chats =
      userChats()
        .filter(
          (chat) =>
            !query ||
            chat.title
              .toLowerCase()
              .includes(
                query.toLowerCase()
              )
        );

    if (els.chatHistoryList) {
      els.chatHistoryList.innerHTML =
        historyHTML(chats);

      $$(
        ".history-item",
        els.chatHistoryList
      ).forEach((item) =>
        on(
          item,
          "click",
          () => {
            loadChat(
              item.dataset.chatId
            );
            closeSidebar();
          }
        )
      );
    }

    if (els.historyPanelList) {
      els.historyPanelList.innerHTML =
        historyHTML(chats);

      $$(
        ".history-item",
        els.historyPanelList
      ).forEach((item) =>
        on(
          item,
          "click",
          () => {
            loadChat(
              item.dataset.chatId
            );
            closeHistory();
          }
        )
      );
    }
  }

  on(
    els.historySearchInput,
    "input",
    (e) =>
      renderHistory(e.target.value)
  );

  on(
    els.historyPanelSearch,
    "input",
    (e) =>
      renderHistory(e.target.value)
  );

  on(
    els.clearHistoryBtn,
    "click",
    () => {
      if (!state.currentUser) return;

      const confirmed =
        window.confirm(
          "Clear all your chat history?"
        );

      if (!confirmed) return;

      state.chats =
        state.chats.filter(
          (chat) =>
            chat.userId !==
            state.currentUser.id
        );

      saveChats();

      state.currentChatId = null;

      createNewChat(true);

      showToast(
        "Chat history cleared.",
        "success"
      );
    }
  );

  /* =========================================================
     HISTORY PANEL
  ========================================================= */

  function openHistory() {
    els.historyOverlay?.classList.add("active");
    els.historyPanel?.classList.add("active");
    renderHistory();
  }

  function closeHistory() {
    els.historyOverlay?.classList.remove("active");
    els.historyPanel?.classList.remove("active");
  }

  on(els.historyBtn, "click", openHistory);
  on(els.closeHistoryBtn, "click", closeHistory);
  on(els.historyOverlay, "click", closeHistory);

  /* =========================================================
     ATTACHMENTS
  ========================================================= */

  function renderAttachments() {
    if (!els.attachmentPreview)
      return;

    els.attachmentPreview.innerHTML =
      state.attachments
        .map(
          (file, index) => `
            <div class="attachment-item">

              ${
                file.type?.startsWith("image/")
                  ? `
                    <img
                      class="attachment-image"
                      src="${file.data}"
                      alt="${escapeHTML(file.name)}"
                    >
                  `
                  : `
                    <div class="attachment-file">
                      <i class="fa-solid fa-file attachment-file-icon"></i>
                      <span class="attachment-file-name">
                        ${escapeHTML(file.name)}
                      </span>
                    </div>
                  `
              }

              <button
                class="remove-attachment"
                data-index="${index}"
                type="button"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>

            </div>
          `
        )
        .join("");

    $$(".remove-attachment").forEach(
      (button) =>
        on(
          button,
          "click",
          () => {
            state.attachments.splice(
              Number(button.dataset.index),
              1
            );

            renderAttachments();
          }
        )
    );
  }

  on(els.attachBtn, "click", () => {
    els.fileInput?.click();
  });

  on(els.fileInput, "change", async (event) => {
    const files = [
      ...(event.target.files || [])
    ];

    for (const file of files) {
      if (
        state.attachments.length >= 5
      ) {
        showToast(
          "Maximum 5 attachments.",
          "warning"
        );
        break;
      }

      if (file.size > 10 * 1024 * 1024) {
        showToast(
          `${file.name} is larger than 10MB.`,
          "warning"
        );
        continue;
      }

      const data =
        await readFileAsDataURL(file);

      state.attachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        data
      });
    }

    renderAttachments();

    event.target.value = "";
  });

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader =
        new FileReader();

      reader.onload = () =>
        resolve(reader.result);

      reader.onerror = () =>
        resolve("");

      reader.readAsDataURL(file);
    });
  }

  /* =========================================================
     CHAT INPUT
  ========================================================= */

  function autoResizeInput() {
    if (!els.chatInput) return;

    els.chatInput.style.height =
      "auto";

    els.chatInput.style.height =
      Math.min(
        els.chatInput.scrollHeight,
        150
      ) + "px";
  }

  on(
    els.chatInput,
    "input",
    autoResizeInput
  );

  on(
    els.clearInputBtn,
    "click",
    () => {
      if (els.chatInput)
        els.chatInput.value = "";

      autoResizeInput();
      els.chatInput?.focus();
    }
  );

  on(
    els.suggestedPrompts,
    "click",
    (event) => {
      const prompt =
        event.target.closest(
          ".suggested-prompt"
        );

      if (!prompt) return;

      const text =
        prompt.dataset.prompt ||
        prompt
          .querySelector(
            ".suggested-prompt-content span"
          )
          ?.textContent ||
        "";

      if (!text) return;

      els.chatInput.value =
        text.trim();

      autoResizeInput();
      els.chatInput.focus();
    }
  );

  on(
    els.chatInput,
    "keydown",
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        els.chatForm?.requestSubmit();
      }
    }
  );

  /* =========================================================
     AI RESPONSE ENGINE
     Frontend fallback.
     Replace requestAI() with your secure backend endpoint
     when connecting a real AI model.
  ========================================================= */

  async function requestAI(
    prompt,
    context = [],
    attachments = []
  ) {
    /*
      REAL API EXAMPLE:

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          history: context,
          attachments
        })
      });

      if (!response.ok)
        throw new Error("AI request failed");

      const data = await response.json();

      return data.reply;
    */

    return localAIResponse(
      prompt,
      attachments
    );
  }

  function localAIResponse(
    prompt,
    attachments = []
  ) {
    const text =
      prompt.toLowerCase().trim();

    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("sannu")
    ) {
      return `Hello! 👋 I'm Saeed AI. How can I help you today?`;
    }

    if (
      text.includes("who are you") ||
      text.includes("what are you")
    ) {
      return `I'm Saeed AI, your AI assistant interface. I can help you with questions, learning, writing, coding, ideas, and more. 🤖`;
    }

    if (
      text.includes("time") ||
      text.includes("lokaci")
    ) {
      return `The current time is ${timeString()} and today is ${dateString()}.`;
    }

    if (
      text.includes("date") ||
      text.includes("kwanan wata")
    ) {
      return `Today is ${dateString()}.`;
    }

    if (
      text.includes("thank")
    ) {
      return `You're welcome! 😊`;
    }

    if (
      text.includes("help")
    ) {
      return `Sure! Tell me what you need help with. I can assist with learning, writing, coding, ideas, explanations, and more.`;
    }

    if (attachments.length) {
      return `I received ${attachments.length} attachment${
        attachments.length > 1 ? "s" : ""
      }. 📎

The frontend is ready to send these files to a real AI backend. Once the secure AI API is connected, I can analyze supported files and images directly.`;
    }

    return `I received your message:

"${prompt}"

The Saeed AI frontend is working correctly. 🚀

The next step is connecting this chat interface to a secure AI backend/API so I can generate real live AI answers instead of using the local fallback response.`;
  }

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  async function sendMessage() {
    const prompt =
      els.chatInput?.value.trim();

    if (
      !prompt &&
      !state.attachments.length
    ) {
      return;
    }

    if (state.isGenerating) {
      showToast(
        "AI is still generating a response.",
        "warning"
      );
      return;
    }

    if (!currentChat()) {
      createNewChat(false);
    }

    hideWelcome();

    const attachments =
      [...state.attachments];

    const userMessage =
      addMessage(
        "user",
        prompt ||
          "Please analyze the attached file.",
        attachments
      );

    renderMessage(
      userMessage
    );

    els.chatInput.value = "";
    state.attachments = [];

    renderAttachments();
    autoResizeInput();

    setGenerating(true);

    try {
      const chat =
        currentChat();

      const history =
        chat.messages
          .slice(-20)
          .map((message) => ({
            role: message.role,
            content: message.content
          }));

      const reply =
        await requestAI(
          prompt,
          history,
          attachments
        );

      if (!state.isGenerating)
        return;

      const aiMessage =
        addMessage(
          "assistant",
          reply
        );

      renderMessage(
        aiMessage
      );

      playNotification();

    } catch (error) {
      console.error(error);

      const errorMessage =
        addMessage(
          "assistant",
          "Sorry, something went wrong while processing your request."
        );

      renderMessage(
        errorMessage
      );

      showToast(
        "AI request failed.",
        "error"
      );
    } finally {
      setGenerating(false);
    }
  }

  on(
    els.chatForm,
    "submit",
    (event) => {
      event.preventDefault();
      sendMessage();
    }
  );

  function setGenerating(value) {
    state.isGenerating =
      Boolean(value);

    if (els.typingIndicator)
      els.typingIndicator.hidden =
        !value;

    if (els.sendBtn) {
      els.sendBtn.disabled =
        value;

      els.sendBtn.innerHTML =
        value
          ? '<i class="fa-solid fa-stop"></i>'
          : '<i class="fa-solid fa-paper-plane"></i>';
    }

    if (value)
      scrollToBottom();
  }

  on(
    els.sendBtn,
    "click",
    (event) => {
      if (!state.isGenerating)
        return;

      event.preventDefault();

      stopGeneration();
    }
  );

  function stopGeneration() {
    if (
      state.currentRequest &&
      typeof state.currentRequest.abort ===
        "function"
    ) {
      state.currentRequest.abort();
    }

    state.isGenerating = false;

    setGenerating(false);

    showToast(
      "Generation stopped.",
      "success"
    );
  }

  /* =========================================================
     REGENERATE
  ========================================================= */

  async function regenerateMessage(
    messageId
  ) {
    const chat =
      currentChat();

    if (!chat) return;

    const index =
      chat.messages.findIndex(
        (message) =>
          message.id === messageId
      );

    if (index < 0) return;

    const previousUser =
      [...chat.messages]
        .slice(0, index)
        .reverse()
        .find(
          (message) =>
            message.role === "user"
        );

    if (!previousUser) {
      showToast(
        "No user message found.",
        "warning"
      );
      return;
    }

    chat.messages =
      chat.messages.slice(
        0,
        index
      );

    saveChats();

    loadChat(chat.id);

    setGenerating(true);

    try {
      const reply =
        await requestAI(
          previousUser.content,
          chat.messages.slice(-20),
          previousUser.attachments || []
        );

      const aiMessage =
        addMessage(
          "assistant",
          reply
        );

      renderMessage(
        aiMessage
      );

    } finally {
      setGenerating(false);
    }
  }

  /* =========================================================
     VOICE RECOGNITION
  ========================================================= */

  function setupSpeechRecognition() {
    const Recognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!Recognition) {
      return null;
    }

    const recognition =
      new Recognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.lang =
      state.settings.language ===
      "Hausa"
        ? "ha-NG"
        : "en-US";

    recognition.onstart = () => {
      state.recording = true;

      if (
        els.voiceRecordingPanel
      )
        els.voiceRecordingPanel.classList.add(
          "active"
        );

      startRecordingTimer();

      showToast(
        "Listening...",
        "success"
      );
    };

    recognition.onresult =
      (event) => {
        let finalText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          if (
            event.results[i].isFinal
          ) {
            finalText +=
              event.results[i][0]
                .transcript;
          }
        }

        if (finalText) {
          els.chatInput.value +=
            (
              els.chatInput.value
                ? " "
                : ""
            ) +
            finalText.trim();

          autoResizeInput();
        }
      };

    recognition.onerror =
      (event) => {
        console.warn(
          "Speech recognition:",
          event.error
        );

        if (
          event.error ===
          "not-allowed"
        ) {
          showToast(
            "Microphone permission was denied.",
            "error"
          );
        }
      };

    recognition.onend = () => {
      if (state.recording) {
        try {
          recognition.start();
        } catch {}
      }
    };

    return recognition;
  }

  function startVoice() {
    if (!state.recognition)
      state.recognition =
        setupSpeechRecognition();

    if (!state.recognition) {
      showToast(
        "Voice recognition is not supported in this browser.",
        "warning"
      );
      return;
    }

    if (state.recording) return;

    try {
      state.recognition.start();
    } catch (error) {
      console.warn(error);
    }
  }

  function stopVoice() {
    state.recording = false;

    clearInterval(
      state.recordingTimer
    );

    try {
      state.recognition?.stop();
    } catch {}

    els.voiceRecordingPanel?.classList.remove(
      "active"
    );
  }

  function startRecordingTimer() {
    state.recordingStartedAt =
      Date.now();

    clearInterval(
      state.recordingTimer
    );

    state.recordingTimer =
      setInterval(() => {
        const seconds =
          Math.floor(
            (
              Date.now() -
              state.recordingStartedAt
            ) / 1000
          );

        const minutes =
          String(
            Math.floor(
              seconds / 60
            )
          ).padStart(2, "0");

        const remaining =
          String(
            seconds % 60
          ).padStart(2, "0");

        if (
          els.voiceRecordingTime
        ) {
          els.voiceRecordingTime.textContent =
            `${minutes}:${remaining}`;
        }
      }, 1000);
  }

  on(
    els.voiceBtn,
    "click",
    startVoice
  );

  on(
    els.cancelVoiceBtn,
    "click",
    stopVoice
  );

  on(
    els.stopVoiceBtn,
    "click",
    stopVoice
  );

  /* =========================================================
     LIVE VOICE
  ========================================================= */

  function openLiveVoice() {
    els.liveVoicePanel?.removeAttribute(
      "hidden"
    );

    state.liveVoiceActive = false;

    if (els.liveVoiceStatus)
      els.liveVoiceStatus.textContent =
        "Ready to start live voice";

    if (els.startLiveVoiceBtn)
      els.startLiveVoiceBtn.hidden =
        false;
  }

  function closeLiveVoice() {
    stopLiveVoice();

    els.liveVoicePanel?.setAttribute(
      "hidden",
      ""
    );
  }

  function startLiveVoice() {
    state.liveVoiceActive = true;

    if (els.liveVoiceStatus)
      els.liveVoiceStatus.textContent =
        "Listening...";

    if (els.startLiveVoiceBtn)
      els.startLiveVoiceBtn.hidden =
        true;

    startVoice();
  }

  function stopLiveVoice() {
    state.liveVoiceActive = false;

    stopVoice();

    if (els.liveVoiceStatus)
      els.liveVoiceStatus.textContent =
        "Live voice ended";

    if (els.startLiveVoiceBtn)
      els.startLiveVoiceBtn.hidden =
        false;
  }

  on(
    els.liveVoiceBtn,
    "click",
    openLiveVoice
  );

  on(
    els.closeLiveVoiceBtn,
    "click",
    closeLiveVoice
  );

  on(
    els.startLiveVoiceBtn,
    "click",
    startLiveVoice
  );

  on(
    els.endLiveVoiceBtn,
    "click",
    closeLiveVoice
  );

  on(
    els.liveVoiceMuteBtn,
    "click",
    () => {
      state.liveVoiceMuted =
        !state.liveVoiceMuted;

      els.liveVoiceMuteBtn.innerHTML =
        state.liveVoiceMuted
          ? '<i class="fa-solid fa-microphone-slash"></i>'
          : '<i class="fa-solid fa-microphone"></i>';

      showToast(
        state.liveVoiceMuted
          ? "Microphone muted."
          : "Microphone unmuted.",
        "success"
      );
    }
  );

  /* =========================================================
     SETTINGS
  ========================================================= */

  function openSettings() {
    els.settingsModal?.removeAttribute(
      "hidden"
    );

    if (els.themeToggle)
      els.themeToggle.checked =
        state.settings.theme ===
        "dark";

    if (els.soundToggle)
      els.soundToggle.checked =
        state.settings.sound;

    if (els.settingsLanguage)
      els.settingsLanguage.value =
        state.settings.language;
  }

  function closeSettings() {
    els.settingsModal?.setAttribute(
      "hidden",
      ""
    );
  }

  on(
    els.settingsBtn,
    "click",
    openSettings
  );

  on(
    els.closeSettingsBtn,
    "click",
    closeSettings
  );

  on(
    els.closeSettingsAction,
    "click",
    closeSettings
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

  on(
    els.soundToggle,
    "change",
    (event) => {
      state.settings.sound =
        event.target.checked;

      saveSettings();
    }
  );

  on(
    els.settingsLanguage,
    "change",
    (event) => {
      state.settings.language =
        event.target.value;

      saveSettings();

      if (state.recognition) {
        state.recognition.lang =
          event.target.value ===
          "Hausa"
            ? "ha-NG"
            : "en-US";
      }
    }
  );

  /* =========================================================
     PROFILE MENU
  ========================================================= */

  function openProfileMenu() {
    els.profileMenu?.removeAttribute(
      "hidden"
    );
  }

  function closeProfileMenu() {
    els.profileMenu?.setAttribute(
      "hidden",
      ""
    );
  }

  function toggleProfileMenu() {
    if (
      els.profileMenu?.hasAttribute(
        "hidden"
      )
    ) {
      openProfileMenu();
    } else {
      closeProfileMenu();
    }
  }

  on(
    els.profileBtn,
    "click",
    toggleProfileMenu
  );

  on(
    els.topbarProfileBtn,
    "click",
    toggleProfileMenu
  );

  on(
    els.accountBtn,
    "click",
    toggleProfileMenu
  );

  on(
    els.profileMenuBtn,
    "click",
    toggleProfileMenu
  );

  on(
    els.signOutBtn,
    "click",
    logout
  );

  document.addEventListener(
    "click",
    (event) => {
      if (
        els.profileMenu &&
        !els.profileMenu.contains(
          event.target
        ) &&
        !els.profileBtn?.contains(
          event.target
        ) &&
        !els.topbarProfileBtn?.contains(
          event.target
        )
      ) {
        closeProfileMenu();
      }
    }
  );

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  function init() {
    loadState();

    applyTheme(
      state.settings.theme
    );

    if (
      els.soundToggle
    ) {
      els.soundToggle.checked =
        state.settings.sound;
    }

    if (
      els.settingsLanguage
    ) {
      els.settingsLanguage.value =
        state.settings.language;
    }

    if (state.currentUser) {
      if (els.authScreen)
        els.authScreen.hidden = true;

      if (els.mainAIApp)
        els.mainAIApp.hidden = false;

      updateProfileUI();
      renderHistory();

      const chats =
        userChats();

      if (chats.length) {
        state.currentChatId =
          chats[0].id;

        loadChat(
          state.currentChatId
        );
      } else {
        createNewChat(true);
      }
    } else {
      if (els.authScreen)
        els.authScreen.hidden = false;

      if (els.mainAIApp)
        els.mainAIApp.hidden = true;

      showLoginForm();
    }

    updateClock();
  }

  init();

})();
'''

path = "/mnt/data/AI.JS_V4.1_COMPLETE.js"
Path(path).write_text(js, encoding="utf-8")
print(path)
