import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";


// initialize firebase
const firebaseAuthentication = () => initializeApp(firebaseConfig)


export default firebaseAuthentication;