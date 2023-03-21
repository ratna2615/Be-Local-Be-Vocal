import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import {putData, getData} from '../logistics';

const Notification = ({navigate, fromConnectionName, fromConnectionId}) => {
  const [connected, setConnected] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
  );

  const updateConnection = async () => {
    const conn = connected;
    setConnected(!connected);
    await putData(`connections/${conn ? 'unfollow' : 'follow'}`, {
      connectionId: fromConnectionId,
      connectionName: fromConnectionName,
    });
  };

  const fetchUser = async () => {
    const user = await getData(`auth/VENDOR/${fromConnectionId}`);
    if (user) setProfileImage(user.profileImage);
  };

  useEffect(() => {
    setConnected(
      global.USER.following.some(
        connection => connection.connectionId === fromConnectionId,
      ),
    );
    fetchUser();
    return () => {
      setConnected({});
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: profileImage,
          }}
        />
        {/* <Text style={styles.avatarText}>{fromConnectionName[0]}</Text> */}
      </View>
      <View style={styles.details}>
        <Pressable
          onPress={() =>
            navigate('Account', {
              username: fromConnectionName,
              id: fromConnectionId,
            })
          }>
          <Text style={styles.name}>
            {fromConnectionName} started following you.
          </Text>
        </Pressable>
        <Pressable onPress={() => updateConnection()}>
          <Text style={styles.buttonText}>
            {connected ? 'Unfollow' : 'Follow'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
    marginHorizontal: 5,
  },
  imageContainer: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  avatarText: {
    color: '#fff',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#c4c4c4',
    borderBottomWidth: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#5DB075',
    fontWeight: '500',
  },
});
export default Notification;
