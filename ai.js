/*

SAEED AI — AI.JS V5.0
Saeed Media Hub
Clean Frontend Version

Features:

- Login
- Sign Up
- Logout
- Local account storage
- Auto login
- Welcome screen
- Chat interface
- Suggestion buttons
- Typing animation
- Backend-ready AI request
  ====================================================
  */

"use strict";

/* ==================================================
STORAGE KEYS
================================================== */

const USERS_KEY = "saeed_ai_users";
const SESSION_KEY = "saeed_ai_session";

/* ==================================================
DOM ELEMENTS
================================================== */

// Authentication
const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const authMessage = document.getElementById("authMessage");

// Login fields
const loginIdentifier = document.getElementById("loginIdentifier");
const loginPassword = document.getElementById("loginPassword");

// Signup fields
const signupName = document.getElementById("signupName");
const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

// App
const logoutBtn = document.getElementById("logoutBtn");

const welcomeScreen = document.getElementById("welcomeScreen");
const chatScreen = document.getElementById("chatScreen");

const messages = document.getElementById("messages");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const suggestionButtons = document.querySelectorAll(".suggestion");

/* ==================================================
INITIALIZATION
================================================== */

document.addEventListener("DOMContentLoaded", () => {

console.log("Saeed AI V5.0 loaded successfully.");

initializeTabs();
initializeAuthentication();
initializeChat();
initializeSuggestions();
initializeTextarea();

checkExistingSession();

});

/* ==================================================
AUTH TABS
================================================== */

function initializeTabs() {

if (!loginTab || !signupTab) return;

loginTab.addEventListener("click", () => {

loginTab.classList.add("active");
signupTab.classList.remove("active");

loginForm.classList.remove("hidden");
signupForm.classList.add("hidden");

clearAuthMessage();

});

signupTab.addEventListener("click", () => {

signupTab.classList.add("active");
loginTab.classList.remove("active");

signupForm.classList.remove("hidden");
loginForm.classList.add("hidden");

clearAuthMessage();

});

}

/* ==================================================
AUTHENTICATION
================================================== */

function initializeAuthentication() {

if (loginForm) {

loginForm.addEventListener("submit", handleLogin);

}

if (signupForm) {

signupForm.addEventListener("submit", handleSignup);

}

if (logoutBtn) {

logoutBtn.addEventListener("click", handleLogout);

}

}

/* ==================================================
SIGN UP
================================================== */

function handleSignup(event) {

event.preventDefault();

clearAuthMessage();

const name = signupName.value.trim();
const username = signupUsername.value.trim();
const email = signupEmail.value.trim().toLowerCase();
const password = signupPassword.value;

// Validation

if (!name || !username || !email || !password) {

showAuthMessage(
  "Please fill in all fields.",
  "error"
);

return;

}

if (password.length < 6) {

showAuthMessage(
  "Password must contain at least 6 characters.",
  "error"
);

return;

}

const users = getUsers();

// Check username

const usernameExists = users.some(
user =>
user.username.toLowerCase() === username.toLowerCase()
);

if (usernameExists) {

showAuthMessage(
  "This username is already registered.",
  "error"
);

return;

}

// Check email

const emailExists = users.some(
user =>
user.email.toLowerCase() === email.toLowerCase()
);

if (emailExists) {

showAuthMessage(
  "This email is already registered.",
  "error"
);

return;

}

// Create user

const newUser = {

id: generateUserId(),

name,

username,

email,

password,

createdAt: new Date().toISOString()

};

users.push(newUser);

saveUsers(users);

showAuthMessage(
"Account created successfully. You can now login.",
"success"
);

// Clear signup form

signupForm.reset();

// Switch to login

setTimeout(() => {

loginTab.click();

loginIdentifier.value = email;

}, 900);

}

/* ==================================================
LOGIN
================================================== */

function handleLogin(event) {

event.preventDefault();

clearAuthMessage();

const identifier =
loginIdentifier.value.trim().toLowerCase();

const password =
loginPassword.value;

if (!identifier || !password) {

showAuthMessage(
  "Please enter your login details.",
  "error"
);

return;

}

const users = getUsers();

const user = users.find(
account =>

  (
    account.email.toLowerCase() === identifier ||

    account.username.toLowerCase() === identifier
  )

  &&

  account.password === password

);

if (!user) {

showAuthMessage(
  "Incorrect username/email or password.",
  "error"
);

return;

}

// Save session

saveSession(user);

// Reset login

loginForm.reset();

// Open application

openApp(user);

}

