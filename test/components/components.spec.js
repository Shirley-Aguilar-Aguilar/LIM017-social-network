import { headerTemplate } from '../../src/components/Header.js';
import { Profile } from '../../src/components/Profile.js';
import { Register } from '../../src/components/Register.js';
import { Configurar } from '../../src/components/Configurar.js';
import f from '../../src/lib/functions.js';
import { publicationBeforeTemplate } from '../../src/components/PublicationBefore.js';

jest.mock('../../src/lib/imports/firebase-imports.js');

test('use jsdom in this test file', () => {
  const root = document.getElementById('root');
  expect(root).not.toBeNull();
});

describe('Profile', () => {
  it('función que contiene texto HTML', () => {
    expect(typeof Profile().textContent).toBe('string');
  });
});

/* REGISTER */

describe('Register', () => {
  it('función que contiene texto HTML', () => {
    expect(typeof Register().textContent).toBe('string');
  });
});

describe('mostrar y ocultar el password', () => {
  it('Mostrar password', () => {
    const result = Register();
    const icoEye = result.querySelector('#icoEyeHide');
    icoEye.className = 'ico-eye-hide';
    const inputPassword = result.querySelector('#inputPassword');
    icoEye.dispatchEvent(new Event('click'));
    expect(icoEye.className).toBe('ico-eye');
    expect(inputPassword.type).toBe('text');
  });
  it('Ocultar password', () => {
    const result = Register();
    const icoEye = result.querySelector('#icoEyeHide');
    icoEye.className = 'ico-eye';
    const inputPassword = result.querySelector('#inputPassword');
    icoEye.dispatchEvent(new Event('click'));
    expect(icoEye.className).toBe('ico-eye-hide');
    expect(inputPassword.type).toBe('password');
  });
});

describe('mostrar y ocultar el password de confirmación', () => {
  it('Mostrar password de confirmación', () => {
    const result = Register();
    const icoEyeConfirm = result.querySelector('#icoEyeConfirm');
    icoEyeConfirm.className = 'ico-eye-hide';
    const inputPasswordConfirm = result.querySelector('#inputConfirmPassword');
    icoEyeConfirm.dispatchEvent(new Event('click'));
    expect(icoEyeConfirm.className).toBe('ico-eye');
    expect(inputPasswordConfirm.type).toBe('text');
  });
  it('Ocultar password de confirmación', () => {
    const result = Register();
    const icoEyeConfirm = result.querySelector('#icoEyeConfirm');
    icoEyeConfirm.className = 'ico-eye';
    const inputPasswordConfirm = result.querySelector('#inputConfirmPassword');
    icoEyeConfirm.dispatchEvent(new Event('click'));
    expect(icoEyeConfirm.className).toBe('ico-eye-hide');
    expect(inputPasswordConfirm.type).toBe('password');
  });
});

describe('Validar gmail en el registro', () => {
  it('si el gmail es válido la función retorna true', () => {
    const result = Register();
    const inputEmail = result.querySelector('#inputEmail');
    const divEmailHide = result.querySelector('#messageHide');
    inputEmail.value = 'some@gmail.com';
    inputEmail.dispatchEvent(new Event('keyup'));
    expect(divEmailHide.style.display).toBe('none');
    expect(f.validyEmail(inputEmail.value)).toBe(true);
  });
  it('si el gmail es invalido muestra mensaje de error', () => {
    const result = Register();
    const inputEmail = result.querySelector('#inputEmail');
    const divEmailHide = result.querySelector('#messageHide');
    inputEmail.value = 'some';
    inputEmail.dispatchEvent(new Event('keyup'));
    expect(divEmailHide.style.display).toBe('block');
    expect(f.validyEmail(inputEmail.value)).toBe(false);
  });
});

