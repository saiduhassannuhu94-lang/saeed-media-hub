import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7YJxM8Q9xN3vK2L1p0QwErTyUiOpAsDf",
  authDomain: "saeedhub-web.firebaseapp.com",
  projectId: "saeedhub-web",
  storageBucket: "saeedhub-web.firebasestorage.app",
  messagingSenderId: "104728395611",
  appId: "1:104728395611:web:7d9c2f6e8a4b1c3d5e6f70"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {
  app,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};
