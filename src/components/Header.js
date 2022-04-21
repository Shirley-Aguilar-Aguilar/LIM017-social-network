// eslint-disable-next-line import/no-cycle
import { onNavigate } from '../main.js';
// eslint-disable-next-line import/no-cycle
import { cerrarSesion, listeningSessionEvent } from '../auth.js';

export const headerTemplate = () => {
  const headerdiv = document.createElement('header');
  // CONTENEDOR DIV( FOTO,NAME,SEARCH)
  const divContainerSearchPhoto = document.createElement('div');
  divContainerSearchPhoto.className = 'container-search-photo-nav';
  // contenedor de foto y nombre
  const figureNamePhoto = document.createElement('figure');
  figureNamePhoto.className = 'photo-user-container';
  const aPhoto = document.createElement('a');
  const imgUser = document.createElement('img');
  imgUser.className = 'photo-user';
  imgUser.src = sessionStorage.getItem('photoUser');
  imgUser.id = 'imagenUsuario';
  imgUser.alt = 'foto de perfil';
  const attr = document.createAttribute('referrerpolicy');
  attr.value = 'no-referrer';
  imgUser.setAttributeNode(attr);
  const figcaptionName = document.createElement('figcaption');
  figcaptionName.className = 'figcaption-name';
  figcaptionName.innerText = sessionStorage.getItem('nameUser');

  // contenedor del buscador
  const containerSearch = document.createElement('div');
  containerSearch.className = 'container-search';
  const inputSearch = document.createElement('input');
  inputSearch.className = 'input-search';
  inputSearch.placeholder = 'Buscar';

  const imgSearch = document.createElement('img');
  imgSearch.className = 'search-logo';
  imgSearch.src = 'img/icomon/search.jpg';
  imgSearch.alt = 'lupita';

  // agregando elementos pequeños a contenedores
  aPhoto.appendChild(imgUser);
  figureNamePhoto.appendChild(aPhoto);
  figureNamePhoto.appendChild(figcaptionName);

  containerSearch.appendChild(inputSearch);
  containerSearch.appendChild(imgSearch);

  // CONTENEDOR NAV
  const containerNav = document.createElement('nav');
  containerNav.className = 'container-search-photo-nav width-content';
  const aWall = document.createElement('a');
  const imgWall = document.createElement('img');
  imgWall.className = 'logo-wall';
  imgWall.src = 'img/icomon/home.jpg';
  imgWall.alt = 'logo para el muro';

  const imgComputer = document.createElement('img');
  imgComputer.className = 'logo-computer';
  imgComputer.src = 'img/logo3.png';
  imgComputer.alt = 'una computadora(logo de aplicación)';
  // navegador oculto
  const lines = document.createElement('img');
  lines.className = 'nav-lines';
  lines.src = 'img/icomon/menu.jpg';
  const containerNavHide = document.createElement('div');
  containerNavHide.className = 'container-options-nav';
  containerNavHide.id = 'optionsNav';
  containerNavHide.style.display = 'none';

  const ulNavHide = document.createElement('ul');
  ulNavHide.className = 'ul-nav';

  const liConfig = document.createElement('li');
  const aConfig = document.createElement('a');
  aConfig.innerText = 'Configurar cuenta';
  aConfig.addEventListener('click', () => {
    onNavigate('/configurar');
  });

  const liDelete = document.createElement('li');
  const aDelete = document.createElement('a');
  aDelete.href = '#';
  aDelete.innerText = 'Eliminar cuenta';

  const liPrivate = document.createElement('li');
  const aPrivate = document.createElement('a');
  aPrivate.href = '#';
  aPrivate.innerText = 'Privacidad';

  const liClose = document.createElement('li');
  const aClose = document.createElement('a');
  aClose.href = '#';
  aClose.innerText = 'Cerrar cuenta';
  aClose.addEventListener('click', () => {
    cerrarSesion();
  });

  // agregando a contenedor mediano
  divContainerSearchPhoto.appendChild(imgComputer);
  divContainerSearchPhoto.appendChild(containerSearch);
  // agregando elementos pequeños a contenedores
  aWall.appendChild(imgWall);
  liConfig.appendChild(aConfig);
  liDelete.appendChild(aDelete);
  liPrivate.appendChild(aPrivate);
  liClose.appendChild(aClose);
  // agregando a contenedor mediano
  ulNavHide.appendChild(liConfig);
  ulNavHide.appendChild(liDelete);
  ulNavHide.appendChild(liPrivate);
  ulNavHide.appendChild(liClose);

  containerNavHide.appendChild(ulNavHide);
  // agregando contenido al nav
  containerNav.appendChild(aWall);
  containerNav.appendChild(figureNamePhoto);
  containerNav.appendChild(lines);
  containerNav.appendChild(containerNavHide);

  // agregando al header
  // headerdiv.appendChild(divContainerSearchPhoto);
  headerdiv.appendChild(divContainerSearchPhoto);
  headerdiv.appendChild(containerNav);

  // evento para aparecer el nav
  lines.addEventListener('click', () => {
    if (containerNavHide.style.display === 'none') {
      containerNavHide.style.display = 'block';
    } else {
      containerNavHide.style.display = 'none';
    }
  });

  listeningSessionEvent();

  // Eventos de navegador
  aPhoto.addEventListener('click', () => { onNavigate('/profile'); });
  aWall.addEventListener('click', () => { onNavigate('/feed'); });
  imgComputer.addEventListener('click', () => { onNavigate('/feed'); });
  figcaptionName.addEventListener('click', () => { onNavigate('/profile'); });
  return headerdiv;
};
