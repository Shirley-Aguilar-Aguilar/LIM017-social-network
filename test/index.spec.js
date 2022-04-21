// importamos la funcion que vamos a testear
// eslint-disable-next-line import/no-unresolved
import { myFunction } from '../lib/index.js';

describe('myFunction', () => {
  it('debería ser una función', () => {
    expect(typeof myFunction).toBe('function');
  });
});
