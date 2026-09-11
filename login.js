import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "./auth.js";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

function showMessage(text, type = "error") {
  if (!message) return;

  message.textContent = text;
  message.className = `message ${type}`;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "ai.html";
  }
});

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";
  showMessage("");

  try {
    await signInWithEmailAndPassword(auth, email, password);

    showMessage("Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "ai.html";
    }, 500);

  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "Unable to login. Please try again.";

    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        errorMessage = "Incorrect email or password.";
        break;

      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address.";
        break;

      case "auth/too-many-requests":
        errorMessage = "Too many attempts. Please try again later.";
        break;

      case "auth/network-request-failed":
        errorMessage = "Network error. Check your internet connection.";
        break;

      default:
        errorMessage = error.message || errorMessage;
    }

    showMessage(errorMessage);

  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});
