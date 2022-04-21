/* eslint-disable object-curly-newline */
// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line import/no-unresolved
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, setDoc, getDoc, query, where, updateDoc, orderBy, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js'; // conectar ,importar,mostrar

export const db = getFirestore();

// para almacenar datos del usuario
export async function dataUser(id, name, email, password, urlPhotoUser, urlCoverPage) {
  try {
    const docRef = await setDoc(doc(db, 'dataUsers', id), {
      id, name, email, password, urlPhotoUser, urlCoverPage,
    });
    // eslint-disable-next-line no-console
    console.log('id data user: ', docRef.id);
  } catch (e) {
    // console.error('Error adding document: ', e);
  }
}
/* USUARIO  */

export const getUser = (id) => getDoc(doc(db, 'dataUsers', id));// obtener informacion del usuario despues del login
export const getUsers = () => getDocs(collection(db, 'dataUsers')); // obtener informacion de los usuarios  despues del login
export const onGetUser = (callback) => onSnapshot(query(collection(db, 'dataUsers')), callback);
export const updateDataUsers = (id, newFields) => updateDoc(doc(db, 'dataUsers', id), newFields); // actualizar publicación
/* PUBLICACIÓN */
export const dataPublication = (uid, title, text, date) => addDoc(collection(db, 'dataPublication'), { uid, title, text, date }); // para alamacenar datos de publicación
export const getPublication = () => getDocs(collection(db, 'dataPublication')); // obtener informacion
export const onGetPublication = (callback) => onSnapshot(query(collection(db, 'dataPublication'), orderBy('date', 'desc')), callback);// se agrega la publicación nueva sin recargar
export const onGetPublicationUser = (callback) => onSnapshot(query(collection(db, 'dataPublication'), where('uid', '==', sessionStorage.getItem('uid')), orderBy('date', 'desc')), callback); // se agrega la publicación nueva sin recargar POR USUARIO
export const deletePublication = (id) => deleteDoc(doc(db, 'dataPublication', id)); // eliminar publicación
export const getOnlyPublication = (id) => getDoc(doc(db, 'dataPublication', id)); // editar publicación
export const updatePublication = (id, newFields) => updateDoc(doc(db, 'dataPublication', id), newFields); // actualizar publicación

/* FUNCIONES DE LIKE Y LOVE */
export async function likePublication(id) {
  try {
    let docRef;
    const like = await getOnlyPublication(id);
    if (!like.data().like) {
      // eslint-disable-next-line no-unused-vars
      docRef = await setDoc(doc(db, 'dataPublication', id), { like: arrayUnion(sessionStorage.getItem('uid')) }, { merge: true });
    } else if (like.data().like.find((e) => e === sessionStorage.getItem('uid'))) {
      docRef = await setDoc(doc(db, 'dataPublication', id), { like: arrayRemove(sessionStorage.getItem('uid')) }, { merge: true });
    } else {
      // eslint-disable-next-line no-unused-vars
      docRef = await setDoc(doc(db, 'dataPublication', id), { like: arrayUnion(sessionStorage.getItem('uid')) }, { merge: true });
    }
  } catch (e) {
    // console.error('Error adding document: ', e);
  }
}

export async function lovePublication(id) {
  try {
    let docRef;
    const love = await getOnlyPublication(id);
    if (!love.data().love) {
      // eslint-disable-next-line no-unused-vars
      docRef = await setDoc(doc(db, 'dataPublication', id), { love: arrayUnion(sessionStorage.getItem('uid')) }, { merge: true });
    } else if (love.data().love.find((e) => e === sessionStorage.getItem('uid'))) {
      docRef = await setDoc(doc(db, 'dataPublication', id), { love: arrayRemove(sessionStorage.getItem('uid')) }, { merge: true });
    } else {
      // eslint-disable-next-line no-unused-vars
      docRef = await setDoc(doc(db, 'dataPublication', id), { love: arrayUnion(sessionStorage.getItem('uid')) }, { merge: true });
    }
  } catch (e) {
    // console.error('Error adding document: ', e);
  }
}
