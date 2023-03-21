import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeadingBar from '../component/HeadingBar';
import FirebaseServices from '../FirebseServices';
import {getData} from '../logistics';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useIsFocused} from '@react-navigation/native';

const ChatHead = ({user1, user2, lastMessage, updatedAt, navigate}) => {
  const [state, setState] = useState({
    profileImage: '',
    name: '',
    lastMessage: '',
    updatedAt: '',
  });

  const fetchReciever = async () => {
    const reciever = global.USER?._id.toString() === user1 ? user2 : user1;
    let recieverData = await getData(`auth/VENDOR/${reciever}`);
    if (!recieverData) {
      recieverData = await getData(`auth/CUSTOMER/${reciever}`);
    }

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

    setState({
      profileImage: recieverData.profileImage,
      name: recieverData.username || recieverData.name,
      lastMessage: lastMessage,
      time: time,
      vendor: recieverData,
    });
  };

  useEffect(() => {
    fetchReciever();
    return () => {
      setState({});
    };
  }, []);

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigate('Chat', {
          reciever: state?.vendor,
        })
      }>
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri:
              state.profileImage ||
              'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
          }}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.nameAndTime}>
          <Text style={styles.name}>{state.name}</Text>
          <Text>{state.time}</Text>
        </View>
        <Text numberOfLines={1} style={styles.message}>
          {state.lastMessage}
        </Text>
      </View>
    </Pressable>
  );
};

const Chats = props => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const isFocused = useIsFocused();

  let firebaseService = new FirebaseServices(
    props.route?.params?.vendor?._id || props.route?.params?.recieverId,
  );

  const loadChats = async () => {
    const chats = await firebaseService.fetchChats();
    setChats(chats);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadChats();
    return () => {
      setChats({});
      setLoading({});
    };
  }, [isFocused]);

  return (
    <SafeAreaView>
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <HeadingBar
          title={'Messages'}
          leftIcon={faArrowLeft}
          leftAction={() => props.navigation.goBack()}
          rightText="     "
        />
        {loading ? (
          <ActivityIndicator size="large" color="#5DB075" />
        ) : chats?.length ? (
          <FlatList
            contentContainerStyle={{paddingTop: 20}}
            data={chats}
            renderItem={({item}) => (
              <ChatHead {...item._data} navigate={props.navigation.navigate} />
            )}
          />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              flex: 1,
              paddingTop: 50,
              fontSize: 15,
              fontWeight: '500',
            }}>
            Nothing Here Yet!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chats;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  details: {
    flex: 1,
    flexDirection: 'column',
    borderBottomColor: '#c4c4c4',
    borderBottomWidth: 1,
    alignItems: 'baseline',
    marginHorizontal: 20,
  },
  name: {
    fontWeight: 'bold',
    flex: 1,
    fontSize: 16,
  },
  buttonText: {
    color: 'red',
    fontWeight: '500',
  },
  nameAndTime: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
