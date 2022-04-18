/* eslint-disable max-len */
// eslint-disable-next-line import/no-unresolved
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
// eslint-disable-next-line import/no-unresolved
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';
// eslint-disable-next-line import/no-cycle
import { headerTemplate } from './Header.js';
// eslint-disable-next-line import/no-cycle
import { publicationBeforeTemplate } from './PublicationBefore.js';
// eslint-disable-next-line object-curly-newline
import { onGetPublication, deletePublication, getOnlyPublication, updatePublication, db } from '../cloudFirebase.js';
// eslint-disable-next-line import/no-cycle
import { onNavigate } from '../main.js';

export const Feed = () => {
  const divFeed = document.createElement('div');
  divFeed.className = 'container-feed'; // contenedor general
  const mainTemplate = document.createElement('main');
  mainTemplate.className = 'container-publication';

  onGetPublication((querySnapshot) => {
    let html = '';
    querySnapshot.forEach((doc2) => {
      const publicationNew = doc2.data();
      if (publicationNew.uid === sessionStorage.getItem('uid')) {
        html += `
        <section class= 'container-publication-final' >
            <div style='display:none;' class = 'message-alert-content div-alert-message-color'>
                <p>¿Estas seguro de eliminar esta publicación?</p>
                <button  class ='button-yes button-alert' data-id='${doc2.id}' >SI</button>
                <button class= 'button-no button-alert'>NO</button>
            </div>
          <div class = 'container-user-edit direction' >
             <figure class = figure-name-photo direction' >
                 <img class= 'photo-user-pub' id = 'photoUser' src='${sessionStorage.getItem('photoUser')}' alt='foto de perfil'>
                 <figcaption class ='user-name-pub' ></figcaption>
                 <img class= 'share-edit-logo' data-id='${doc2.id}' src='img/icomon/pencil.jpg' alt='logo para editar'>
                 <img class= 'share-trash-logo' data-id='${doc2.id}' src='img/icomon/bin.jpg' alt='logo para eliminar publicación'>
             </figure>
          </div>
          <div  contentEditable ='false' class= 'title-area '  id= 'newTitle' >${publicationNew.title}</div>
          <div  contentEditable ='false'   class= 'text-area div-text' id= 'newText'>${publicationNew.text}</div>
          <div class = 'direction' >
             <img  style='display:none;' class='share-stickers-logo like-love-smile ' src='img/icomon/smile.jpg' alt='logo para agregar stickers a la publicación'>
             <img class= 'like-love-smile ' src='img/icomon/like.jpg' alt='logo para dar me encanta'>
             <img class= 'like-love-smile ' src='img/icomon/heart.jpg' alt='logo para dar love'>
             <button style='display:none;'  class = 'btn-save'>Guardar cambios</button>
             <div class='div-emoticons ' id='divEmoticon'; style='display: none;'></div>
          </div>
          
        </section>
       `;
      } else {
        html += `
        <section class= 'container-publication-final' >
          <div class = 'container-user-edit direction' >
             <figure class = figure-name-photo direction' >
                 <img class= 'photo-user-pub' id = 'photoUser' src='img/icomon/user.jpg' alt='foto de perfil'>
                 <figcaption class ='user-name-pub' >Username</figcaption>
             </figure>
          </div>
          <div  contentEditable ='false' id= 'newTitle'>${publicationNew.title}</div>
          <div  contentEditable ='false'  class= 'p-text-publication' id= 'newText' >${publicationNew.text}</div>
          <div class = 'direction' >
             <img class= 'like-love-smile' src='img/icomon/like.jpg' alt='logo para dar me encanta'>
             <img class= 'like-love-smile' src='img/icomon/heart.jpg' alt='logo para dar love'>
          </div>
        </section>
      `;
      }
    });
    mainTemplate.innerHTML = html;
    // ELIMINANDO PUBLICACIONES
    const buttonDelete = mainTemplate.querySelectorAll('.share-trash-logo');
    buttonDelete.forEach((btn) => {
      const sectionPublication = btn.parentNode.parentNode.parentNode;
      const buttonDeleteOnly = sectionPublication.querySelector('.share-trash-logo');
      const messageAlert = sectionPublication.querySelector('.div-alert-message-color');
      const messageAlertYes = sectionPublication.querySelector('.button-yes');
      const messageAlertNo = sectionPublication.querySelector('.button-no');
      buttonDeleteOnly.addEventListener('click', () => {
        messageAlert.style.display = 'block';
        messageAlertYes.addEventListener('click', ({ target: { dataset } }) => {
          deletePublication(dataset.id);
          messageAlert.style.display = 'none';
        });
        messageAlertNo.addEventListener('click', () => {
          messageAlert.style.display = 'none';
        });
      });
    });

    // EDITANDO PUBLICACIONES
    const buttonEdit = mainTemplate.querySelectorAll('.share-edit-logo');
    buttonEdit.forEach((btn2) => {
      btn2.addEventListener('click', async (e) => {
        const doc3 = await getOnlyPublication(e.target.dataset.id); // trae publicaciones por id
        const id = e.target.dataset.id;
        const sectionPublication = btn2.parentNode.parentNode.parentNode;
        // activamos el text area y el div para editar
        const areaTitle = sectionPublication.querySelector('.title-area');
        const areaText = sectionPublication.querySelector('.text-area');
        // activando contenedores
        areaTitle.contentEditable = true;
        areaText.contentEditable = true;
        // mostramos boton para guardar cambios
        const emoticon = sectionPublication.querySelector('.share-stickers-logo');
        const buttonSave = sectionPublication.querySelector('.btn-save');
        // eslint-disable-next-line no-param-reassign
        emoticon.style.display = 'block';

        // AÑADIENDO STICKERS
        const divEmoticon = sectionPublication.querySelector('.div-emoticons');
        // eslint-disable-next-line no-plusplus
        for (let index = 1; index < 82; index++) {
          const emoji = `../img/emoji/emoji${index}.png`;
          const emojiIco = document.createElement('img');
          emojiIco.className = 'emoticons emoticons-final';
          emojiIco.src = emoji;
          divEmoticon.appendChild(emojiIco);
          emojiIco.addEventListener('click', () => {
            const text = areaText.innerHTML;
            areaText.innerHTML = `${text}<img class="emoticon" src="${emoji}">`;
          });
        }
        emoticon.addEventListener('click', () => {
          if (divEmoticon.style.display === 'none') {
            divEmoticon.style.display = 'grid';
          } else {
            divEmoticon.style.display = 'none';
          }
        });
        buttonSave.style.display = 'block';
        buttonSave.addEventListener('click', () => {
          let titleNew = doc3.data().title;
          titleNew = sectionPublication.querySelector('#newTitle').innerHTML;
          let textNew = doc3.data().text;
          textNew = sectionPublication.querySelector('#newText').innerHTML;
          updatePublication(id, { // actualizando publicaciones
            title: titleNew,
            text: textNew,
          });
          // eslint-disable-next-line no-param-reassign
          emoticon.style.display = 'none';
          buttonSave.style.display = 'none';
          areaTitle.contentEditable = false;
          areaText.contentEditable = false;
        });
      });
    });
    buttonEdit.forEach((btn) => {
      const sectionPublication = btn.parentNode.parentNode;
      // obtener nombre y foto de firebase o de google de cada usuario
      function loginGoogleName() {
        const userNameGoogle = sessionStorage.getItem('name');
        if (userNameGoogle != null) {
          sectionPublication.querySelector('.user-name-pub').innerText = sessionStorage.getItem('name');
        } else {
          sectionPublication.querySelector('.user-name-pub').innerText = 'username';
        }
      }
      // eslint-disable-next-line spaced-comment
      /*function loginGooglePhoto() {
        const photoNameGoogle = sessionStorage.getItem('photo');
        if (photoNameGoogle != null) {
          sectionPublication.querySelector('.photo-user-pub').src = sessionStorage.getItem('photoUser');
        } else {
          sectionPublication.querySelector('.photo-user-pub').src = 'img/icomon/user.jpg';
        }
      }*/

      async function obtenerUsuarioId(id) {
        let user = null;
        const docRef = doc(db, 'dataUsers', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          user = docSnap.data();
          if (user.name != null) {
            sectionPublication.querySelector('.user-name-pub').innerText = user.name;
          } else {
            sectionPublication.querySelector('.user-name-pub').innerText = 'username';
          }
        } else { // doc.data() will be undefined in this case
          loginGoogleName();
          console.log('No such document in Google!');
        }

        // eslint-disable-next-line spaced-comment
        /*if (docSnap.exists()) {
          user = docSnap.data();
          if (user.photo != null) {
            sectionPublication.querySelector('.photo-user-pub').src = sessionStorage.getItem('photoUser');
          } else {
            sectionPublication.querySelector('.photo-user-pub').src = 'img/icomon/user.jpg';
          }
        } else { // doc.data() will be undefined in this case
          loginGooglePhoto();
          console.log('No such document in Google!');
        }*/
      }

      // ver autentificacion si la sesion  esta activa o inactiva //inicia y cerrar sesion
      function listeningSessionEvent() {
        const auth = getAuth();
        // eslint-disable-next-line no-shadow
        onAuthStateChanged(auth, (user) => {
          if (user === null) { // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
            onNavigate('/');
          } else {
            const uid = user.uid;
            obtenerUsuarioId(uid);
          }
        });
      }
      listeningSessionEvent();
    });
  });
  divFeed.appendChild(headerTemplate());
  divFeed.appendChild(publicationBeforeTemplate());
  divFeed.appendChild(mainTemplate);

  return divFeed;
};
