import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

/* 🔥 YOUR FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_KEY",
  authDomain: "PASTE.firebaseapp.com",
  projectId: "PASTE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* GAME CONFIG */
const TARGETS = [2000000, 4000000, 6000000];
let points = 0;
let level = 0;
let lastTap = 0;
let uid = null;

/* ELEMENTS */
const authBox = document.getElementById("authBox");
const gameBox = document.getElementById("gameBox");
const pointsEl = document.getElementById("points");
const targetEl = document.getElementById("target");
const logoutBtn = document.getElementById("logoutBtn");

/* AUTH */
loginBtn.onclick = () =>
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(e => alert(e.message));

registerBtn.onclick = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .catch(e => alert(e.message));

logoutBtn.onclick = () => signOut(auth);

/* AUTH STATE */
onAuthStateChanged(auth, async user => {
  if (!user) {
    authBox.classList.remove("hidden");
    gameBox.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    return;
  }

  uid = user.uid;
  authBox.classList.add("hidden");
  gameBox.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { points: 0, level: 0 });
  }

  const data = (await getDoc(ref)).data();
  points = data.points;
  level = data.level;

  updateUI();
});

/* GAME */
tapCircle.onclick = async () => {
  const now = Date.now();
  if (now - lastTap < 300) return; // anti-cheat
  lastTap = now;

  points++;

  if (points >= TARGETS[level] && level < TARGETS.length - 1) {
    level++;
  }

  updateUI();
  await updateDoc(doc(db, "users", uid), { points, level });
};

function updateUI() {
  pointsEl.innerText = points.toLocaleString();
  targetEl.innerText = TARGETS[level].toLocaleString();
}
