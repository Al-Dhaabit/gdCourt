import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBXP9qB0ljXIr6WMvnuiC5jmS0o8v1Odno",
    authDomain: "the-gdcourt.firebaseapp.com",
    projectId: "the-gdcourt",
    storageBucket: "the-gdcourt.firebasestorage.app",
    messagingSenderId: "791723003326",
    appId: "1:791723003326:web:5cd6ec8bccc8e10b947def"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
