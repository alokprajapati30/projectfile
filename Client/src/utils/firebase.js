// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "nexaai-5a819.firebaseapp.com",
    projectId: "nexaai-5a819",
    storageBucket: "nexaai-5a819.firebasestorage.app",
    messagingSenderId: "313651046996",
    appId: "1:313651046996:web:f264a71b65ebc20f099bc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth =getAuth(app)

const provider = new GoogleAuthProvider()


export{auth, provider}