describe('Validar password ', () => {
  it('si password es < 6 caracteres muestra mensaje de error ', () => {
    const result = Register();
    const inputPassword = result.querySelector('#inputPassword');
    inputPassword.value = '12345';
    const descSecurityCant = result.querySelector('#descSecurityCant');
    inputPassword.dispatchEvent(new Event('keyup'));
    expect(descSecurityCant.innerHTML).toBe('Min(6): <img src="img/false.png">');
  });
  it('si password es > 6 caracteres muestra imagen de check ', () => {
    const result = Register();
    const inputPassword = result.querySelector('#inputPassword');
    inputPassword.value = '1234567';
    const descSecurityCant = result.querySelector('#descSecurityCant');
    inputPassword.dispatchEvent(new Event('keyup'));
    expect(descSecurityCant.innerHTML).toBe('Min(6): <img src="img/check.png">');
  });
});

describe('mensajes de error con datos invalidos antes de registrarse', () => {
  const result = Register();
  const inputName = result.querySelector('#inputName');
  const buttonRegister = result.querySelector('#buttonForm');
  const textMessageIncorrect = result.querySelector('#textMessageIncorrect');
  const inputEmail = result.querySelector('#inputEmail');
  const inputPassword = result.querySelector('#inputPassword');
  const inputPasswordConfirm = result.querySelector('#inputConfirmPassword');
  it('mensaje de error del nombre ', () => {
    inputName.value = '';
    buttonRegister.dispatchEvent(new Event('click'));
    expect(textMessageIncorrect.innerText).toBe('Nombre invalido');
  });
  it('mensaje de error del correo  ', () => {
    inputName.value = 'someone';
    inputEmail.value = 'some';
    buttonRegister.dispatchEvent(new Event('click'));
    expect(textMessageIncorrect.innerText).toBe('Correo invalido');
  });
  it('mensaje de error del password  ', () => {
    inputName.value = 'someone';
    inputEmail.value = 'some@gmail.com';
    inputPassword.value = '123';
    buttonRegister.dispatchEvent(new Event('click'));
    expect(textMessageIncorrect.innerText).toBe('Contraseña invalida / (min: 6) ');
  });
  it('mensaje de error de la confirmación del password  ', () => {
    inputName.value = 'someone';
    inputEmail.value = 'some@gmail.com';
    inputPassword.value = 'pasword1';
    inputPasswordConfirm.value = 'pasword2';
    buttonRegister.dispatchEvent(new Event('click'));
    expect(textMessageIncorrect.innerText).toBe('Confirmar contraseña diferente');
  });
  it('si todos los datos son válidos', () => {
    inputName.value = 'someone';
    inputEmail.value = 'some@gmail.com';
    inputPassword.value = 'pasword1';
    inputPasswordConfirm.value = 'pasword1';
    buttonRegister.dispatchEvent(new Event('click'));
    expect(buttonRegister.dispatchEvent(new Event('click'))).toBe(true);
  });
});

/* HEADER */
describe('headerTemplate', () => {
  it('función que contiene texto HTML', () => {
    expect(typeof headerTemplate().textContent).toBe('string');
  });
  it(' HTML', () => {
    expect(typeof headerTemplate()).toBe('object');
  });
});

describe('Evento que oculta y muestra la barra de navegación', () => {
  it('ocultar y mostrar barra de navegación', () => {
    const result = headerTemplate();
    const imgLines = result.querySelector('#navLines');
    const optionsNav = result.querySelector('#optionsNav');
    imgLines.dispatchEvent(new Event('click'));
    expect(optionsNav.style.display).toBe('block');
    imgLines.dispatchEvent(new Event('click'));
    expect(optionsNav.style.display).toBe('none');
  });
});

describe('eventos click para cambiar de vista', () => {
  it('aConfig', () => {
    const result = headerTemplate();
    const aConfig = result.querySelector('#aConfig');
    aConfig.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/configurar');
  });
  it('aClose', () => {
    const result = headerTemplate();
    const aClose = result.querySelector('#aClose');
    expect(aClose.dispatchEvent(new Event('click'))).toBe(true);
  });
  it('aPhoto', () => {
    const result = headerTemplate();
    const aPhoto = result.querySelector('#aPhoto');
    aPhoto.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/profile');
  });
  it('imgComputer', () => {
    const result = headerTemplate();
    const imgComputer = result.querySelector('.logo-computer');
    imgComputer.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/feed');
  });
  it('figcaptionName', () => {
    const result = headerTemplate();
    const figcaptionName = result.querySelector('.figcaption-name');
    figcaptionName.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/profile');
  });
  it('aWall', () => {
    const result = headerTemplate();
    const aWall = result.querySelector('#aWall');
    aWall.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/feed');
  });
});

