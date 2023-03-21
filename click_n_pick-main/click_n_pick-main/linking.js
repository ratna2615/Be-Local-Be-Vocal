const config = {
  screens: {
    Profile: {
      path: 'profile/:id',
      parse: {
        id: id => `${id}`,
      },
    },
    PasswordReset: {
      path: 'passwordreset/:token',
      parse: {
        token: token => `${token}`,
      },
    },
  },
};

const linking = {
  prefixes: ['https://click-n-pick.com/', 'click-n-pick://'],
  config,
};

export default linking;
