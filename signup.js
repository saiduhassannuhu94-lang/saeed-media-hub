import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "./auth.js";

const signupForm = document.getElementById("signupForm");
const signupButton = document.getElementById("signupButton");
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

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const confirmPassword =
    document.getElementById("confirmPassword")?.value;

  if (!name || !email || !password || !confirmPassword) {
    showMessage("Please fill in all fields.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.");
    return;
  }

  signupButton.disabled = true;
  signupButton.textContent = "Creating Account...";
  showMessage("");

  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name
    });

    showMessage(
      "Account created successfully. Redirecting...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "ai.html";
    }, 700);

  } catch (error) {
    console.error("Signup error:", error);

    let errorMessage =
      "Unable to create account. Please try again.";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage =
          "An account with this email already exists.";
        break;

      case "auth/invalid-email":
        errorMessage =
          "Please enter a valid email address.";
        break;

      case "auth/weak-password":
        errorMessage =
          "Password is too weak. Use at least 6 characters.";
        break;

      case "auth/network-request-failed":
        errorMessage =
          "Network error. Check your internet connection.";
        break;

      default:
        errorMessage =
          error.message || errorMessage;
    }

    showMessage(errorMessage);

  } finally {
    signupButton.disabled = false;
    signupButton.textContent = "Create Account";
  }
});