/* PUBLICATION BEFORE */

describe('publicationBeforeTemplate', () => {
  it('función que contiene texto HTML', () => {
    expect(typeof publicationBeforeTemplate().textContent).toBe('string');
  });
});

describe('evento click para que aparezcan los emoji en el divText', () => {
  it('cuando no se agrega ningun emoji en el texto', () => {
    document.body.innerHTML = '<div id ="divText"></div>';
    const divText = document.querySelector('#divText');
    const result = publicationBeforeTemplate();
    const emojiIco = result.querySelector('#emojiIco');
    emojiIco.dispatchEvent(new Event('click'));
    divText.focus();
    const pasteHtmlAtCaret = f.pasteHtmlAtCaret('<img class="emoticon" src="img/emoji/emoji1.png">');
    expect(pasteHtmlAtCaret).toBe(false);
    expect(divText.textContent).toBe('');
  });
});

describe('evento click para publicar', () => {
  it('brinda mensaje de error si la publicación es vacia', () => {
    document.body.innerHTML = '<div id ="messageTitleText"></div>';
    const result = publicationBeforeTemplate();
    const title = result.querySelector('#divTitle');
    const text = result.querySelector('#divText');
    const btn = result.querySelector('#buttonPublication');
    title.innerHTML = '';
    text.innerHTML = '';
    btn.dispatchEvent(new Event('click'));
    const messageTitleText = result.querySelector('#messageTitleText');
    expect(messageTitleText.innerText).toBe('No se puede publicar título o texto vacío.');
    title.innerHTML = 'Title';
    text.innerHTML = 'Text';
    btn.dispatchEvent(new Event('click'));
  });
  it('si no es publicación vacia retorna true', () => {
    const result = publicationBeforeTemplate();
    const title = result.querySelector('#divTitle');
    const text = result.querySelector('#divText');
    const btn = result.querySelector('#buttonPublication');
    title.innerText = 'Tips para programadores';
    text.innerText = '5 tips que deberias saber';
    expect(btn.dispatchEvent(new Event('click'))).toBe(true);
  });
});

describe('evento para mostrar y ocultar div de emoticons', () => {
  it('con el evento click se oculta y aparece el contenedor', () => {
    const result = publicationBeforeTemplate();
    const divEmoticons = result.querySelector('#divEmoticons');
    const buttonEmoticon = result.querySelector('#buttonEmoticon');
    buttonEmoticon.dispatchEvent(new Event('click'));
    expect(divEmoticons.style.display).toBe('grid');
    buttonEmoticon.dispatchEvent(new Event('click'));
    expect(divEmoticons.style.display).toBe('none');
  });
});

describe('evento para mostrar y ocultar el input para subir imagenes en las publicaciones', () => {
  it('con el evento click se oculta y aparece el input', () => {
    const result = publicationBeforeTemplate();
    const divUploader = result.querySelector('#divUploader');
    const buttonshareImage = result.querySelector('#shareImage');
    buttonshareImage.dispatchEvent(new Event('click'));
    expect(divUploader.style.display).toBe('flex');
    buttonshareImage.dispatchEvent(new Event('click'));
    expect(divUploader.style.display).toBe('none');
  });
});
/* describe('evento para capturar evento para subir imagen', () => {
  it('con el evento change para capturar image', () => {
    const result = publicationBeforeTemplate();
    const imageUploader = result.querySelector('#imgUploader');
    const divChangeLogoDisplay = result.querySelector('#divChangeLogoDisplay');
    const e = new Event('change');
    imageUploader.dispatchEvent(e);
    expect(divChangeLogoDisplay.style.display).toBe('block');
  });
}); */

/* CONFIGURAR */
describe('Configurar', () => {
  it('Configurar es una función que contiene texto HTML', () => {
    expect(typeof Configurar().textContent).toBe('string');
  });
  it('buttonReturn', () => {
    const result = Configurar();
    const buttonReturn = result.querySelector('#buttonReturn');
    buttonReturn.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toBe('/feed');
  });
});
