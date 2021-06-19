import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCy1d_1DvLSGGI2vh3y8KxbaeLFowEjMMU",
  authDomain: "amzn-2-d979b.firebaseapp.com",
  projectId: "amzn-2-d979b",
  storageBucket: "amzn-2-d979b.appspot.com",
  messagingSenderId: "532419708952",
  appId: "1:532419708952:web:304e683e589f7b509bdb6d",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

export const db = app.firestore();

// export default db;
