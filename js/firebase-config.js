import { initializeApp }
    from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, enableIndexedDbPersistence }
    from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
    from "firebase/auth";

const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

enableIndexedDbPersistence(db).catch(e => {
    if (e.code === 'failed-precondition') console.warn('Firebase: múltiplas abas abertas, offline desativado.');
    if (e.code === 'unimplemented')       console.warn('Firebase: persistência offline não suportada neste browser.');
});

// Expõe API mínima para os scripts não-módulo
window._auth            = auth;
window._serverTimestamp = serverTimestamp;
window._fbDoc           = path        => doc(db, path);
window._getDoc          = ref         => getDoc(ref);
window._setDoc          = (ref, data) => setDoc(ref, data);
window._GoogleAuthProvider = GoogleAuthProvider;
window._signInWithPopup    = provider => signInWithPopup(auth, provider);
window._signOut            = ()       => signOut(auth);

// Inicia observer (handleAuthStateChange definido em auth.js)
onAuthStateChanged(auth, window.handleAuthStateChange);
