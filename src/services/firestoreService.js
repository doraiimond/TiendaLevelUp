import {db} from "../config/firebase";
import { collection, addDoc, getDoc, query, where} from "firebase/firestore";

export async function addUser(user){
    return await addDoc(collection(db, "usuario"), {...user, createdat: new Date()});
};

