import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import Chat_header from '../component/Chat_header';
import Chat_InputBox from '../component/Chat_InputBox';
import Chat_messages from '../component/Chat_messages';
import FirebaseServices from '../FirebseServices';

const Chat = props => {
  let {reciever, message} = props.route?.params;
  let firebaseService = new FirebaseServices(reciever?._id);
  const initialState = {
    name: '',
    displayPicture:
      'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
    recieverId: reciever._id,
    message: message,
  };
  const [state, setState] = useState(initialState);

  const sendMessage = (type, message) => {
    if (message) firebaseService.createMessage(type, message);
  };
  useEffect(() => {
    setState({
      ...state,
      name: reciever?.username || reciever?.name,
      displayPicture:
        reciever.profileImage ||
        'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
      recieverId: reciever._id,
      message: message,
    });
    return () => {
      setState({});
    };
  }, []);

  return (
    <View style={styles.container}>
      <Chat_header
        {...props}
        name={state.name}
        displayPicture={state.displayPicture}
      />
      <Chat_messages recieverId={state.recieverId} />
      <Chat_InputBox sendMessage={sendMessage} defmessage={state.message} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});

export default Chat;
