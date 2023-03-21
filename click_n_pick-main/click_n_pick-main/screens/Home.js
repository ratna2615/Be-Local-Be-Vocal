import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Feed_card from '../component/Feed_card';
import HeadingBar from '../component/HeadingBar';
import {getData} from '../logistics';
import {faMessage, faSearch} from '@fortawesome/free-solid-svg-icons';
import {useIsFocused} from '@react-navigation/native';

const Home = props => {
  const isFocused = useIsFocused();
  const initialData = {
    posts: [],
  };
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const data = await getData('post/feed/0');
    if (data) setData({posts: data});
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    return () => {
      setData({});
    };
  }, [isFocused]);

  return (
    <SafeAreaView>
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <HeadingBar
          title={'Click & Pick'}
          leftIcon={faSearch}
          leftAction={() => props.navigation.navigate('Search')}
          rightIcon={faMessage}
          rightAction={() => props.navigation.navigate('Chats')}
        />
        {data?.posts?.length ? (
          <FlatList
            style={{padding: 10, paddingVertical: 30}}
            data={data.posts}
            keyExtractor={post => post._id}
            renderItem={post => (
              <Feed_card {...post.item} navigate={props.navigation.navigate} />
            )}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            {loading ? (
              <ActivityIndicator size="large" color="#5DB075" />
            ) : (
              <View style={styles.container}>
                <Text style={styles.text}>Nothing here yet!</Text>
                <Text style={styles.text}>
                  Please follow somebody to continue.
                </Text>
                <View style={styles.buttonContainer}>
                  <Pressable
                    onPress={() => props.navigation.navigate('Market')}
                    style={styles.button}
                    android_ripple={{color: '#5DB075bb', borderless: false}}>
                    <Text style={styles.btnText}>Explore</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    paddingHorizontal: 100,
    backgroundColor: '#5DB075',
    borderRadius: 50,
  },
  btnText: {
    fontSize: 16,
    color: '#eee',
    fontWeight: 'bold',
  },
  text: {
    paddingVertical: 2,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Home;
