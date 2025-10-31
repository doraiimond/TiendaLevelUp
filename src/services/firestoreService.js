import  { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addUser(usuario) {
    try {
        const docRef = await addDoc(collection(db, "usuario"), {
        ...usuario, //usuario = { nombre, correo, clave }
        createdAt: new Date(),
        });
        console.log("Usuario agregado con ID:", docRef.id);
        return docRef;
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        throw error;// Propagar el error para manejarlo en el frontend
    }
}
