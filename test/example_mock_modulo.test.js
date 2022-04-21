test('first example', () => {
  const myMock = jest.fn() /* nos va a retonar un mock */
    .mockReturnValueOnce(true)
    .mockReturnValueOnce('hello world')
    .mockReturnValueOnce(5);

  console.log(myMock);

  const result1 = myMock();
  const result2 = myMock();
  const result3 = myMock();

  // eslint-disable-next-line max-len
  expect(myMock).toHaveBeenCalledTimes(3); /* nos va a decir cuantos veces vamos a llamar a la funcion */

  expect(result1).toBe(true);
  expect(result2).toBe('hello world');
  expect(result3).toBe(5);
});
