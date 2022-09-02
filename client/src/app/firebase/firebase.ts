// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbNrg0frOVEwgwTo7NuPMMpUYLL2Jtrlc",
  authDomain: "store-49aaa.firebaseapp.com",
  projectId: "store-49aaa",
  storageBucket: "store-49aaa.appspot.com",
  messagingSenderId: "544027462885",
  appId: "1:544027462885:web:cfa097dde145aec6d0d80c"
};

export const logOut = () => {
    signOut(auth);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);