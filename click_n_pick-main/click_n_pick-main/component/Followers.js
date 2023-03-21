import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getData, putData} from '../logistics';

const Followers = props => {
  const [state, setState] = useState({
    shopName: '',
    profileImage:
      'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
    city: '',
  });
  const [loading, setLoading] = useState(true);
  const fetchDetails = async () => {
    let user;
    user = await getData(`auth/VENDOR/${props.connectionId}`);
    if (user)
      setState({
        shopName: user.shopName,
        profileImage: user.profileImage || state.profileImage,
        city: user.location.city,
      });
    else user = await getData(`auth/CUSTOMER/${props.connectionId}`);
    if (user)
      setState({
        shopName: user.shopName,
        profileImage: user.profileImage || state.profileImage,
        city: user.location.city,
      });
    else setState({...state, shopName: 'userx', city: 'cityx'});
    setLoading(false);
  };
  const unfollow = async (connectionId, connectionName) => {
    await putData('connections/unfollow', {
      connectionId: connectionId,
      connectionName: connectionName,
    });
  };

  const remove = async (connectionId, connectionName) => {
    await putData('connections/remove', {
      connectionId: connectionId,
      connectionName: connectionName,
    });
  };

  const handleAction = async () => {
    setLoading(true);
    if (props.action === 'Unfollow')
      await unfollow(
        props.connectionId.toString(),
        props.connectionName.toString(),
      );
    else
      await remove(
        props.connectionId.toString(),
        props.connectionName.toString(),
      );
    setLoading(false);
    props.fetchData();
  };
  useEffect(() => {
    fetchDetails();
    return () => {
      setState({});
      setLoading({});
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: state.profileImage,
          }}
        />
        {/* <Text style={styles.avatarText}>{props?.connectionName[0]}</Text> */}
      </View>
      <View style={styles.details}>
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            props.navigation.navigate('Account', {
              shopName: state.shopName,
              id: props.connectionId,
              username: props.connectionName,
            });
          }}>
          <Text style={styles.name}>{props?.connectionName}, </Text>
          <Text>{state?.city}</Text>
        </Pressable>

        <Pressable onPress={() => handleAction()}>
          {loading ? (
            <ActivityIndicator size="small" color="#5DB075" />
          ) : (
            <Text style={styles.buttonText}>{props?.action}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  imageContainer: {
    width: 35,
    height: 35,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  avatarText: {
    color: '#fff',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
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
    fontSize: 16,
  },
  buttonText: {
    color: 'red',
    fontWeight: '500',
  },
});
export default Followers;