/* ==================================================
LOGOUT
================================================== */

function handleLogout() {

const confirmed =
confirm("Are you sure you want to logout?");

if (!confirmed) return;

localStorage.removeItem(SESSION_KEY);

// Clear chat

if (messages) {

messages.innerHTML = "";

}

// Hide app

appScreen.classList.add("hidden");

// Show auth

authScreen.classList.remove("hidden");

// Reset login tab

loginTab.click();

}

/* ==================================================
SESSION CHECK
================================================== */

function checkExistingSession() {

const session = getSession();

if (session) {

openApp(session);

} else {

showAuthScreen();

}

}

/* ==================================================
OPEN APP
================================================== */

function openApp(user) {

authScreen.classList.add("hidden");

appScreen.classList.remove("hidden");

// Welcome screen visible immediately

welcomeScreen.classList.remove("hidden");

chatScreen.classList.add("hidden");

console.log(
"Welcome ${user.name} to Saeed AI."
);

}

/* ==================================================
SHOW AUTH
================================================== */

function showAuthScreen() {

authScreen.classList.remove("hidden");

appScreen.classList.add("hidden");

}

/* ==================================================
CHAT INITIALIZATION
================================================== */

function initializeChat() {

if (!sendBtn || !messageInput) return;

sendBtn.addEventListener(
"click",
sendMessage
);

messageInput.addEventListener(
"keydown",
event => {

  // Enter = send
  // Shift + Enter = new line

  if (
    event.key === "Enter"
    &&
    !event.shiftKey
  ) {

    event.preventDefault();

    sendMessage();

  }

}

);

}

/* ==================================================
SUGGESTIONS
================================================== */

function initializeSuggestions() {

suggestionButtons.forEach(button => {

button.addEventListener(
  "click",
  () => {

    const text =
      button.textContent.trim();


    messageInput.value = text;


    sendMessage();

  }
);

});

}

/* ==================================================
SEND MESSAGE
================================================== */

async function sendMessage() {

if (!messageInput) return;

const text =
messageInput.value.trim();

if (!text) return;

// Open chat screen

welcomeScreen.classList.add("hidden");

chatScreen.classList.remove("hidden");

// Add user message

addMessage(
text,
"user"
);

// Clear input

messageInput.value = "";

autoResizeTextarea();

// Disable send button

sendBtn.disabled = true;

// Show typing

const typingElement =
showTyping();

try {

/*
================================================
TRY REAL AI BACKEND
================================================
*/

const response =
  await requestAI(text);


removeTyping(typingElement);


addMessage(
  response,
  "ai"
);

} catch (error) {

console.error(
  "AI request failed:",
  error
);


removeTyping(typingElement);


// Fallback response

addMessage(
  localAIResponse(text),
  "ai"
);

}

sendBtn.disabled = false;

messageInput.focus();

}

/* ==================================================
REAL AI BACKEND REQUEST
================================================== */

async function requestAI(message) {

/*
IMPORTANT:

This frontend is ready to connect to:

/api/chat

We will create the Vercel backend in the next step.

DO NOT put your OpenAI API key inside this file.
*/

const response = await fetch(
"/api/chat",
{

  method: "POST",

  headers: {

    "Content-Type":
      "application/json"

  },

  body: JSON.stringify({

    message

  })

}

);

if (!response.ok) {

throw new Error(
  `AI server error: ${response.status}`
);

}

const data =
await response.json();

if (
!data ||
!data.reply
) {

throw new Error(
  "Invalid AI server response."
);

}

return data.reply;

}

/* ==================================================
LOCAL FALLBACK AI
================================================== */

