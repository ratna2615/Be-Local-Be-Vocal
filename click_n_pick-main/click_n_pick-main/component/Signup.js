import React, {useState, useRef, useEffect} from 'react';
import {
  Alert,
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Animated,
} from 'react-native';
import HeadingBar from './HeadingBar';
import {CUSTOMER, VENDOR, postData, getUser} from '../logistics';
import RoleToggler from './RoleToggler';
import firebase from 'react-native-firebase';
import {setGenericPassword} from 'react-native-keychain';

const Signup = ({setAuthenticated, screens, toggleScreen}) => {
  const initialSignupDetails = {
      role: '',
      shopName: '',
      username: '',
      name: '',
      phone: '',
      city: '',
      state: '',
      pincode: '',
    },
    initialState = {
      warningText: '',
      buttonText: 'Send OTP',
      buttonActive: true,
      OTP: '',
      modalVisible: false,
      isVerified: false,
    },
    initialActive = {
      shopName: false,
      username: false,
      name: false,
      phone: false,
      city: false,
      state: false,
      pincode: false,
    };

  const [state, setState] = useState(initialState),
    [signupDetails, setSignupDetails] = useState(initialSignupDetails),
    [active, setActive] = useState(initialActive);

  const toggleRole = role => setSignupDetails({...signupDetails, role: role});

  const handleChange = (field, value) =>
    setSignupDetails({...signupDetails, [field]: value});
  const handleFocus = field => {
    setActive({...active, [field]: true});
    Animated.spring(levitating, {toValue: 38, useNativeDriver: false}).start();
    Animated.timing(fade, {
      toValue: 1,
      delay: 100,
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = field => {
    Animated.spring(levitating).reset();
    Animated.timing(fade).reset();
    setActive({...active, [field]: false});
  };

  const handlePincodeChange = async pincode => {
    if (pincode.length === 6) {
      setSignupDetails({
        ...signupDetails,
        pincode: pincode,
        state: 'Locating State...',
        city: 'Locating City...',
      });
      try {
        const res = await fetch(
          'https://api.postalpincode.in/pincode/' + pincode,
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
          },
        );
        const location = await res.json();
        if (location[0].PostOffice)
          setSignupDetails({
            ...signupDetails,
            pincode: pincode,
            state: location[0]?.PostOffice[0]?.State,
            city: location[0]?.PostOffice[0]?.District,
          });
        else {
          setState({...state, warningText: 'Invalid Pincode!'});
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setSignupDetails({
        ...signupDetails,
        pincode: pincode,
        state: '',
        city: '',
      });
    }
  };

  const setWarning = warning => setState({...state, warningText: warning});

  const validate = () => {
    const {role, shopName, username, name, phone, city, state, pincode} =
      signupDetails;
    if (!role.length) setWarning('Please Select Role!');
    else if (phone.length != 10) setWarning('Invalid Phone number!');
    else if (role === VENDOR && !username.length)
      setWarning('Please Select Username!');
    else if (!pincode.length) setWarning('Please Enter Pincode!');
    else if (!city.length) setWarning('Please Enter Pincode!');
    else if (!state.length) setWarning('Please Enter Pincode!');
    else if (role === VENDOR && !shopName.length)
      setWarning('Please Enter Shop Name!');
    else if (role === CUSTOMER && !name.length)
      setWarning('Please Enter Name!');
    else return true;
    return false;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setState({...state, buttonText: 'Sending...', buttonActive: false});

      firebase
        .auth()
        .signInWithPhoneNumber('+91 ' + signupDetails.phone)
        .then(comparator => {
          ToastAndroid.show('OTP Sent!', ToastAndroid.SHORT);
          setState({
            ...state,
            comparator,
            modalVisible: true,
            buttonText: 'Send OTP',
          });
        })
        .catch(error => {
          console.log(error);
          setState({
            ...state,
            warningText: error.message,
            buttonActive: true,
            buttonText: 'Send OTP',
          });
        });
    }
  };

  const onVerified = async () => {
    ToastAndroid.show('OTP verified :)', ToastAndroid.SHORT);
    setState({
      ...state,
      isVerified: true,
      modalVisible: false,
    });
    try {
      const token = await firebase.auth().currentUser.getIdToken();
      console.log(token);
      await setGenericPassword(signupDetails.role, token);
      const res = await postData('auth/signup', signupDetails);
      console.log(res);
      if (res) {
        await setGenericPassword(signupDetails.role, res);
        const res2 = await getUser();
        if (res2) setAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOTP = () => {
    const user = firebase.auth().currentUser;
    if (user) return onVerified();
    const {OTP, comparator} = state;

    if (!comparator) setState(initialState);
    else if (!OTP.length) setState({...state, warningText: 'Enter OTP!'});
    else
      comparator
        .confirm(OTP)
        .then(async () => onVerified())
        .catch(error => {
          ToastAndroid.show('Invalid OTP :(', ToastAndroid.SHORT);
          setState({
            ...state,
            warningText: `Code Confirm Error: ${error.message}`,
          });
        });
  };

  //animations
  const levitating = useRef(new Animated.Value(10)).current;
  const fade = useRef(new Animated.Value(0.1)).current;
  const load = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    Animated.spring(load, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    return () => {
      setSignupDetails({});
      setState({});
    };
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={{backgroundColor: '#fff'}}>
      <Animated.View style={{left: load}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setState({...state, modalVisible: false});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Enter OTP"
                keyboardType="phone-pad"
                onChangeText={value => setState({...state, OTP: value})}
                style={styles.otpInput}
                value={state.OTP} //65055 51234
              />
              <Pressable
                style={[styles.modalButton, styles.buttonOpen]}
                onPress={verifyOTP}>
                <Text style={styles.textStyle}>Verify</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setState({...state, modalVisible: false})}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <HeadingBar
          leftText={'          '}
          title={'Sign Up'}
          rightText={'Login'}
          rightAction={() => toggleScreen(screens.LOGIN)}
        />
        <View style={styles.formContainer}>
          <RoleToggler role={signupDetails.role} toggleRole={toggleRole} />
          {signupDetails.role !== VENDOR ? (
            <View
              style={[
                styles.inputBox,
                active.name ? styles.inputBoxActive : null,
              ]}>
              {active.name ? (
                <Animated.Text
                  style={[
                    styles.inputHeader,
                    {
                      bottom: levitating,
                      opacity: fade,
                    },
                  ]}>
                  Name
                </Animated.Text>
              ) : null}
              <TextInput
                placeholder="Name"
                textContentType="name"
                onChangeText={value => handleChange('name', value)}
                value={signupDetails.name}
                style={styles.textInput}
                onFocus={() => handleFocus('name')}
                onBlur={() => handleBlur('name')}
              />
            </View>
          ) : (
            <View
              style={[
                styles.inputBox,
                active.username ? styles.inputBoxActive : null,
              ]}>
              {active.username ? (
                <Animated.Text
                  style={[
                    styles.inputHeader,
                    {
                      bottom: levitating,
                      opacity: fade,
                    },
                  ]}>
                  Username
                </Animated.Text>
              ) : null}
              <TextInput
                placeholder="Username"
                textContentType="name"
                onChangeText={value => handleChange('username', value)}
                value={signupDetails.username}
                style={styles.textInput}
                onFocus={() => handleFocus('username')}
                onBlur={() => handleBlur('username')}
              />
            </View>
          )}
          {signupDetails.role === VENDOR ? (
            <View
              style={[
                styles.inputBox,
                active.shopName ? styles.inputBoxActive : null,
              ]}>
              {active.shopName ? (
                <Animated.Text
                  style={[
                    styles.inputHeader,
                    {
                      bottom: levitating,
                      opacity: fade,
                    },
                  ]}>
                  Shop Name
                </Animated.Text>
              ) : null}
              <TextInput
                placeholder="Shop Name"
                onChangeText={value => handleChange('shopName', value)}
                value={signupDetails.shopName}
                style={styles.textInput}
                onFocus={() => handleFocus('shopName')}
                onBlur={() => handleBlur('shopName')}
              />
            </View>
          ) : null}
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
              value={signupDetails.phone}
              style={styles.textInput}
              onFocus={() => handleFocus('phone')}
              onBlur={() => handleBlur('phone')}
            />
          </View>
          <View
            style={[
              styles.inputBox,
              active.pincode ? styles.inputBoxActive : null,
            ]}>
            {active.pincode ? (
              <Animated.Text
                style={[
                  styles.inputHeader,
                  {
                    bottom: levitating,
                    opacity: fade,
                  },
                ]}>
                Pincode
              </Animated.Text>
            ) : null}
            <TextInput
              placeholder="Pincode"
              keyboardType="number-pad"
              onChangeText={handlePincodeChange}
              value={signupDetails.pincode}
              style={styles.textInput}
              onFocus={() => handleFocus('pincode')}
              onBlur={() => handleBlur('pincode')}
            />
          </View>

          <View
            style={[
              styles.inputBox,
              active.city ? styles.inputBoxActive : null,
            ]}>
            {active.city ? (
              <Animated.Text
                style={[
                  styles.inputHeader,
                  {
                    bottom: levitating,
                    opacity: fade,
                  },
                ]}>
                City
              </Animated.Text>
            ) : null}
            <TextInput
              placeholder="City"
              value={signupDetails.city}
              style={styles.textInput}
              onChangeText={value => handleChange('city', value)}
              onFocus={() => handleFocus('city')}
              onBlur={() => handleBlur('city')}
            />
          </View>

          <View
            style={[
              styles.inputBox,
              active.state ? styles.inputBoxActive : null,
            ]}>
            {active.state ? (
              <Animated.Text
                style={[
                  styles.inputHeader,
                  {
                    bottom: levitating,
                    opacity: fade,
                  },
                ]}>
                State
              </Animated.Text>
            ) : null}
            <TextInput
              placeholder="State"
              value={signupDetails.state}
              style={styles.textInput}
              onChangeText={value => handleChange('state', value)}
              onFocus={() => handleFocus('state')}
              onBlur={() => handleBlur('state')}
            />
          </View>

          {state.warningText ? (
            <Text style={styles.warningText}>{state.warningText}</Text>
          ) : null}

          <View style={styles.navigateContainer}>
            <TouchableOpacity>
              <TouchableHighlight>
                <Text
                  style={styles.navigate}
                  onPress={() => toggleScreen(screens.LOGIN)}>
                  Already have an account?
                </Text>
              </TouchableHighlight>
            </TouchableOpacity>
          </View>
          <View style={styles.navigateContainer}>
            <Pressable
              onPress={handleSubmit}
              style={styles.button}
              android_ripple={{color: '#5DB075bb'}}>
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
  //MODAL
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    paddingHorizontal: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    margin: 5,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  buttonOpen: {
    marginTop: 15,
    paddingHorizontal: 50,
    backgroundColor: '#5DB075',
  },
  buttonClose: {
    paddingHorizontal: 30,
    backgroundColor: '#EA3535',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpInput: {
    borderBottomColor: '#5DB075',
    borderBottomWidth: 2,
    paddingVertical: 1,
  },
});

export default Signup;
