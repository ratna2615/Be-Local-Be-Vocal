import {View, Text, StyleSheet, Pressable, ToastAndroid} from 'react-native';
import React from 'react';
import Feed_card from '../component/Feed_card';
import {deleteData} from '../logistics';

const MarketExpanded = props => {
  const data = props.route?.params?.data;

  return (
    <View style={styles.container}>
      <View style={styles.feedCard}>
        <Feed_card {...data} navigate={props.navigation.navigate} />
      </View>
      {!data.fromCreatePost && data.vendor._id !== global.USER._id ? (
        <Pressable
          onPress={() =>
            props?.navigation?.navigate('Chat', {
              reciever: data?.vendor,
              message: `I want to buy\nProduct Name: ${data.productName}`,
            })
          }
          style={styles.button}
          android_ripple={{color: '#5DB075bb'}}>
          <Text style={styles.text}>Buy</Text>
        </Pressable>
      ) : !data.fromCreatePost ? (
        <Pressable
          onPress={() => {
            ToastAndroid.show('Post Deleted!', ToastAndroid.SHORT);
            deleteData(`post/delete/${data._id}`);
            props?.navigation?.navigate('Home');
          }}
          style={styles.button}
          android_ripple={{color: '#5DB075bb'}}>
          <Text style={styles.text}>Delete</Text>
        </Pressable>
      ) : null}
      {/* <Pressable
        onPress={() => {}}
        style={styles.button}
        android_ripple={{color: '#5DB075bb'}}>
        <Text style={styles.text}>View Image</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5DB075',
    padding: 10,
    height: '100%',
    flexDirection: 'column',
  },
  feedCard: {
    borderRadius: 15,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#5DB075',
    fontWeight: 'bold',
  },
});

export default MarketExpanded;
