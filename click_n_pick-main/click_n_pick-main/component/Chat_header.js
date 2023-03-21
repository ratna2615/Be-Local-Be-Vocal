import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React from 'react';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const Chat_header = props => {
  return (
    <View style={styles.container}>
      <Pressable
        style={{paddingLeft: 10}}
        onPress={() => {
          props.navigation.goBack();
        }}>
        <FontAwesomeIcon color="#5DB075" icon={faArrowLeft} size={20} />
      </Pressable>
      <Image
        style={styles.profileImage}
        source={{uri: props.displayPicture}}></Image>
      <Text style={styles.title}>{props.name}</Text>

      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    paddingHorizontal: 8,
    // backgroundColor: '#5DB07550',
    // backgroundColor: '#5DB075',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: 'white',
    color: '#5DB075',
    color: '#000',
    marginHorizontal: 5,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 100,
    marginHorizontal: 10,
  },
});

export default Chat_header;
