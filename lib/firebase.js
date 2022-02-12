import {
    initializeApp,
    getApps
} from 'firebase/app';
import {
    getFirestore
} from 'firebase/firestore';

export const firebase = getApps().length === 0 ? initializeApp({
    apiKey: "AIzaSyAbDsVY54yxupvD_87rqqkw2U6dOz3TjfA",
    authDomain: "inventory-app-32023.firebaseapp.com",
    projectId: "inventory-app-32023",
    storageBucket: "inventory-app-32023.appspot.com",
    messagingSenderId: "976750260407",
    appId: "1:976750260407:web:9034e0acfe1e3e2eb1dd32",
    measurementId: "G-12TNBY7RFB"
}) : getApps()[0];

export const firestore = getFirestore(firebase);