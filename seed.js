import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// --- KEEP YOUR EXISTING CONFIG HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyBPi1vwaAuYD01YZBU5xO2E7-OcD20cnaY",
  authDomain: "careroute-77f0c.firebaseapp.com",
  projectId: "careroute-77f0c",
  storageBucket: "careroute-77f0c.firebasestorage.app",
  messagingSenderId: "91647910264",
  appId: "1:91647910264:web:3b915a242ef8031168288d",
  measurementId: "G-2WY52NBT3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data pools for variety
const firstNames = ["Amit", "Priya", "Vikram", "Suman", "Rohan", "Anjali", "Karan", "Meena", "Sanjay", "Neha"];
const lastNames = ["Kumar", "Das", "Singh", "Lata", "Jha", "Gupta", "Verma", "Rai", "Gill", "Sharma"];
const conditions = ["fever", "malaria", "cough", "tb"];

function generatePatient() {
  const name =
    firstNames[Math.floor(Math.random() * firstNames.length)] +
    " " +
    lastNames[Math.floor(Math.random() * lastNames.length)];

  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    name,
    condition,
    chwId: "chw_001", // Locked to your 6th ASHA
    regionId: "A6",   // Locked to Region A6
    lastVisitDays: 11,
    visited: false,
    lat: 20.94 + Math.random() * 0.01,
    lng: 75.57 + Math.random() * 0.01,
    notes: "Needs follow-up",
    flaggedByANM: false,
    // Premium UI placeholders
    aiChecklist: ["Verify temperature", "Check hydration", "Medication adherence"],
    aiReport: "Pending supervisor review for new batch.",
    voiceNote: ""
  };
}

async function seed() {
  console.log("🚀 Seeding 10 new patients for Region A6...");

  try {
    for (let i = 0; i < 10; i++) {
      const patient = generatePatient();
      await addDoc(collection(db, "patients"), patient);
      console.log(`✅ Added: ${patient.name}`);
    }
    console.log("⭐ Done! Your Region A6 is now populated.");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

seed();