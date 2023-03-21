import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Small_Feed_card from '../component/Small_Feed_card';
import Followers from '../component/Followers';
import {getData, putData} from '../logistics';
import HeadingBar from '../component/HeadingBar';

const Account = props => {
  const Posts = 'Posts';
  const Follower = 'Followers';
  const Following = 'Following';
  const [state, setState] = useState(Posts);
  const initialState = {
    posts: [],
    followers: [],
    following: [],
    connected: false,
  };

  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const posts = await getData(`post/postid/${props.route.params.id}`);
    const connections = await getData(`auth/VENDOR/${props.route.params.id}`);
    let connected = connections?.followers?.some(connection => {
      return (
        JSON.stringify({
          connectionName: global.USER.username || global.USER.name,
          connectionId: global.USER._id,
        }) === JSON.stringify(connection)
      );
    });

    if (connected) {
      connected = true;
    }

    if (posts && connections)
      setData({
        ...data,
        posts: posts,
        followers: connections.followers,
        following: connections.following,
        connected: connected,
        profileImage: connections.profileImage,
      });
    else console.log('Something went wrong');
    setLoading(false);
  };

  const upDateConnection = async () => {
    const connected = data.connected;
    setData({...data, connected: !data.connected});
    const connection = {
      connectionId: props.route.params.id,
      connectionName: props.route.params.username,
    };
    connected
      ? await putData('connections/unfollow', connection)
      : await putData('connections/follow', connection);
    fetchData();
  };

  useEffect(() => {
    if (props.route.params.id == global.USER._id)
      props.navigation.replace('Profile');
    else fetchData();
    return () => {
      setState({});
      setData({});
      setLoading({});
    };
  }, [props.route.params.id]);

  return (
    <SafeAreaView>
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <HeadingBar
          leftText={'Leave'}
          leftAction={() => props.navigation.goBack()}
          title={props.route.params.username}
          rightText={data.connected ? 'Unfollow' : 'Follow'}
          rightAction={() => upDateConnection()}
          color={'#5DB075'}
        />
        <ScrollView>
          <View style={styles.greenBox}></View>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageContainerRing}>
              <Image
                style={styles.profileImage}
                source={{
                  uri:
                    data.profileImage ||
                    'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
                }}
              />
            </View>
          </View>
          <View>
            <Text style={{...styles.name, color: '#5DB075'}}>
              {props.route.params.shopName}
            </Text>
          </View>
          <View style={{padding: 10}}>
            {
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
            }
            {state === Posts ? (
              <View style={styles.dealsContainer}>
                {data.posts?.length ? (
                  data.posts?.map((post, key) => (
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
            ) : state === Follower ? (
              <View>
                {data.followers?.length ? (
                  data.followers?.map((follower, key) => (
                    <Followers key={key} {...props} {...follower} />
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
                {data.following?.length ? (
                  data.following?.map((follow, key) => (
                    <Followers key={key} {...props} {...follow} />
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingHorizontal: 15,
    color: 'white',
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

export default Account;
