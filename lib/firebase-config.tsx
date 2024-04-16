// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEhPStwd2TZ2H1mC9CvhxX-doP0GznQxc",
  authDomain: "wallpaper-app-c21a8.firebaseapp.com",
  projectId: "wallpaper-app-c21a8",
  storageBucket: "wallpaper-app-c21a8.appspot.com",
  messagingSenderId: "812058574792",
  appId: "1:812058574792:web:ed0218a3cbbe56485e4afd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()