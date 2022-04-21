// eslint-disable-next-line import/no-cycle
import { headerTemplate } from './Header.js';
// eslint-disable-next-line import/no-cycle
import { publicationBeforeTemplate } from './PublicationBefore.js';
import {
  // eslint-disable-next-line max-len
  onGetPublicationUser, deletePublication, getOnlyPublication, updatePublication, onGetUser, likePublication, lovePublication,
} from '../cloudFirebase.js';
import { photoUser, coverPageUser, publicationUser } from '../storage.js';

export const Profile = () => {
  const profileContainer = document.createElement('div');
  profileContainer.className = 'container-feed'; // contenedor general
  const divChangeImageDisplay = document.createElement('div');
  divChangeImageDisplay.style.display = 'none';
  const divChangeImage = document.createElement('div');
  divChangeImage.className = 'div-logo-change-image';
  const logoChange = document.createElement('img');
  logoChange.src = '../img/cargando.gif';
  logoChange.alt = 'gif de cargando';
  const mainTemplate = document.createElement('main');
  mainTemplate.className = 'container-publication';
  const coverPagePhotoContainer = document.createElement('div');
  coverPagePhotoContainer.className = 'container-coverpage-Photo';
  divChangeImageDisplay.appendChild(divChangeImage);
  divChangeImage.appendChild(logoChange);

  // FOTO DE PORTADA Y FOTO DEL USUARIO EN GRANDE
  onGetUser((querySnapshot) => {
    let html = '';
    querySnapshot.forEach((doc2) => {
      const profileNew = doc2.data(); // dato de todos los usuarios
      if (profileNew.id === sessionStorage.getItem('uid')) {
        html += `
        <div class="container-coverPage-profilePhoto" id="coverProfileContainer"  style="background-image: url('${profileNew.urlCoverPage}');">
        <div class="photo-profile" style="background-image: url('${profileNew.urlPhotoUser}');">
          <div class="div-uploader-photo">
           <input type="file" id="imgUploaderphoto">
          </div>
        </div>
        <div class="name-usuario">
            <label class="name-label" id="nameLabel"> Bienvenid@ ${profileNew.name}</label>
        </div>
        <div class="div-uploader-cover-page">
             <input type="file" id="imgUploaderPortada">
        </div>
        </div>
      `;
      }
    });
    coverPagePhotoContainer.innerHTML = html;

    const imageUploaderPhoto = coverPagePhotoContainer.querySelector('#imgUploaderphoto');
    const imageUploaderCover = coverPagePhotoContainer.querySelector('#imgUploaderPortada');

    // AÑADIENDO FUNCIONALIDAD PARA PONER LA FOTO DEL USUARIO EN EL PROFILE
    imageUploaderPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0]; // url de la foto
      divChangeImageDisplay.style.display = 'block';
      photoUser(file, divChangeImageDisplay.style);
    });
    imageUploaderCover.addEventListener('change', (e) => {
      const file = e.target.files[0]; // url de la foto
      divChangeImageDisplay.style.display = 'block';
      coverPageUser(file, divChangeImageDisplay.style);
    });
  });
  // PUBLICACIONES SOLO DEL USUARIO
  onGetPublicationUser((querySnapshot) => {
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
                 <figcaption class ='user-name-pub' >${sessionStorage.getItem('nameUser')}</figcaption>
                 <img class= 'share-edit-logo' data-id='${doc2.id}' src='img/icomon/pencil.jpg' alt='logo para editar'>
                 <img class= 'share-trash-logo' data-id='${doc2.id}' src='img/icomon/bin.jpg' alt='logo para eliminar publicación'>
             </figure>
          </div>
          <div  contentEditable ='false' class= 'title-area '  id= 'newTitle' >${publicationNew.title}</div>
          <div  contentEditable ='false'   class= 'text-area div-text' id= 'newText'>${publicationNew.text}</div>
         <div class = 'direction' >
             <img  style='display:none;' class='share-stickers-logo like-love-smile' src='img/icomon/smile.jpg' alt='logo para agregar stickers a la publicación'>
             <img class= 'like-love-smile btnlike' data-id='${doc2.id}' src= ${!publicationNew.like ? 'img/icomon/like.jpg' : publicationNew.like.find((e) => e === sessionStorage.getItem('uid')) ? 'img/icomon/likeO.jpg' : 'img/icomon/like.jpg'} alt='logo para dar me encanta'><figcaption class ='count-like-love' >${publicationNew.like ? publicationNew.like.length : 0}</figcaption>
             <img class= 'like-love-smile btnlove' data-id='${doc2.id}' src= ${!publicationNew.love ? 'img/icomon/heart.jpg' : publicationNew.love.find((e) => e === sessionStorage.getItem('uid')) ? 'img/icomon/heartO.jpg' : 'img/icomon/heart.jpg'} alt='logo para dar love'><figcaption class ='count-like-love' >${publicationNew.love ? publicationNew.love.length : 0}</figcaption>
             <button style='display:none;'  class = 'btn-save'>Guardar cambios</button>
             <div class='div-emoticons' id='divEmoticon'; style='display: none;'></div>
          </div>
          
        </section>
       `;
      }
    });
    mainTemplate.innerHTML = html;
    // AGREGANDO FUNCIONALIDAD DE IMAGENES
    const buttonShareImage = mainTemplate.querySelectorAll('.share-image-logo');
    buttonShareImage.forEach((btnImage) => {
      const sectionPublication = btnImage.parentNode.parentNode;
      const divUploader = sectionPublication.querySelector('.div-uploader');
      const inputUploader = sectionPublication.querySelector('.img-uploader');
      const divEmoticon = sectionPublication.querySelector('.div-emoticons');
      const areaText = sectionPublication.querySelector('.text-area');
      const divChangeLogoDisplay = sectionPublication.querySelector('.div-display-change');
      const buttonShare = sectionPublication.querySelector('.share-image-logo');
      buttonShare.addEventListener('click', () => {
        if (divUploader.style.display === 'none') {
          divUploader.style.display = 'flex';
          divEmoticon.style.display = 'none';
        } else {
          divUploader.style.display = 'none';
        }
      });
      inputUploader.addEventListener('change', (e) => {
        const divPreview = document.createElement('div');
        divPreview.className = 'div-preview';
        const imagePreview = document.createElement('img');
        imagePreview.id = 'imgPreview';
        divPreview.appendChild(imagePreview);
        areaText.appendChild(divPreview);

        const file = e.target.files[0]; // url de la foto
        divChangeLogoDisplay.style.display = 'block';
        publicationUser(file, imagePreview, divChangeLogoDisplay.style);
      });
    });
    // LIKE A PUBLICACIONES
    const buttonLike = mainTemplate.querySelectorAll('.btnlike');
    buttonLike.forEach((btn) => {
      btn.addEventListener('click', ({ target: { dataset } }) => {
        likePublication(dataset.id);
      });
    });
    // LOVE A PUBLICACIONES
    const buttonLove = mainTemplate.querySelectorAll('.btnlove');
    buttonLove.forEach((btn) => {
      btn.addEventListener('click', ({ target: { dataset } }) => {
        lovePublication(dataset.id);
      });
    });
    // eliminando publicaciones
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
        // obtenemos los contenedores
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
        // ACTUALIZANDO PUBLICACIONES
        buttonSave.addEventListener('click', () => {
          let titleNew = doc3.data().title;
          titleNew = sectionPublication.querySelector('#newTitle').innerHTML;
          let textNew = doc3.data().text;
          textNew = sectionPublication.querySelector('#newText').innerHTML;
          updatePublication(id, {
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
  });
  profileContainer.appendChild(divChangeImageDisplay);
  profileContainer.appendChild(headerTemplate());
  profileContainer.appendChild(coverPagePhotoContainer);
  profileContainer.appendChild(publicationBeforeTemplate());
  profileContainer.appendChild(mainTemplate);

  return profileContainer;
};
