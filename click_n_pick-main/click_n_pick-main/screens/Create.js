import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {faXmark, faCheck, faPhotoFilm} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import ImagePicker from 'react-native-image-crop-picker';

const HeadingBar = props => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          props?.navigation?.goBack();
        }}>
        <FontAwesomeIcon icon={faXmark} size={25} color="#fff" />
      </Pressable>
      <Text style={styles.title}>Create Post</Text>
      <Pressable
        onPress={() => {
          props.uploadToAWS();
        }}>
        <FontAwesomeIcon icon={faCheck} size={25} color="#fff" />
      </Pressable>
    </View>
  );
};

const Create = props => {
  const initialState = {
    loading: false,
    warning: false,
    images: [],
    selectedImages: [],
  };
  const [state, setState] = useState(initialState);

  async function readWritePermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  const pickImages = async () => {
    if (!(await readWritePermission())) return;
    ImagePicker.openPicker({
      multiple: true,
      compressImageQuality: 0.8,
    })
      .then(images => {
        const imgUrls = images.map(image => image.path);
        setState({
          ...state,
          images: state.images.concat(imgUrls),
          selectedImages: state.selectedImages.concat(imgUrls),
          warning: false,
        });
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    setState({...state});
    return () => {
      setState({});
    };
  }, []);

  const selectionToggler = image => {
    let selectedImages = state.selectedImages;
    let idx = selectedImages.indexOf(image);
    if (idx != -1) {
      selectedImages.splice(idx, 1);
      setState({...state, selectedImages: selectedImages});
    } else {
      if (selectedImages.length < 8) {
        selectedImages.push(image);
        setState({...state, selectedImages: selectedImages, warning: false});
      } else alert('Maximum 8 images can be selected!');
    }
  };

  const uploadToAWS = async () => {
    if (state.selectedImages.length < 1 || state.selectedImages.length > 8) {
      setState({...state, warning: true});
      return;
    }

    setState({...state, loading: true});
    try {
      let images = state.selectedImages,
        awsPromises = [];
      for (let image of state.selectedImages) {
        let awsPromise = fetch(
          'https://click-n-pick-server.herokuapp.com/s3Url',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: global.USER.token + ' ' + global.USER.role,
            },
          },
        );
        awsPromises.push(awsPromise);
      }
      const awsResponses = await Promise.all(awsPromises);
      const jsonResponses = [];
      for (let awsResponse of awsResponses)
        jsonResponses.push(awsResponse.json());
      const jsonData = await Promise.all(jsonResponses);
      let responses = [];
      let awsURLs = [];
      let i = 0;
      let imageResponses = [];
      for (let image of images) imageResponses.push(fetch(image));
      imageResponses = await Promise.all(imageResponses);
      let imageBlobs = [];
      for (let k of imageResponses) imageBlobs.push(k.blob());
      imageBlobs = await Promise.all(imageBlobs);
      for (let url of jsonData) {
        let response = fetch(url.data, {
          method: 'PUT',
          body: imageBlobs[i++],
        });
        awsURLs.push(url.data.split('?')[0]);
        responses.push(response);
      }

      await Promise.all(responses);
      setState({...state, loading: false});
      await ImagePicker.clean();
      props.navigation.navigate('Create_Post', {images: awsURLs});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <HeadingBar {...props} uploadToAWS={uploadToAWS} />
      {state.loading ? (
        <ActivityIndicator size="large" color="#5DB075" />
      ) : null}
      <ScrollView>
        <View style={styles.options}>
          <Pressable
            onPress={() => pickImages()}
            style={[styles.cameraButton, styles.option]}>
            <FontAwesomeIcon icon={faPhotoFilm} size={60} color="#565656" />
            <Text style={styles.optionText}>From Gallery</Text>
          </Pressable>

          {state.warning ? (
            <Text style={styles.warning}>
              Minimum 1 and Maximum 8 Images can be selected!
            </Text>
          ) : null}
        </View>
        <View style={styles.images}>
          {state.images?.length ? (
            [
              ...state.images?.map((image, i) => (
                <Pressable
                  key={i}
                  style={styles.imageContainer}
                  onPress={() => {
                    selectionToggler(image);
                  }}>
                  <Image style={styles.image} source={{uri: image}} />
                  {state.selectedImages.includes(image) === true ? (
                    <View style={styles.selected}>
                      <FontAwesomeIcon
                        color="#5DB075"
                        icon={faCheck}
                        size={15}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </Pressable>
              )),
              <View key={state.images?.length} style={styles.imageContainer}>
                <Image style={styles.image} source={{uri: 'image'}} />
              </View>,
            ]
          ) : (
            <View style={styles.empty}>
              <Text>Added Images will Appear Here!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  images: {
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 75,
  },
  image: {
    width: '100%',
    height: 100,
  },
  imageContainer: {
    width: '30%',
    height: 100,
    marginVertical: 10,
  },
  selected: {
    backgroundColor: '#f6f6f6',
    position: 'absolute',
    borderRadius: 100,
    alignItems: 'center',
    bottom: 74,
    left: 79,
    height: 22,
    width: 22,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    padding: 50,
    color: '#c4c4c4',
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    paddingHorizontal: 25,
    backgroundColor: '#5DB075',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    paddingVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  optionText: {
    color: '#5DB075',
    fontWeight: '500',
    fontSize: 14,
    paddingTop: 5,
  },
  empty: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning: {
    color: 'orange',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
export default Create;
