// Kuusaa (database) kan Firebase — bilisaa fi salphaa.
// Tarkaanfii 1: firebase.google.com irratti account/project haaraa uumi (bilisa).
// Tarkaanfii 2: Project Settings > "Your apps" > Web app (</>) filadhu.
// Tarkaanfii 3: "firebaseConfig" siif kennamu gara asii guuti (jala kana).
// Tarkaanfii 4: Firestore Database uumi (Build > Firestore Database > Create database
//   > "Start in test mode" filadhu — school app xiqqoo waan taʼeef gahaa dha).
import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCEu7m-CqNuzFruUVqXr9gv1D1ZLOghDw",
  authDomain: "test-mode-91b2f.firebaseapp.com",
  projectId: "test-mode-91b2f",
  storageBucket: "test-mode-91b2f.firebasestorage.app",
  messagingSenderId: "125927791813",
  appId: "1:125927791813:web:40d07ed460d6feb6ff64ac",
};

const app = initializeApp(firebaseConfig);

// Kuusaa lokaalii (offline cache) kan bal'aa — yoo intarneetiin adda cite,
// jijjiiramni ni qabama, gara serverittis network deebi'ee erga argamee ofumaan erga.
// Kunis daataan waan hin banneef/hin baddineef furmaata ijoo dha.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
