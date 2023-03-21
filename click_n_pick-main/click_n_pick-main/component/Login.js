import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import {setGenericPassword} from 'react-native-keychain';
import HeadingBar from './HeadingBar';
import {getUser, postData} from '../logistics';
import RoleToggler from './RoleToggler';
import firebase from 'react-native-firebase';

const Login = ({screens, toggleScreen, setAuthenticated}) => {
  const initialLoginState = {
      role: '',
      phone: '',
      OTP: '',
    },
    initialState = {
      warningText: '',
      buttonText: 'Send OTP',
      buttonActive: true,
      otpGenerated: false,
    },
    initialActive = {
      phone: false,
      OTP: false,
    };

  const [state, setState] = useState(initialState),
    [loginDetails, setLoginDetails] = useState(initialLoginState),
    [active, setActive] = useState(initialActive);

  const toggleRole = role => setLoginDetails({...loginDetails, role: role});

  const handleChange = (field, value) =>
    setLoginDetails({...loginDetails, [field]: value});

  const setWarning = warning => setState({...state, warningText: warning});

  const handleFocus = field => {
    setActive({...active, [field]: true});
    Animated.spring(levitating, {toValue: 38, useNativeDriver: false}).start();
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = field => {
    Animated.spring(levitating).reset();
    Animated.timing(fade).reset();
    setActive({...active, [field]: false});
  };

  const validateRole = () => {
    const {role} = loginDetails;
    if (!role.length) setWarning('Please Select Role!');
    else return true;
    return false;
  };

  const validate = () => {
    const {OTP, phone} = loginDetails;

    if (!validateRole()) return false;
    else if (phone.length != 10) setWarning('Invalid Phone number!');
    else if (OTP.length < 1) setWarning('Please Enter OTP!');
    else return true;
    return false;
  };

  const sendOTP = async () => {
    firebase
      .auth()
      .signInWithPhoneNumber('+91 ' + loginDetails.phone)
      .then(confirmResult => {
        setState({
          ...state,
          warningText: '',
          confirmResult,
          otpGenerated: true,
          buttonText: 'Verify OTP',
          buttonActive: true,
        });
      })
      .catch(error => {
        console.log('here', error);
        setState({
          ...state,
          warningText: error.message,
          buttonActive: true,
          buttonText: 'Send OTP',
        });
      });
  };

  const onVerified = async () => {
    setState({
      ...state,
      buttonText: 'Logging In...',
    });
    try {
      const token = await firebase.auth().currentUser.getIdToken();
      await setGenericPassword(loginDetails.role, token);
      const res = await postData('auth/login', {
        ...loginDetails,
        phone: '+91' + loginDetails.phone,
      });
      if (res) {
        console.log(res);
        await setGenericPassword(loginDetails.role, res);
        const res2 = await getUser();
        if (res2) setAuthenticated(true);
      }
      if (res) {
        setState({buttonText: 'Welcome :)'});
        setAuthenticated(true);
      } else {
        console.log('here');
        setState({
          ...state,
          warningText: 'Something Went Wrong!',
          otpGenerated: false,
          buttonActive: true,
          buttonText: 'Send OTP',
        });
      }
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        warningText: 'Something Went Wrong!',
        otpGenerated: false,
        buttonActive: true,
        buttonText: 'Send OTP',
      });
    }
  };

  const confirmOTP = async () => {
    const user = firebase.auth().currentUser;
    if (user) return onVerified();
    const {confirmResult} = state;
    const {OTP} = loginDetails;

    if (confirmResult && OTP.length) {
      confirmResult
        .confirm(OTP)
        .then(async user => onVerified())
        .catch(error => {
          console.log(error);
          setState({
            ...state,
            warningText: error.message,
            otpGenerated: false,
            buttonActive: true,
            buttonText: 'Send OTP',
          });
        });
    }
  };

  const handleSubmit = async () => {
    if (loginDetails.phone?.length != 10) {
      setWarning('Invalid Phone number!');
      return;
    }
    if (!state.otpGenerated) {
      setState({...state, buttonActive: false, buttonText: 'Sending...'});
      await sendOTP();
      return;
    }
    if (validate() && state.buttonActive) {
      setState({...state, buttonActive: false, buttonText: 'Verifying...'});
      confirmOTP();
    }
  };
  //animations
  const levitating = useRef(new Animated.Value(10)).current;
  const fade = useRef(new Animated.Value(0.1)).current;
  const load = useRef(new Animated.Value(-500)).current;
  const [hidePass, setHidePass] = useState(true);

  useEffect(() => {
    Animated.spring(load, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    return () => {
      setLoginDetails({});
      setState({});
    };
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={{backgroundColor: '#fff'}}>
      <Animated.View style={{right: load}}>
        <HeadingBar
          leftText={'          '}
          title={'Log In'}
          rightText={'Sign Up'}
          rightAction={() => toggleScreen(screens.SIGNUP)}
        />
        <View style={styles.formContainer}>
          <RoleToggler role={loginDetails.role} toggleRole={toggleRole} />
          <View
            style={[
              styles.inputBox,
              active.phone ? styles.inputBoxActive : null,
            ]}>
            {active.phone ? (
              <Animated.Text
                style={[
                  styles.inputHeader,
                  {
                    bottom: levitating,
                    opacity: fade,
                  },
                ]}>
                Phone
              </Animated.Text>
            ) : null}
            <TextInput
              placeholder="Phone"
              textContentType="username"
              onChangeText={value => handleChange('phone', value)}
              value={loginDetails.phone}
              style={styles.textInput}
              onFocus={() => handleFocus('phone')}
              onBlur={() => handleBlur('phone')}
            />
          </View>
          {state.otpGenerated ? (
            <View
              style={[
                styles.inputBox,
                active.OTP ? styles.inputBoxActive : null,
              ]}>
              {active.OTP ? (
                <Animated.Text
                  style={[
                    styles.inputHeader,
                    {
                      bottom: levitating,
                      opacity: fade,
                    },
                  ]}>
                  OTP
                </Animated.Text>
              ) : null}
              <TextInput
                placeholder="Enter OTP"
                secureTextEntry={hidePass ? true : false}
                onChangeText={value => handleChange('OTP', value)}
                value={loginDetails.OTP}
                style={styles.textInput}
                onFocus={() => handleFocus('OTP')}
                onBlur={() => handleBlur('OTP')}
              />
              <View style={{paddingRight: 10}}>
                <Text
                  style={{color: '#5DB075', fontWeight: 'bold'}}
                  onPress={() => setHidePass(!hidePass)}>
                  {hidePass ? 'Show' : 'Hide'}
                </Text>
              </View>
            </View>
          ) : null}

          {state.warningText ? (
            <Text style={styles.warningText}>{state.warningText}</Text>
          ) : null}

          <View style={styles.navigateContainer}>
            <TouchableHighlight>
              <Text
                style={styles.navigate}
                onPress={() => toggleScreen(screens.SIGNUP)}>
                Don't have an account?
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.navigateContainer}>
            <Pressable onPress={handleSubmit} style={styles.button}>
              <Text style={styles.text}>{state.buttonText}</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    paddingVertical: 40,
  },
  inputBox: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#E8E8E888',
    margin: 10,
    borderRadius: 10,
  },
  inputBoxActive: {
    borderColor: '#5DB075',
    borderWidth: 2,
    elevation: 5,
    shadowColor: '#5DB075',
    backgroundColor: '#fff',
  },
  inputHeader: {
    position: 'absolute',
    left: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 2,
    color: '#5DB075',
  },
  navigateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  navigate: {
    fontSize: 15,
    marginTop: 8,
    marginHorizontal: 15,
    color: '#5DB075',
  },
  button: {
    padding: 10,
    paddingHorizontal: 100,
    backgroundColor: '#5DB075',
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    color: '#eee',
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
  },
  warningText: {
    fontSize: 15,
    color: 'orange',
    paddingHorizontal: 15,
  },
});

export default Login;
