import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  Image,
  View,
  ActivityIndicator,
  ToastAndroid,
  TextInput,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import HeadingBar from '../component/HeadingBar';
import {getData, putData, getUser, VENDOR} from '../logistics';
import {faCheck, faXmark, faPencil} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import ImagePicker from 'react-native-image-crop-picker';

const Settings = props => {
  const initialLocation = {
    city: '',
    pincode: '',
    state: '',
  };

  const [location, setLocation] = useState(initialLocation),
    [shopName, setShopName] = useState(),
    [user, setUser] = useState(),
    [loading, setLoading] = useState(true),
    [submitLoading, setSubmitLoading] = useState(false);

  const fetchUser = async () => {
    const res = await getData('auth');
    if (res) setUser(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    return () => {
      setUser({});
      setLoading({});
    };
  }, []);

  async function readWritePermission() {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  const submit = async () => {
    setSubmitLoading(true);
    ToastAndroid.show('Settings updated!', ToastAndroid.SHORT);
    let img = user.profileImage;
    try {
      if (user.imageEdited) {
        let url = await getData('s3Url');
        const image = await fetch(user.profileImage);
        const imageBlob = await image.blob();
        await fetch(url, {
          method: 'PUT',
          body: imageBlob,
        });
        img = url.split('?')[0];
      }

      await putData('auth', {
        profileImage: img,
        shopName: shopName,
        location: location,
      });

      await fetchUser();
      setSubmitLoading(false);
      await getUser();
    } catch (error) {
      console.log(error);
      setSubmitLoading(false);
    }
  };

  const pickImage = async () => {
    if (!(await readWritePermission())) return;
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
    })
      .then(image => {
        setUser({...user, profileImage: image.path, imageEdited: true});
      })
      .catch(err => console.log(err));
  };

  const handleShopEdit = value => setShopName(value);
  const handleEdit = (field, value) =>
    setLocation({...location, [field]: value});

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <HeadingBar
        leftIcon={faXmark}
        leftAction={() => props.navigation.goBack()}
        title={'Settings'}
        rightIcon={faCheck}
        rightAction={() => submit()}
        color="#5DB075"
      />
      <View style={styles.greenBox} />
      <Pressable onPress={() => pickImage()}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageContainerRing}>
            <Image
              style={styles.profileImage}
              source={{
                uri:
                  user?.profileImage ||
                  'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
              }}
            />
          </View>
          <View style={styles.imageEditIcon}>
            <FontAwesomeIcon icon={faPencil} size={20} color={'#fff'} />
          </View>
        </View>
      </Pressable>
      {global.USER.role === VENDOR ? (
        <View>
          <Text style={{...styles.name}}>
            {global.USER.username || global.USER.name}
          </Text>
          <View style={{paddingTop: 15, paddingLeft: 15}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{...styles.locationTitle}}>Shop name{'   '}</Text>
              <FontAwesomeIcon icon={faPencil} size={15} color={'#5DB075'} />
            </View>
            <TextInput
              onChangeText={handleShopEdit}
              placeholder={user?.shopName}
              style={styles.location}
            />
          </View>
        </View>
      ) : null}
      {submitLoading ? (
        <ActivityIndicator
          style={{paddingTop: 20}}
          size={'large'}
          color={'#5DB075'}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator
          style={{paddingTop: 50}}
          size={'large'}
          color={'#5DB075'}
        />
      ) : (
        <View style={{paddingLeft: 15}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{...styles.locationTitle, color: '#5DB075'}}>
              Location{'   '}
            </Text>
            <FontAwesomeIcon icon={faPencil} size={15} color={'#5DB075'} />
          </View>

          <TextInput
            onChangeText={value => handleEdit('city', value)}
            placeholder={user?.location?.city}
            style={styles.location}
          />
          <TextInput
            onChangeText={value => handleEdit('pincode', value)}
            placeholder={user?.location?.pincode?.toString()}
            style={styles.location}
          />
          <TextInput
            onChangeText={value => handleEdit('state', value)}
            placeholder={user?.location?.state}
            style={styles.location}
          />
          <View style={styles.navigateContainer}>
            <Pressable
              onPress={() => submit()}
              style={styles.button}
              android_ripple={{color: '#5DB075bb'}}>
              <Text style={styles.text}>Submit</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  greenBox: {
    height: 120,
    width: '100%',
    backgroundColor: '#5DB075',
  },
  profileImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 35,
  },
  profileImageContainerRing: {
    position: 'absolute',
    bottom: -20,
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
  imageEditIcon: {
    left: 50,
    top: 30,
    width: 40,
    height: 40,
    borderRadius: 80,
    backgroundColor: '#5DB075cc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    color: '#5DB075',
    flexDirection: 'row',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationTitle: {
    color: '#5DB075',
    fontSize: 17,
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    padding: 5,
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  navigateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  button: {
    padding: 10,
    paddingHorizontal: 100,
    backgroundColor: '#5DB075',
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    color: '#eee',
    fontWeight: 'bold',
  },
  inputBox: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#E8E8E8',
    marginVertical: 10,
    marginRight: 15,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#52006A',
  },
  textInput: {
    flex: 1,
  },
});
