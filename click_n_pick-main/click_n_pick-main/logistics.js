import {getGenericPassword} from 'react-native-keychain';
// const server = 'http://localhost:3001';
const server = 'https://click-n-pick-server.vercel.app';

module.exports = {
  VENDOR: 'VENDOR',

  CUSTOMER: 'CUSTOMER',

  getUser: async () => {
    try {
      const credentials = await getGenericPassword();
      if (credentials.password) {
        const res = await fetch(`${server}/auth`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: credentials.password + ' ' + credentials.username,
          },
        });

        const response = await res.json();
        console.log(response);
        if (response.success) {
          global.USER = {
            ...response.data,
            role: credentials.username,
            token: credentials.password,
          };
          return true;
        } else global.USER = false;
      }
    } catch (error) {
      console.log(error);
    }
  },

  getData: async route => {
    try {
      const res = await fetch(`${server}/${route}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: global?.USER?.token + ' ' + global?.USER?.role,
        },
      });

      const response = await res.json();
      console.log(response);
      if (response.success) return response.data;
      else return false;
    } catch (error) {
      console.log(error);
    }
  },

  postData: async (route, data) => {
    try {
      const credentials = await getGenericPassword();
      const res = await fetch(`${server}/${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: credentials.password + ' ' + credentials.username,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      console.log(response);
      if (response.success) return response.data;
      else return false;
    } catch (error) {
      console.log(error);
    }
  },

  putData: async (route, data) => {
    try {
      const res = await fetch(`${server}/${route}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: global?.USER?.token + ' ' + global?.USER?.role,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      console.log(response);
      if (response.success) return response.data;
      else return false;
    } catch (error) {
      console.log(error);
    }
  },

  deleteData: async route => {
    try {
      const res = await fetch(`${server}/${route}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: global?.USER?.token + ' ' + global?.USER?.role,
        },
      });

      const response = await res.json();
      console.log(response);
      if (response.success) return response.data;
      else return false;
    } catch (error) {
      console.log(error);
    }
  },
};
