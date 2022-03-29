// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-unresolved
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import {
  collection, query, where, getDocs, getFirestore,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';
import { headerTemplate } from './Header.js';
import { publicationBeforeTemplate } from './PublicationBefore.js';
import { publications } from './Publication.js';
import { onGetPublicationUser } from '../cloudFirebase.js';

export const db = getFirestore();
export const Profile = () => {
  const profileContainer = document.createElement('div');
  profileContainer.className = 'container-feed'; // contenedor general
  const mainTemplate = document.createElement('main');
  mainTemplate.className = 'container-publication';

  // mainTemplate.appendChild(publications());

  onGetPublicationUser((querySnapshot) => {
    let html = '';
    querySnapshot.forEach((doc) => {
      const publicationNew = doc.data();
      console.log('entro');
      html += `
          <section class= 'container-publication-final' >
            <div class = 'container-user-edit direction' >
               <figure class = figure-name-photo direction' >
                   <img class= 'photo-user-pub' src='img/profile-user.png' alt='foto de perfil'>
                   <figcaption>Username</figcaption>
               </figure>
               <img class= 'share-edit-logo logo-publication' src='img/escribir.png' alt='logo para editar'>
               <img class= 'share-trash-logo logo-publication' src='img/icons8-trash-30.png' alt='logo para eliminar publicación'>
            </div>
            <p>${publicationNew.title}</p>
            <p  class= 'input-text-publication' >${publicationNew.text}</p>
            <div class = 'logos-like-love direction' >
               <img class= 'like-logo logo-publication' src='img/icons8-like-64.png' alt='logo para dar me encanta'>
               <img class= 'love-logo logo-publication' src='img/corazones.png' alt='logo para dar love'>
            </div>
          </section>
        `;
    });
    mainTemplate.innerHTML = html;
  });

  profileContainer.appendChild(headerTemplate());
  profileContainer.appendChild(publicationBeforeTemplate());
  profileContainer.appendChild(mainTemplate);

  // escuchandoFondo();
  return profileContainer;
};

/*function escuchandoFondo() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
      obtenerUsuarioId(uid);
      console.log(uid);
    } else {
      // User is signed out
      // ...
    }
  });
}

async function obtenerUsuarioId(id) {
  const q = query(collection(db, 'dataUsers'), where('id', '==', id));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data());
  });
}*/
