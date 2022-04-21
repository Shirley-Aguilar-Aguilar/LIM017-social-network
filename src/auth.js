/* eslint-disable max-len */
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut,
  // eslint-disable-next-line no-unused-vars
  updatePassword, onAuthStateChanged, sendPasswordResetEmail,
// eslint-disable-next-line import/no-unresolved
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
// eslint-disable-next-line import/no-cycle
import { onNavigate } from './main.js';
import { dataUser, getUser } from './cloudFirebase.js';

// FUNCIÓN PARA CREAR NUEVOS USUARIOS
export async function register(name, email, password) {
  const auth = getAuth();
  let result = '';
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const idUser = userCredential.user.uid; // id de usuario
      result = true;
      // imagenes predeterminadas
      const urlPhotoUser = 'https://firebasestorage.googleapis.com/v0/b/social-network-programmers.appspot.com/o/user.jpg?alt=media&token=231ef8f9-fbee-4755-b3db-7cd80cbd3cf9';
      const urlCoverPage = 'https://firebasestorage.googleapis.com/v0/b/social-network-programmers.appspot.com/o/cover-default.jpg?alt=media&token=5a5ea188-4df6-41e6-8279-37f40e57711b';
      dataUser(idUser, name, email, password, urlPhotoUser, urlCoverPage);
    })
    .catch((error) => {
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/weak-password':
          result = 'Contraseña debil';
          break;
        case 'auth/email-already-in-use':
          result = 'Correo ya está registrado';
          break;
        case 'auth/invalid-email':
          result = 'Correo invalido';
          break;
        default:
          result = 'Correo y/o contraseña invalido';
          break;
      }
    });
  return result;
}

// FUNCIÓN PARA ACCESO A USUARIOS EXISTENTES
export function accesUser(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const usuario = userCredential.user.uid;
      const docSnap = await getUser(usuario);
      const urlPhotoUser = docSnap.data().urlPhotoUser;
      const nameUser = docSnap.data().name;
      const id = docSnap.data().id;
      sessionStorage.setItem('uid', id);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('nameUser', nameUser);
      sessionStorage.setItem('photoUser', urlPhotoUser);

      onNavigate('/feed');
    })
    .catch((error) => {
      console.log(error.message);
      document.getElementById('messageHide').style.display = 'block';
    });
}
// AUTENTICACIÓN CON GOOGLE
const provider = new GoogleAuthProvider();

export async function accesGoogle() {
  const auth1 = getAuth();
  signInWithPopup(auth1, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      const nameUser = user.displayName;
      const idUser = user.uid;
      const emailUser = user.email;

      let urlPhotoUser = null;
      let urlCoverPage = null;
      const docSnap = await getUser(idUser);
      if (docSnap.exists()) {
        urlPhotoUser = docSnap.data().urlPhotoUser;
        urlCoverPage = docSnap.data().urlCoverPage;
        sessionStorage.setItem('uid', user.uid);
        sessionStorage.setItem('photoUser', urlPhotoUser);
        sessionStorage.setItem('nameUser', nameUser);
        dataUser(idUser, nameUser, emailUser, token, urlPhotoUser, urlCoverPage);
      } else { // doc.data() will be undefined in this case
        // imagenes predeterminadas ¿'opcion de poner foto de google?
        urlPhotoUser = user.photoURL;
        sessionStorage.setItem('uid', user.uid);
        sessionStorage.setItem('nameUser', nameUser);
        sessionStorage.setItem('photoUser', urlPhotoUser);
        urlCoverPage = 'https://firebasestorage.googleapis.com/v0/b/social-network-programmers.appspot.com/o/cover-default.jpg?alt=media&token=5a5ea188-4df6-41e6-8279-37f40e57711b';
        dataUser(idUser, nameUser, emailUser, token, urlPhotoUser, urlCoverPage);
      }
      onNavigate('/feed');
    }).catch((error) => {
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(credential, error);
    });
}

// AUTENTICACIÓN CON FB
const provider2 = new FacebookAuthProvider();

export function accesFacebook() {
  const auth = getAuth();
  signInWithPopup(auth, provider2)
    .then((result) => {
      // The signed-in user info.
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const user = result.user;
      console.log(accessToken, user);
      onNavigate('/feed');
    })
    .catch((error) => {
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.log(credential, error);
    });
}

// REESTABLECER CONTRASEÑA
export function restorePassword() {
  const auth = getAuth();
  const email = document.getElementById('txtCorreo').value;
  console.log(email);
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      console.log('Puede cambiar contraseña');
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

// FUNCIÓN PARA CERRAR SESIÓN
export function cerrarSesion() {
  const auth = getAuth();
  signOut(auth)
    // eslint-disable-next-line no-unused-vars
    .then((userCredencial) => {
      // Password reset email sent!
      sessionStorage.clear();
      onNavigate('/');
    })
    .catch((error) => {
      console.log(error.message);
      document.getElementById('messageHide').style.display = 'block';
    });
}

export function validatePassword(password) {
  return password != null && password !== '';
}

export function configurationPassword() {
  const auth = getAuth();
  console.log(auth);
  const currentPassword = document.getElementById('txtPasswordCurrent').value;
  const newPassword = document.getElementById('txtPasswordNew').value;
  const newPasswordConfirm = document.getElementById('txtPasswordNewRepeat').value;
  const email = sessionStorage.getItem('email');
  if (newPassword !== newPasswordConfirm) {
    console.log('las contraseñas no coinciden');
    return;
  }
  if (!validatePassword(newPassword)) {
    console.log('la contraseña no es válida');
    return;
  }
  // Hacemos login para validar si currentpassword es la contraseña correcta
  signInWithEmailAndPassword(auth, email, currentPassword)
    .then(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user);

          updatePassword(user, newPassword).then(() => {
            console.log('Update successful');
            onNavigate('/');
          }).catch((error) => {
            // An error ocurred
            console.log(error.message);
          });
        } else {
          console.log(user);
        }
      });
    })
    .catch((error) => {
      console.log('la contraseña actual no es correcta');
      console.log(error.message);
      document.getElementById('messageHide').style.display = 'block';
    });
}

// VERIFICAR SI SESIÓN ESTA ACTIVA O NO => CERRAR SI ESTA INACTIVA
export function listeningSessionEvent() {
  const auth = getAuth();
  // eslint-disable-next-line no-shadow
  onAuthStateChanged(auth, (user) => {
    if (user === null) { // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
      onNavigate('/');
    }
  });
}
