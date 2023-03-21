import React, {useState} from 'react';
import Signup from '../component/Signup';
import Login from '../component/Login';
import PasswordReset from './PasswordReset';

const screens = {
  SIGNUP: 'SIGNUP',
  LOGIN: 'LOGIN',
  PASSWORD_RESET: 'PASSWORD_RESET',
};

const Authentication = ({setAuthenticated}) => {
  const [screen, setScreen] = useState(screens.SIGNUP);
  const [role, setRole] = useState('');
  const toggleScreen = (toScreen, role) => {
    setRole(role);
    setScreen(toScreen);
  };
  if (screen === screens.SIGNUP)
    return (
      <Signup
        screens
        toggleScreen={toggleScreen}
        setAuthenticated={setAuthenticated}
      />
    );
  else if (screen === screens.PASSWORD_RESET)
    return (
      <PasswordReset
        screens={screens}
        toggleScreen={toggleScreen}
        role={role}
      />
    );
  else
    return (
      <Login
        screens={screens}
        role={role}
        setAuthenticated={setAuthenticated}
        toggleScreen={toggleScreen}
      />
    );
};

export default Authentication;
