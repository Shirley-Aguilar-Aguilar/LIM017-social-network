/* eslint-disable no-nested-ternary */
// eslint-disable-next-line import/no-cycle
import { headerTemplate } from './Header.js';
// eslint-disable-next-line import/no-cycle
import { publicationBeforeTemplate } from './PublicationBefore.js';
import {
  onGetPublication, deletePublication, getOnlyPublication, updatePublication,
  likePublication, lovePublication, getUsers,
} from '../lib/cloudFirebase.js';
import { publicationUser } from '../lib/storage.js';

export const Feed = () => {
  const divFeed = document.createElement('div');
  divFeed.className = 'container-feed'; // contenedor general
  const mainTemplate = document.createElement('main');
  mainTemplate.className = 'container-publication';

  onGetPublication(async (querySnapshot) => {
    let html = '';

    const allDataUser = await getUsers();
    const mapaDato = new Map();

    allDataUser.forEach((dataUser) => {
      mapaDato.set(`${dataUser.data().id}-photo`, dataUser.data().urlPhotoUser);
      mapaDato.set(`${dataUser.data().id}-name`, dataUser.data().name);
    });
    querySnapshot.forEach(async (doc2) => {
      const publicationNew = doc2.data();
      if (sessionStorage.getItem('uid') === publicationNew.uid) {
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
          <div class='div-display-change' style='display: none;'>
                <div class='div-logo-change-image-publication'>
                  <img src='../img/cargando.gif' alt='gif de cargando'>
                </div>
          </div>
          <div  contentEditable ='false' class= 'title-area '  id= 'newTitle' >${publicationNew.title}</div>
          <div  contentEditable ='false'   class= 'text-area div-text' id= 'newText'>${publicationNew.text}
          </div>
          <div class = 'direction' >
             <img style='display:none;' class="share-image-logo logo-smile-image" data-id='${doc2.id}'  src="img/icomon/images.jpg" alt="logo para agregar imagenes a la publicación">
             <img  style='display:none;' class='share-stickers-logo like-love-smile ' src='img/icomon/smile.jpg' alt='logo para agregar stickers a la publicación'>
             <img class= 'like-love-smile btnlike' data-id='${doc2.id}' src= ${!publicationNew.like ? 'img/icomon/like.jpg' : publicationNew.like.find((e) => e === sessionStorage.getItem('uid')) ? 'img/icomon/likeO.jpg' : 'img/icomon/like.jpg'} alt='logo para dar me encanta'><figcaption class ='count-like-love' >${publicationNew.like ? publicationNew.like.length : 0}</figcaption>
             <img class= 'like-love-smile btnlove' data-id='${doc2.id}' src= ${!publicationNew.love ? 'img/icomon/heart.jpg' : publicationNew.love.find((e) => e === sessionStorage.getItem('uid')) ? 'img/icomon/heartO.jpg' : 'img/icomon/heart.jpg'} alt='logo para dar love'><figcaption class ='count-like-love' >${publicationNew.love ? publicationNew.love.length : 0}</figcaption>
             <button style='display:none;'  class = 'btn-save'>Guardar cambios</button>
             <div class='div-emoticons ' id='divEmoticon'; style='display: none;'></div>
          </div>
          <div class = 'div-uploader' style='display:none;'>
                 <input type ='file' id = 'imgUploader' class = 'img-uploader' >
          </div>
          
        </section>
       `;
      } else {
        html += `
        <section class= 'container-publication-final' >
          <div class = 'container-user-edit direction' >
             <figure class = figure-name-photo direction' >
                 <img class= 'photo-user-pub' id = 'photoUser' src='${mapaDato.get(`${publicationNew.uid.toString()}-photo`)}'  alt='foto de perfil'>
                 <figcaption class ='user-name-pub' >${mapaDato.get(`${publicationNew.uid.toString()}-name`)}</figcaption>
             </figure>
          </div>
          <div  contentEditable ='false' id= 'newTitle'>${publicationNew.title}</div>
          <div  contentEditable ='false'  class= 'p-text-publication' id= 'newText' >${publicationNew.text}</div>
          <div class = 'direction' >
          <img class= 'like-love-smile btnlike' data-id='${doc2.id}' src= ${!publicationNew.like ? 'img/icomon/like.jpg' : publicationNew.like.find((e) => e === sessionStorage.getItem('uid')) ? 'img/icomon/likeO.jpg' : 'img/icomon/like.jpg'} alt='logo para dar me encanta'><figcaption class ='count-like-love' >${publicationNew.like ? publicationNew.like.length : 0}</figcaption>
          <img class= 'like-love-smile btnlove' data-id='${doc2.id}' src= ${!publicationNew.love ? 'img/icomon/heart.jpg' : publicationNew.love.find((e) => e === sessionStorage.getItem('uid')) ? 'img/icomon/heartO.jpg' : 'img/icomon/heart.jpg'} alt='logo para dar love'><figcaption class ='count-like-love' >${publicationNew.love ? publicationNew.love.length : 0}</figcaption>
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
        console.log(file);
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
        // obtenemos los contenedores
        const areaTitle = sectionPublication.querySelector('.title-area');
        const areaText = sectionPublication.querySelector('.text-area');
        // activando contenedores
        areaTitle.contentEditable = true;
        areaText.contentEditable = true;
        // mostramos boton para guardar cambios
        const inputUploader = sectionPublication.querySelector('.div-uploader');
        const imgUploader = sectionPublication.querySelector('.share-image-logo');
        imgUploader.style.display = 'block';
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
            inputUploader.style.display = 'none';
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
  });
  divFeed.appendChild(headerTemplate());
  divFeed.appendChild(publicationBeforeTemplate());
  divFeed.appendChild(mainTemplate);

  return divFeed;
};
