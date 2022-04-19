import './lib/firebase.js';
// eslint-disable-next-line import/no-cycle
import { Register } from './components/Register.js';
// eslint-disable-next-line import/no-cycle
import { Login } from './components/Login.js';
// eslint-disable-next-line import/no-cycle
import { Feed } from './components/Feed.js';
// eslint-disable-next-line import/no-cycle
import { Profile } from './components/Profile.js';
// eslint-disable-next-line import/no-cycle
import { Configurar } from './components/Configurar.js';
// eslint-disable-next-line import/no-cycle
import { ResetPassword } from './components/ResetPassword.js';

const rootDiv = document.getElementById('root');

const routes = {
  '/': Login,
  '/register': Register,
  '/feed': Feed,
  '/profile': Profile,
  '/configurar': Configurar,
  '/resetPassword': ResetPassword,
};

export const onNavigate = (pathname) => {
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname,
  );
  while (rootDiv.firstChild) {
    rootDiv.removeChild(rootDiv.firstChild);
  }
  rootDiv.appendChild(routes[pathname]());
};

const component = routes[window.location.pathname]; // sale ruta

window.onpopstate = () => {
  rootDiv.appendChild(component());
};

rootDiv.appendChild(component());
