import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import Small_Feed_card from '../component/Small_Feed_card';
import Followers from '../component/Followers';
import {getData, VENDOR, CUSTOMER} from '../logistics';
import {getGenericPassword, resetGenericPassword} from 'react-native-keychain';
import HeadingBar from '../component/HeadingBar';
import {useIsFocused} from '@react-navigation/native';
import firebase from 'react-native-firebase';

const Profile = props => {
  const Posts = 'Posts';
  const Follower = 'Followers';
  const Following = 'Following';
  const isFocused = useIsFocused();
  const [state, setState] = useState(Posts);
  const initialState = {
    posts: [],
    connections: {followers: [], following: []},
  };

  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const data = await getGenericPassword();
    const posts = await getData(`post/postid/${global.USER._id}`),
      connections = await getData(
        `connections/${global.USER.role}/${global.USER._id}`,
      );
    if (posts)
      setData({
        ...data,
        posts: posts,
        connections: connections,
      });
    else console.log('Something went wrong !');
    setLoading(false);
  };

  useEffect(() => {
    if (global.USER.role === CUSTOMER) setState(Following);
    setLoading(true);
    fetchData();

    return () => {
      setData({});
    };
  }, [isFocused]);

  const logout = async () => {
    global.USER = null;
    await resetGenericPassword();
    await firebase.auth().signOut();
    props.route?.params?.setAuthenticated(false);
    ToastAndroid.show('Logged Out!', ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView>
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <HeadingBar
          rightText={'Settings'}
          rightAction={() => props.navigation?.navigate('Settings')}
          title={'Profile'}
          leftText={'Logout'}
          leftAction={logout}
          color={'#5DB075'}
        />
        <ScrollView>
          <View style={styles.greenBox} />
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageContainerRing}>
              <Image
                style={styles.profileImage}
                source={{
                  uri:
                    global.USER.profileImage ||
                    'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
                }}
              />
            </View>
          </View>
          <View>
            <Text style={{...styles.name, color: '#5DB075'}}>
              {global.USER.username || global.USER.name}
            </Text>
            <Text style={styles.name}>{global.USER.shopName}</Text>
          </View>
          <View style={{padding: 10}}>
            {global.USER.role === VENDOR ? (
              <View style={styles.profileTogglerContainer}>
                <Pressable
                  onPress={() => {
                    setState(Posts);
                  }}
                  style={
                    state === Posts
                      ? styles.profileTogglerActive
                      : styles.profileToggler
                  }>
                  <Text
                    style={
                      state === Posts
                        ? styles.togglerTextActive
                        : styles.togglerText
                    }>
                    Posts
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setState(Follower);
                  }}
                  style={
                    state === Follower
                      ? styles.profileTogglerActive
                      : styles.profileToggler
                  }>
                  <Text
                    style={
                      state === Follower
                        ? styles.togglerTextActive
                        : styles.togglerText
                    }>
                    Followers
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setState(Following);
                  }}
                  style={
                    state === Following
                      ? styles.profileTogglerActive
                      : styles.profileToggler
                  }>
                  <Text
                    style={
                      state === Following
                        ? styles.togglerTextActive
                        : styles.togglerText
                    }>
                    Following
                  </Text>
                </Pressable>
              </View>
            ) : null}
            {state === Posts ? (
              <View style={styles.dealsContainer}>
                {data.posts?.length ? (
                  [
                    ...data.posts?.map((post, key) => (
                      <Pressable
                        key={key}
                        onPress={() => {
                          props.navigation.navigate('MarketExpanded', {
                            data: post,
                            ...props,
                          });
                        }}>
                        <Small_Feed_card {...post} />
                      </Pressable>
                    )),
                    <Small_Feed_card
                      key={data.posts?.length}
                      price=""
                      productName=""
                      images={['abcd']}
                    />,
                  ]
                ) : loading ? (
                  <ActivityIndicator
                    style={{paddingHorizontal: '45%'}}
                    size="large"
                    color="#5DB075"
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      flex: 1,
                      paddingTop: 50,
                    }}>
                    Nothing Here yet!
                  </Text>
                )}
              </View>
            ) : state === Follower ? (
              <View>
                {data.connections?.followers?.length ? (
                  data.connections?.followers?.map((follower, key) => (
                    <Followers
                      key={key}
                      {...props}
                      {...follower}
                      action={'Remove'}
                      fetchData={fetchData}
                    />
                  ))
                ) : loading ? (
                  <ActivityIndicator
                    style={{paddingHorizontal: '45%'}}
                    size="large"
                    color="#5DB075"
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      flex: 1,
                      paddingTop: 50,
                    }}>
                    Nothing Here yet!
                  </Text>
                )}
              </View>
            ) : (
              <View>
                {data.connections?.following?.length ? (
                  data.connections?.following?.map((follow, key) => (
                    <Followers
                      key={key}
                      {...props}
                      {...follow}
                      action={'Unfollow'}
                      fetchData={fetchData}
                    />
                  ))
                ) : loading ? (
                  <ActivityIndicator
                    style={{paddingHorizontal: '45%'}}
                    size="large"
                    color="#5DB075"
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        flex: 1,
                        paddingTop: 50,
                      }}>
                      Nothing Here yet!
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: '#5DB075',
  },
  name: {
    fontSize: 20,
    flexDirection: 'row',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shopName: {
    color: 'white',
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 20,
    flexDirection: 'row',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: '#5DB075',
  },
  navigate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },

  greenBox: {
    height: 150,
    width: '100%',
    backgroundColor: '#5DB075',
  },
  profileImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
  },
  profileImageContainerRing: {
    position: 'absolute',
    bottom: -45,
    width: 160,
    height: 160,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  profileImage: {
    left: 5,
    top: 5,
    borderRadius: 100,
    width: 150,
    height: 150,
    zIndex: 999,
  },
  profileToggler: {
    height: 39,
    width: '33%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
    backgroundColor: '#F6F6F6',
  },
  profileTogglerActive: {
    height: 38,
    width: '33%',
    borderRadius: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglerColor: {
    color: 'grey',
  },
  togglerText: {
    color: 'grey',
  },
  togglerTextActive: {
    color: '#5DB075',
    fontWeight: 'bold',
  },
  profileTogglerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    width: '100%',
    borderRadius: 80,
    paddingHorizontal: 1,
    backgroundColor: '#F6F6F6',
    marginBottom: 20,
  },
  dealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default Profile;
