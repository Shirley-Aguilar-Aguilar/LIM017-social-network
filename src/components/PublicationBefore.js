// eslint-disable-next-line import/no-unresolved
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
// eslint-disable-next-line import/no-unresolved
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';
import f from '../lib/function.js';
import { dataPublication, reviewResultPublication, db } from '../cloudFirebase.js';
// eslint-disable-next-line import/no-cycle
import { onNavigate } from '../main.js';
import { publicationUser } from '../storage.js';

export const publicationBeforeTemplate = () => {
  const feedTemplate2 = document.createElement('main');
  feedTemplate2.className = 'container-publication';
  /* PUBLICACIÓN DE USUARIO */
  const sectionPublication = document.createElement('section');
  sectionPublication.className = 'container-publication-section';
  const figureSection = document.createElement('figure');
  figureSection.className = 'photo-user-container';
  // foto de usuario
  const imgPhotoUser = document.createElement('img');
  imgPhotoUser.className = 'photo-user';
  imgPhotoUser.src = sessionStorage.getItem('photoUser');
  imgPhotoUser.alt = 'foto de perfil';
  imgPhotoUser.id = 'imagenUsuario';
  const figcaptionUser = document.createElement('figcaption');
  figcaptionUser.className = 'figcaption-name name-before';
  figcaptionUser.innerText = sessionStorage.getItem('nameUser');
  // inputs de publicación
  const formInputs = document.createElement('form');
  const inputTitle = document.createElement('div');
  inputTitle.contentEditable = true;
  inputTitle.className = 'div-title';
  inputTitle.setAttribute('placeholder', 'título de publicación');

  // div editable
  const divText = document.createElement('div');
  divText.contentEditable = true;
  divText.className = 'div-text';
  divText.setAttribute('placeholder', 'Escriba su texto aqui');
  // agregando mensaje para evitar publicaciones vacias
  const messageTitleText = document.createElement('p');
  messageTitleText.className = 'message-alert-title-text';
  messageTitleText.innerText = 'No se puede publicar título o texto vacío.';
  messageTitleText.style.display = 'none';
  // logos de publicación
  const containerLogosButton = document.createElement('div');
  containerLogosButton.className = 'container-logos-button';
  const imgShareImage = document.createElement('img');
  imgShareImage.className = 'share-image-logo logo-smile-image';
  imgShareImage.src = 'img/icomon/images.jpg';
  imgShareImage.alt = 'logo para agregar imagenes a la publicación';

  const imgShareStickers = document.createElement('img');
  imgShareStickers.className = 'share-stickers-logo logo-smile-image';
  imgShareStickers.src = 'img/icomon/smile.jpg';
  imgShareStickers.alt = 'logo para agregar stickers a la publicación';
  const buttonPublication = document.createElement('button');
  buttonPublication.className = 'button-publication';
  buttonPublication.innerText = 'Publicar';

  // div oculto para subir foto
  const divUploader = document.createElement('div');
  divUploader.style.display = 'none';
  divUploader.className = 'div-uploader';

  const divPreview = document.createElement('div');
  divPreview.className = 'div-preview';
  const imagePreview = document.createElement('img');
  imagePreview.id = 'imgPreview';
  const imageUploader = document.createElement('input');
  imageUploader.type = 'file';
  imageUploader.id = 'imgUploader';
  imageUploader.className = 'img-uploader';
  divPreview.appendChild(imagePreview);
  // div para mostrar logo mientras carga foto
  const divChangeLogoDisplay = document.createElement('div');
  divChangeLogoDisplay.style.display = 'none';
  divChangeLogoDisplay.className = 'div-display-change';
  const divChangeLogo = document.createElement('div');
  divChangeLogo.className = 'div-logo-change-image-publication';
  const imageLogo = document.createElement('img');
  imageLogo.src = '../img/cargando.gif';
  imageLogo.alt = 'gif de cargando';
  divChangeLogo.appendChild(imageLogo);
  divChangeLogoDisplay.appendChild(divChangeLogo);
  // div para emoticos
  const divEmoticons = document.createElement('div');
  divEmoticons.className = 'div-emoticons';
  divEmoticons.style.display = 'none';
  // eslint-disable-next-line no-plusplus
  for (let index = 1; index < 82; index++) {
    const emoji = `img/emoji/emoji${index}.png`;
    const emojiIco = document.createElement('img');
    emojiIco.className = 'emoticons';
    emojiIco.src = emoji;
    emojiIco.addEventListener('click', () => {
      divText.focus();
      f.pasteHtmlAtCaret(`<img class="emoticon" src="${emoji}">`);
    });
    divEmoticons.appendChild(emojiIco);
  }
  // agregando contenedores pequeños a medianos
  figureSection.appendChild(imgPhotoUser);
  figureSection.appendChild(figcaptionUser);
  formInputs.appendChild(divChangeLogoDisplay);
  formInputs.appendChild(inputTitle);
  formInputs.appendChild(divText);
  containerLogosButton.appendChild(imgShareImage);
  containerLogosButton.appendChild(imgShareStickers);
  containerLogosButton.appendChild(buttonPublication);
  containerLogosButton.appendChild(divEmoticons);
  // contenedor para subir imagenes a la publicación
  divUploader.appendChild(imageUploader);
  // agregando contenedores pequeños a medianos
  sectionPublication.appendChild(figureSection);
  sectionPublication.appendChild(formInputs);
  sectionPublication.appendChild(messageTitleText);
  sectionPublication.appendChild(containerLogosButton);
  sectionPublication.appendChild(divUploader);

  // evento para almacenar titulo y texto de publicación o para actualizar al editar publicación
  buttonPublication.addEventListener('click', () => {
    const title = inputTitle.innerHTML;
    const text = divText.innerHTML;
    const date = f.timeNow();
    if ((title === '') || (text === '')) {
      messageTitleText.style.display = 'block';
    } else {
      dataPublication(title, text, date);
      messageTitleText.style.display = 'none';
      reviewResultPublication();
      inputTitle.innerHTML = '';
      divText.innerHTML = '';
      divEmoticons.style.display = 'none';
    }
  });

  // evento para mostrar div de emoticons

  imgShareStickers.addEventListener('click', () => {
    if (divEmoticons.style.display === 'none') {
      divEmoticons.style.display = 'grid';
    } else {
      divEmoticons.style.display = 'none';
    }
  });

  // evento para aparecer el div para escoger imagen
  imgShareImage.addEventListener('click', () => {
    if (divUploader.style.display === 'none') {
      divUploader.style.display = 'flex';
    } else {
      divUploader.style.display = 'none';
    }
  });

  // evento para capturar evento para subir imagen
  imageUploader.addEventListener('change', (e) => {
    divText.appendChild(divPreview);
    const file = e.target.files[0]; // url de la foto
    console.log(file);
    divChangeLogoDisplay.style.display = 'block';
    publicationUser(file, imagePreview, divChangeLogoDisplay.style);
  });
  return sectionPublication;
};
