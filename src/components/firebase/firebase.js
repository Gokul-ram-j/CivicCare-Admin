// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// for  firestore
const firebaseFirestoreConfig = {
  apiKey: "AIzaSyCF7H1mfq_lCPwQbIQKKeJeeGd2k6Kp4XE",
  authDomain: "civiccare-ccd46.firebaseapp.com",
  projectId: "civiccare-ccd46",
  storageBucket: "civiccare-ccd46.firebasestorage.app",
  messagingSenderId: "586004359676",
  appId: "1:586004359676:web:1d5ef42de37677c80b6a79",
};

// for authentication
const firebaseAuthConfig = {
  apiKey: "AIzaSyAOuxNPJd-_soblzQf8SGJWXEJa1cWbp9k",
  authDomain: "civiccare-admin.firebaseapp.com",
  projectId: "civiccare-admin",
  storageBucket: "civiccare-admin.firebasestorage.app",
  messagingSenderId: "836231621719",
  appId: "1:836231621719:web:97428f2b1811d4bee00712"
};

// Initialize Firebase App for Auth (default app)
const authApp = getApps().length === 0 ? initializeApp(firebaseAuthConfig) : getApp();
const auth = getAuth(authApp);

// Initialize Firebase App for Firestore (named app)
const firestoreApp = getApps().find(app => app.name === "firestoreApp") 
  || initializeApp(firebaseFirestoreConfig, "firestoreApp");

const firestore = getFirestore(firestoreApp);

export { auth, firestore };