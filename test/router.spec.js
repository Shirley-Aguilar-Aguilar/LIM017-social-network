import { onNavigate, routes, elementRoot } from '../src/Router';

jest.mock('../src/lib/imports/firebase-imports.js');

const viewTest = () => {
  const testContainer = document.createElement('section');
  testContainer.innerHTML = 'I am a view test!';

  return testContainer;
};

routes['/ruta-1'] = viewTest;

describe('Router', () => {
  it('onNavigate carga la ruta correcta ', () => {
    onNavigate('/ruta-1');
    expect(window.location.pathname).toBe('/ruta-1');
  });
  it('onNavigate carga la vista correcta ', () => {
    elementRoot();
    onNavigate('/ruta-1');
    expect(document.getElementById('root').firstChild.innerHTML).toBe('I am a view test!');
  });
});