function localAIResponse(message) {

const text =
message.toLowerCase();

if (
text.includes("hello") ||
text.includes("hi") ||
text.includes("sannu")
) {

return `

Sannu! 👋

Ni ne Saeed AI, mataimakinka na Artificial Intelligence daga Saeed Media Hub.

Yaya zan taimaka maka yau?
`.trim();

}

if (
text.includes("artificial intelligence") ||
text.includes("what is ai") ||
text.includes("menene ai")
) {

return `

Artificial Intelligence (AI) wata fasaha ce da ke bai wa kwamfuta ko na'ura damar yin wasu ayyuka cikin basira, kamar koyo, fahimta, nazari, da taimakawa wajen yanke shawara.

Idan kana so, zan iya bayyana maka AI cikin Hausa mai sauƙi. 🤖
`.trim();

}

if (
text.includes("business") ||
text.includes("kasuwanci")
) {

return `

Akwai hanyoyi da dama na amfani da AI wajen kasuwanci.

Misali:
• Social media content
• Graphic design
• Video editing
• Website development
• Customer support
• Digital marketing

Zan iya taimaka maka ka tsara business idea daga farko har zuwa implementation.
`.trim();

}

if (
text.includes("saeed media hub")
) {

return `

Saeed Media Hub wani digital media da technology brand ne da ke mai da hankali kan creativity, AI, digital skills, content creation, da modern technology.

🚀 Learn.
🎨 Create.
🤖 Innovate.
`.trim();

}

return `
Na karɓi saƙonka:

"${message}"

A halin yanzu ina cikin frontend test mode.

Real AI connection zai fara aiki da zarar mun haɗa Vercel backend ɗinka da AI API.

🚀 Saeed AI — Saeed Media Hub
`.trim();

}

/* ==================================================
ADD MESSAGE
================================================== */

function addMessage(
text,
sender
) {

if (!messages) return;

const message =
document.createElement("div");

message.className =
"message ${sender}";

const bubble =
document.createElement("div");

bubble.className =
"bubble";

bubble.textContent =
text;

message.appendChild(
bubble
);

messages.appendChild(
message
);

scrollToBottom();

}

/* ==================================================
TYPING INDICATOR
================================================== */

function showTyping() {

const message =
document.createElement("div");

message.className =
"message ai";

message.innerHTML = `

<div class="bubble">

  <div class="typing">

    <span></span>
    <span></span>
    <span></span>

  </div>

</div>

`;

messages.appendChild(
message
);

scrollToBottom();

return message;

}

function removeTyping(element) {

if (
element &&
element.parentNode
) {

element.remove();

}

}

/* ==================================================
SCROLL CHAT
================================================== */

function scrollToBottom() {

if (!messages) return;

setTimeout(() => {

messages.scrollTop =
  messages.scrollHeight;

}, 50);

}

/* ==================================================
TEXTAREA AUTO RESIZE
================================================== */

function initializeTextarea() {

if (!messageInput) return;

messageInput.addEventListener(
"input",
autoResizeTextarea
);

}

function autoResizeTextarea() {

if (!messageInput) return;

messageInput.style.height =
"auto";

messageInput.style.height =
Math.min(
messageInput.scrollHeight,
140
) + "px";

}

/* ==================================================
USERS STORAGE
================================================== */

function getUsers() {

try {

const data =
  localStorage.getItem(
    USERS_KEY
  );


if (!data) return [];


const users =
  JSON.parse(data);


return Array.isArray(users)
  ? users
  : [];

} catch (error) {

console.error(
  "Unable to read users:",
  error
);


return [];

}

}

function saveUsers(users) {

localStorage.setItem(

USERS_KEY,

JSON.stringify(users)

);

}

/* ==================================================
SESSION STORAGE
================================================== */

function getSession() {

try {

const data =
  localStorage.getItem(
    SESSION_KEY
  );


if (!data) return null;


return JSON.parse(data);

} catch (error) {

console.error(
  "Unable to read session:",
  error
);


return null;

}

}

function saveSession(user) {

const session = {

id: user.id,

name: user.name,

username: user.username,

email: user.email

};

localStorage.setItem(

SESSION_KEY,

JSON.stringify(session)

);

}

/* ==================================================
USER ID
================================================== */

function generateUserId() {

return (

"user_" +

Date.now().toString(36) +

"_" +

Math.random()
  .toString(36)
  .substring(2, 9)

);

}

/* ==================================================
AUTH MESSAGES
================================================== */

function showAuthMessage(
message,
type
) {

if (!authMessage) return;

authMessage.textContent =
message;

authMessage.className =
"auth-message ${type}";

}

function clearAuthMessage() {

if (!authMessage) return;

authMessage.textContent =
"";

authMessage.className =
"auth-message";

}

/* ==================================================
DEBUG
================================================== */

console.log(
"Saeed AI V5.0 — JavaScript initialized."
);
