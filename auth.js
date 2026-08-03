import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGYWh-DhHxxqjraERkL_2-wBOvUW0wuN0",
  authDomain: "saeedhub-web.firebaseapp.com",
  projectId: "saeedhub-web",
  storageBucket: "saeedhub-web.firebasestorage.app",
  messagingSenderId: "732790430829",
  appId: "1:732790430829:web:24fd7335c9ab485a9cf364"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Make auth available globally
window.auth = auth;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
