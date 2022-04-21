import { storage } from './storage.js';
// eslint-disable-next-line spaced-comment
/* export const users = () => {
  // aqui tu codigo
  getUser();
};*/

export const saveUsername = (username) => {
  storage.save({ key: 'username', value: username });
};

// eslint-disable-next-line arrow-body-style
export const getUsername = () => {
  return storage.get({ key: 'username' });
};
