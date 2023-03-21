import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import FirebaseServices from '../FirebseServices';

const Message = ({message, createdAt, getTime}) => {
  return (
    <View style={styles.messageArea}>
      <View style={styles.message}>
        <Text style={styles.text}>{message}</Text>
      </View>
      <Text style={styles.time}>{getTime(createdAt)}</Text>
    </View>
  );
};

const UserMessage = ({message, createdAt, getTime}) => {
  return (
    <View style={{...styles.messageArea, flexDirection: 'row-reverse'}}>
      <View
        style={{
          ...styles.message,
          backgroundColor: '#5DB075',
          paddingVertical: 10,
        }}>
        <Text style={{...styles.text, color: 'white'}}>{message}</Text>
      </View>
      <Text style={styles.time}>{getTime(createdAt)}</Text>
    </View>
  );
};

export default function ({recieverId}) {
  const scrollViewRef = useRef();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  let firebaseService = new FirebaseServices(recieverId);

  const fetchMessages = async () => {
    const messages = await firebaseService.fetchMessages();
    setMessages(messages);
    setLoading(false);
  };

  const getTime = updatedAt => {
    var updatedUTC = new Date(updatedAt?.seconds * 1000);
    updatedUTC = updatedUTC.getTime();
    var updatedIST = new Date(updatedUTC);
    updatedIST.setHours(updatedIST.getHours() + 5);
    updatedIST.setMinutes(updatedIST.getMinutes() + 30);

    var nowUTC = new Date();
    nowUTC = nowUTC.getTime();
    var nowIST = new Date(nowUTC);
    nowIST.setHours(nowIST.getHours() + 5);
    nowIST.setMinutes(nowIST.getMinutes() + 30);
    let updatedDay = updatedIST.toISOString().split('T')[0].split('-')[1];
    let nowDay = nowIST.toISOString().split('T')[0].split('-')[1];
    let time;
    if (updatedDay === nowDay) {
      time = `${updatedIST
        .toISOString()
        .split('T')[1]
        .split('.')[0]
        .substring(0, 5)}`;
    } else {
      time = `${updatedIST.toISOString().split('T')[0].substring(5)}`;
    }
    return time;
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    return firebaseService.messageRef
      .orderBy('createdAt')
      .onSnapshot(function (snapshot) {
        fetchMessages();
      });
  }, [false]);

  return (
    <>
      {loading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          inverted
          data={messages}
          renderItem={({item}) =>
            item._data.senderId === recieverId ? (
              <Message {...item._data} getTime={getTime} />
            ) : (
              <UserMessage {...item._data} getTime={getTime} />
            )
          }
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  message: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    borderRadius: 20,
    backgroundColor: '#f6f6f6',
  },
  from: {
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
  },
  messageArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 9,
  },
});
