import {
  register, accesUser, accesGoogle,
} from '../../src/lib/auth';
import { ResetPassword } from '../../src/components/ResetPassword.js';
import { Login } from '../../src/components/Login.js';
import {
  createNewPassword, closeSession, accesUserExist, signGoogle, createUser,
} from '../../src/lib/controller-firebase/auth-functions.js';

const {
  getAuth, signInWithPopup, GoogleAuthProvider,
  signInWithEmailAndPassword, sendPasswordResetEmail, signOut,
} = require('../../src/lib/imports/firebase-imports.js');

jest.mock('../../src/lib/imports/firebase-imports.js');

test('use jsdom in this test file', () => {
  const root = document.getElementById('root');
  expect(root).not.toBeNull();
});

describe('register', () => {
  it('la función retorna un objeto(si se creo el usuario)', () => {
    const email = 'maria@gmail.com';
    const name = 'Maria';
    const password = 'maria123';
    expect(typeof register(name, email, password)).toBe('object');
    expect(typeof createUser(email, password)).toBe('object');
  });

  it('si se crea el usuario, retorna true', async () => {
    const email = 'maria@gmail.com';
    const name = 'Maria';
    const password = 'maria123';
    register(name, email, password)
      .then((result) => {
        expect(result).toBe(true);
      });
  });
  it('si no se crea el usuario, retorna el error Correo invalido', async () => {
    const email = 'maria';
    const name = 'Maria';
    const password = 'maria123';
    register(name, email, password)
      .catch((error) => {
        expect(error).toBe('Correo invalido');
      });
  });
  it('si no se crea el usuario, retorna el error Contraseña debil', async () => {
    const email = 'maria@gmail.com';
    const name = 'Maria';
    const password = 'maria';
    register(name, email, password)
      .catch((error) => {
        expect(error).toBe('Contraseña debil');
      });
  });
  it('si no se crea el usuario, retorna el error Correo ya está registrado', async () => {
    const email = 'prueba@gmail.com';
    const name = 'Maria';
    const password = 'maria';
    register(name, email, password)
      .catch((error) => {
        expect(error).toBe('Correo ya está registrado');
      });
  });
  it('si no se crea el usuario, retorna el errorCorreo y/o contraseña invalido', async () => {
    const email = 'maria';
    const name = 'Maria';
    const password = false;
    register(name, email, password)
      .catch((error) => {
        expect(error).toBe('Correo y/o contraseña invalido');
      });
  });
});

describe('accesUser', () => {
  it('la función es llamada para permitir acceso', () => signInWithEmailAndPassword('auth', 'email', 'password')
    .then(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(signInWithEmailAndPassword.mock.calls[0][0]).toEqual('auth');
    }));
  it('si el usuario no existe la promesa es rechazada', () => signInWithEmailAndPassword()
    .catch(() => {
      expect(accesUser('', '')).toBeUndefined();
    }));
});

describe('Login', () => {
  it('Login es una función que contiene texto HTML', () => {
    expect(typeof Login().textContent).toBe('string');
  });
  it('si el correo o contraseña ingresado es invalido', () => {
    document.body.innerHTML = '<div id = "messageHide" ></div>';
    const result = Login();
    const email = result.querySelector('#txtUser');
    const password = result.querySelector('#txtPassword');
    email.value = 'aaaaaaa ';
    password.value = ' 4';
    const btnLogin = result.querySelector('#btnLogin');
    btnLogin.dispatchEvent(new Event('click'));
    const messageHide = document.getElementById('messageError');
    accesUserExist(email, password)
      .catch(() => {
        expect(messageHide.textContent).toBe('Usuario o contraseña no válido');
      });
  });
  it('buttonsignUp', () => {
    const result = Login();
    const buttonSignUp = result.querySelector('#buttonSignUp');
    buttonSignUp.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/register');
  });
  it('linkLogin', () => {
    const result = Login();
    const linkLogin = result.querySelector('#linkLogin');
    linkLogin.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/resetPassword');
  });
});
describe('signInWithPopup with Google', () => {
  it('La función es llamada y  permite el acceso al usuario', () => signInWithPopup(true)
    .then(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(signInWithPopup.mock.calls[0][0]).toEqual(true);
      expect(signInWithPopup.mock.calls[0][1]).toEqual(GoogleAuthProvider());
    }));
  it('si hay algun error al ingresar con google', () => {
    signGoogle()
      .catch(() => {
        expect(signGoogle).toMatch('error');
      });
  });
  it('access with Google', async () => {
    expect(typeof accesGoogle()).toBe('object');
  });
});

describe('createNewPassword', () => {
  it('createNewPassword tiene como resultado sendPasswordResetEmail() ', () => {
    expect(createNewPassword('holi@gmail.com')).toEqual(sendPasswordResetEmail());
  });
  it('la función al ser llamada permite el acceso', () => sendPasswordResetEmail()
    .then(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalled();
      expect(sendPasswordResetEmail.mock.calls[0][0]).toBe(getAuth());
      expect(sendPasswordResetEmail.mock.calls[0][1]).toEqual('holi@gmail.com');
    }));
  it('muestra el error si el email no es definido', () => createNewPassword()
    .catch(() => {
      expect(createNewPassword).toMatch('error');
    }));
});

describe('ResetPassword', () => {
  it('ResetPassword es una función que contiene texto HTML', () => {
    expect(typeof ResetPassword().textContent).toBe('string');
  });
  it('si el correo ingresado es invalido', () => {
    document.body.innerHTML = '<p id = "messageError" ></p>';
    const result = ResetPassword();
    const email = result.querySelector('#txtCorreo');
    email.value = 'aaaaaaa ';
    const btn = result.querySelector('#buttonResetPassword');
    btn.dispatchEvent(new Event('click'));
    const messageHideCorreo = document.getElementById('messageError');
    createNewPassword(email.value)
      .catch(() => {
        expect(messageHideCorreo.textContent).toBe('Tiene que ingresar un correo válido');
      });
  });
  it('buttonReturn', () => {
    const result = ResetPassword();
    const buttonReturn = result.querySelector('#buttonReturnReset');
    buttonReturn.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/feed');
  });
});

describe('signOut', () => {
  it(' closeSession itiene como resultado signOut', () => {
    expect(closeSession()).toEqual(signOut());
  });
  it(' el resultado de closeSession es un objeto', () => {
    expect(typeof closeSession()).toBe('object');
  });
  it('La función signOut es llamada correctamente', () => signOut()
    .then(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(signInWithPopup.mock.calls[0][0]).toEqual(true);
    }));
});
