import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBm67RjL0QzMRLfo6zUYCI0bak1eGJAR-U",
  authDomain: "oasis-facturacion.firebaseapp.com",
  projectId: "oasis-facturacion",
  storageBucket: "oasis-facturacion.firebasestorage.app",
  messagingSenderId: "84422038905",
  appId: "1:84422038905:web:b0eef65217d2bfc3298ba8"
};

const APP_URL = "https://invoicing.nexustoolspr.com/";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);

function setStatus(message, type = "info") {
  const box = $("formStatus");
  if (!box) return;
  box.className = `form-status ${type}`;
  box.textContent = message;
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").trim();
}

async function handleLeadSubmit(e) {
  e.preventDefault();

  const submitBtn = $("submitBtn");
  const fullName = $("fullName")?.value.trim();
  const businessName = $("businessName")?.value.trim();
  const email = $("email")?.value.trim().toLowerCase();
  const phone = normalizePhone($("phone")?.value);
  const industry = $("industry")?.value || "";
  const volume = $("volume")?.value || "";
  const notes = $("notes")?.value.trim() || "";
  const acceptTerms = $("acceptTerms")?.checked;

  if (!fullName || !businessName || !email || !phone || !industry || !volume || !acceptTerms) {
    setStatus("Completa todos los campos requeridos antes de continuar.", "err");
    return;
  }

  try {
    submitBtn.disabled = true;
    setStatus("Registrando acceso...", "info");

    await addDoc(collection(db, "nexus_invoicing_leads"), {
      fullName,
      businessName,
      email,
      phone,
      industry,
      volume,
      notes,
      source: "landing_page",
      status: "registered",
      appTarget: APP_URL,
      createdAt: serverTimestamp()
    });

    setStatus("Registro completado. Te estamos enviando al sistema.", "ok");
    e.target.reset();

    setTimeout(() => {
      window.location.href = APP_URL;
    }, 1200);
  } catch (error) {
    console.error("Lead submit error:", error);
    setStatus("No se pudo completar el registro. Intenta nuevamente.", "err");
  } finally {
    submitBtn.disabled = false;
  }
}

function boot() {
  $("leadForm")?.addEventListener("submit", handleLeadSubmit);
}

document.addEventListener("DOMContentLoaded", boot);
