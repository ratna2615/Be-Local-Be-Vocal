import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowAltCircleUp} from '@fortawesome/free-solid-svg-icons';

export default function ({sendMessage, defmessage}) {
  const [message, setMessage] = useState(defmessage || '');

  return (
    <View style={styles.view}>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.inputBox}
          placeholder="Type Something..."
          value={message}
          onChangeText={setMessage}
          multiline={true}
          returnKeyType="send"
        />
      </View>
      <View>
        <Pressable>
          <FontAwesomeIcon
            icon={faArrowAltCircleUp}
            style={styles.icon}
            size={30}
            onPress={() => {
              sendMessage('text', message);
              setMessage('');
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputBox: {
    backgroundColor: '#f6f6f6',
    borderRadius: 50,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    color: '#5DB075',
    margin: 10,
  },
});
