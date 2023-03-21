import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import HeadingBar from '../component/HeadingBar';
import React, {useState, useEffect} from 'react';

const PasswordReset = ({toggleScreen, role, screens}) => {
  const initialResetState = {
      role: role,
      phone: '',
      cnfPassword: '',
      password: '',
    },
    initialState = {
      answer1: '',
      answer2: '',
      answer3: '',
      message: '',
      isVerified: false,
      warningText: '',
    };

  const [state, setState] = useState(initialState),
    [resetDetails, setResetDetails] = useState(initialResetState),
    [hidePass, setHidePass] = useState(true),
    [cnfhidePass, setcnfHidePass] = useState(true);

  const handleAnswer = (field, value) =>
    setState({...initialState, [field]: value});
  const handleChange = (field, value) =>
    setResetDetails({...resetDetails, [field]: value});

  const setWarning = warning => setState({...state, warningText: warning});

  //validating phone
  const validate = () => {
    const {phone, password, cnfPassword} = resetDetails;
    if (phone.length != 10) setWarning('Invalid Phone number!');
    else if (password.length < 6)
      setWarning('Password Length should be 6 at least!');
    else if (password !== cnfPassword)
      setWarning('Password and Confirm Password should be the same!');
    else return true;
    return false;
  };

  //Verification text
  const confirmAnswer = () => {
    const {phone} = resetDetails;
    if (phone.length != 10) {
      setWarning('Invalid Phone number!');
      return;
    }
    let questionNumber, answer;

    if (state?.answer1?.length) {
      questionNumber = 1;
      answer = state.answer1;
    } else if (state?.answer2?.length) {
      questionNumber = 2;
      answer = state.answer2;
    } else if (state?.answer3?.length) {
      questionNumber = 3;
      answer = state.answer3;
    } else {
      setState({
        ...state,
        warningText: 'Please Enter any one Security Answer!',
      });
      return;
    }

    setState({...state, isVerified: true});
  };

  //navigating back
  const handleSubmit = async () => {
    let questionNumber, answer;

    if (state?.answer1?.length) {
      questionNumber = 1;
      answer = state.answer1;
    } else if (state?.answer2?.length) {
      questionNumber = 2;
      answer = state.answer2;
    } else {
      questionNumber = 3;
      answer = state.answer3;
    }
    if (validate()) {
      setState({
        ...state,
        warningText: '',
      });
      // const res = await postData('auth/passwordreset', {
      //   ...resetDetails,
      //   questionNumber: questionNumber,
      //   answer: answer,
      // });

      // if (res) toggleScreen(screens.LOGIN, resetDetails.role);
      if (true) toggleScreen(screens.LOGIN, resetDetails.role);
      else
        setState({
          ...initialState,
          warningText: 'Something went wrong!',
        });
    }
  };
  useEffect(() => {
    // console.log(route.token);
  }, []);

  return (
    <View>
      <HeadingBar title={'Password Reset'} />
      <View style={styles.formContainer}>
        <>
          <Text style={{paddingLeft: 10, marginBottom: 5}}>
            Associated phone number:
          </Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Phone"
              textContentType="username"
              keyboardType="phone-pad"
              onChangeText={value => handleChange('phone', value)}
              value={resetDetails.phone}
              style={styles.textInput}
            />
          </View>
          {!state.isVerified ? (
            <>
              <View style={{marginTop: 15}}>
                <Text style={{paddingLeft: 10, marginBottom: 5}}>
                  Select only one security question:
                </Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="What was your first pay?"
                    onChangeText={value => handleAnswer('answer1', value)}
                    editable={state.isEditable}
                    value={resetDetails.answer1}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="What is your lucky number?"
                    onChangeText={value => handleAnswer('answer2', value)}
                    value={resetDetails.answer2}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="What was your roll number in school?"
                    onChangeText={value => handleAnswer('answer3', value)}
                    value={resetDetails.answer3}
                    style={styles.textInput}
                  />
                </View>
              </View>
              {state.warningText ? (
                <Text style={styles.warningText}>{state.warningText}</Text>
              ) : null}
              <View style={styles.navigateContainer}>
                <Pressable
                  onPress={() => confirmAnswer()}
                  style={styles.button}
                  android_ripple={{color: '#5DB075bb'}}>
                  <Text style={styles.text}>Confirm answer</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={hidePass ? true : false}
                  onChangeText={value => handleChange('password', value)}
                  value={resetDetails.password}
                  style={styles.textInput}
                />
                <View style={{paddingRight: 10}}>
                  <Text
                    style={{color: '#5DB075', fontWeight: 'bold'}}
                    onPress={() => setHidePass(!hidePass)}>
                    {hidePass ? 'Show' : 'Hide'}
                  </Text>
                </View>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={cnfhidePass ? true : false}
                  onChangeText={value => handleChange('cnfPassword', value)}
                  value={resetDetails.cnfPassword}
                  style={styles.textInput}
                />
                <View style={{paddingRight: 10}}>
                  <Text
                    style={{color: '#5DB075', fontWeight: 'bold'}}
                    onPress={() => setcnfHidePass(!cnfhidePass)}>
                    {cnfhidePass ? 'Show' : 'Hide'}
                  </Text>
                </View>
              </View>
              {state.warningText ? (
                <Text style={styles.warningText}>{state.warningText}</Text>
              ) : null}
              <View style={styles.navigateContainer}>
                <Pressable
                  onPress={() => handleSubmit()}
                  style={styles.button}
                  android_ripple={{color: '#5DB075bb'}}>
                  <Text style={styles.text}>Reset Password</Text>
                </Pressable>
              </View>
            </>
          )}
        </>
      </View>
    </View>
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
    height: 40,
    backgroundColor: '#E8E8E8',
    margin: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#52006A',
  },
  textInput: {
    flex: 1,
  },
  navigateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  button: {
    padding: 10,
    paddingHorizontal: 40,
    backgroundColor: '#5DB075',
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    color: '#eee',
    fontWeight: 'bold',
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

export default PasswordReset;
