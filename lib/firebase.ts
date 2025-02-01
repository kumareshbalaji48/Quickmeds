import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBkqlKz9XM3uagg4tVKLq3d6skyyPL1Frw",
    authDomain: "quickmeds-edc5e.firebaseapp.com",
    projectId: "quickmeds-edc5e",
    storageBucket: "quickmeds-edc5e.appspot.com",
    messagingSenderId: "171966778368",
    appId: "1:171966778368:web:YOUR_WEB_APP_ID_HERE",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }

