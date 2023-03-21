import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Feed_card from '../component/Feed_card';
import {faXmark, faCheck} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {postData} from '../logistics';
import HeadingBar from '../component/HeadingBar';

// const HeadingBar = props => {
//   return (
//     <View style={styles.container}>
//       <Pressable
//         onPress={() => {
//           props.navigation.goBack();
//         }}>
//         <FontAwesomeIcon icon={faXmark} size={25} color="#fff" />
//       </Pressable>
//       <Text style={styles.title}>Create Post</Text>
//       <Pressable
//         onPress={() => {
//           props.handleSubmit();
//         }}>
//         <FontAwesomeIcon icon={faCheck} size={25} color="#fff" />
//       </Pressable>
//     </View>
//   );
// };

const Create_Post = props => {
  const initialState = {
    vendor: '',
    availability: '',
    productName: '',
    time: '',
    price: '',
    description: '',
    images: [],
  };
  const [post, setPost] = useState(initialState);
  const [buttonDisabled, setButton] = useState(false);
  useEffect(() => {
    setPost({...post, images: props.route.params.images});
    return () => {
      setPost({});
      setButton({});
    };
  }, []);

  const handleDescChange = description =>
    setPost({...post, description: description});
  const handleAvailabiltyChange = availability =>
    setPost({...post, availability: availability});
  const handlePriceChange = price => setPost({...post, price: price});
  const handleProductNameChange = productName =>
    setPost({...post, productName: productName});

  const handleSubmit = async () => {
    if (buttonDisabled) return;
    setButton(true);
    console.log(post);
    const res = await postData('post/create', post);
    if (res) {
      ToastAndroid.show('Post Created!', ToastAndroid.SHORT);
      props.navigation.navigate('Profile');
    } else alert('Fill data correctly!');
  };

  return (
    <View>
      <HeadingBar
        leftIcon={faXmark}
        rightIcon={faCheck}
        leftAction={() => props.navigation.goBack()}
        rightAction={() => handleSubmit()}
        title="Create Post"
      />
      <ScrollView style={{marginBottom: 100}}>
        <View style={styles.FeedContainer}>
          <Feed_card
            {...post}
            navigate={props.navigation.navigate}
            fromCreatePost={true}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Product Name"
            onChangeText={handleProductNameChange}
            value={post.productName}
            style={styles.textInput}
          />
        </View>
        <View style={styles.largeInputBox}>
          <TextInput
            multiline
            placeholder="Add description"
            onChangeText={handleDescChange}
            value={post.description}
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputBoxContainer}>
          <View style={styles.smallInputBox}>
            <TextInput
              placeholder="Add Availability"
              keyboardType="phone-pad"
              onChangeText={handleAvailabiltyChange}
              value={post.availability}
              style={styles.textInput}
            />
          </View>
          <View style={styles.smallInputBox}>
            <TextInput
              placeholder="Add Price"
              keyboardType="phone-pad"
              onChangeText={handlePriceChange}
              value={post.price}
              style={styles.textInput}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    paddingHorizontal: 25,
    backgroundColor: '#5DB075',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  FeedContainer: {
    padding: 10,
  },
  largeInputBox: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    height: 80,
    backgroundColor: '#E8E8E888',
    margin: 10,
    borderRadius: 10,
  },
  inputBox: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#E8E8E888',
    margin: 10,
    borderRadius: 10,
  },
  inputBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInputBox: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 50,
    backgroundColor: '#E8E8E888',
    margin: 10,
    borderRadius: 10,
  },
  textInput: {
    flex: 1,
  },
});

export default Create_Post;
