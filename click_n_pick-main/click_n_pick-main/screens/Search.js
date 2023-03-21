import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  faLocationDot,
  faSearch,
  faShop,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {getData} from '../logistics';

const Search = props => {
  const initialItems = {
    pincodes: [],
    usernames: [],
    shopNames: [],
  };
  const [searchItems, setSearchItems] = useState(initialItems);
  const [loading, setLoading] = useState(true);

  const onChangeSearch = async searchTerm => {
    if (searchTerm.length > 2) {
      setLoading(true);
      const res = await getData(`search/searchterm/${searchTerm}`);
      if (res) setSearchItems({...searchItems, ...res});
      setLoading(false);
    }
  };

  const searchByPincode = async pincode => {
    const res = await getData(`search/pincode/${pincode}`);
    if (res) setSearchItems({...searchItems, pincodes: res});
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    searchByPincode(global.USER?.location?.pincode);
    return () => {
      setSearchItems({});
      setLoading({});
    };
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={() => props.navigation.goBack()}>
          <FontAwesomeIcon icon={faXmark} size={25} color={'#5DB075aa'} />
        </Pressable>
        <TextInput
          onChangeText={onChangeSearch}
          placeholder="Search Vendors or Shopnames..."
          style={styles.textInput}
          clearTextOnFocus={true}
          autoFocus={true}
        />
        <FontAwesomeIcon icon={faSearch} size={25} color={'#5DB075aa'} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#5DB075" />
      ) : (
        <View>
          <FlatList
            keyboardShouldPersistTaps="always"
            data={searchItems.usernames}
            keyExtractor={user => user._id}
            renderItem={user => (
              <View style={styles.searchItemContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri:
                        user.item?.profileImage ||
                        'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
                    }}
                  />
                  {/* <Text style={styles.avatarText}>
                    {user.item?.username[0]}
                  </Text> */}
                </View>
                <View style={styles.details}>
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate('Account', {
                        username: user.item?.username,
                        shopName: user.item?.shopName,
                        id: user.item?._id,
                      })
                    }>
                    <Text style={styles.name}>{user.item?.username}</Text>
                    <Text style={styles.city}>
                      {user.item?.shopName}, {user.item?.location?.city}
                    </Text>
                  </Pressable>
                  <FontAwesomeIcon
                    icon={faUser}
                    size={20}
                    color={'#5DB075aa'}
                  />
                </View>
              </View>
            )}
          />
          <FlatList
            keyboardShouldPersistTaps="always"
            data={searchItems.shopNames}
            keyExtractor={user => user._id}
            renderItem={user => (
              <View style={styles.searchItemContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri:
                        user.item?.profileImage ||
                        'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
                    }}
                  />
                  {/* <Text style={styles.avatarText}>
                    {user.item?.shopName[0]}
                  </Text> */}
                </View>
                <View style={styles.details}>
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate('Account', {
                        username: user.item?.username,
                        shopName: user.item?.shopName,
                        id: user.item?._id,
                      })
                    }>
                    <Text style={styles.name}>{user.item?.shopName}</Text>
                    <Text style={styles.city}>
                      {user.item?.username}, {user.item?.location?.city}
                    </Text>
                  </Pressable>
                  <FontAwesomeIcon
                    icon={faShop}
                    size={20}
                    color={'#5DB075aa'}
                  />
                </View>
              </View>
            )}
          />
          <FlatList
            keyboardShouldPersistTaps="always"
            data={searchItems.pincodes}
            keyExtractor={user => user._id}
            renderItem={user => (
              <View style={styles.searchItemContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri:
                        user.item?.profileImage ||
                        'https://clickpick-poducts.s3.ap-south-1.amazonaws.com/smallavatar.png',
                    }}
                  />
                  {/* <Text style={styles.avatarText}>
                    {user.item?.username[0]}
                  </Text> */}
                </View>
                <View style={styles.details}>
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate('Account', {
                        username: user.item?.username,
                        shopName: user.item?.shopName,
                        id: user.item?._id,
                      })
                    }>
                    <Text style={styles.name}>{user.item?.username}</Text>
                    <Text style={styles.city}>
                      {user.item?.shopName}, {user.item?.location?.city}
                    </Text>
                  </Pressable>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size={20}
                    color={'#5DB075aa'}
                  />
                </View>
              </View>
            )}
          />
        </View>
      )}
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    margin: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5DB07522',
    borderRadius: 100,
    marginBottom: 20,
  },
  searchItemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
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
    width: 50,
    height: 50,
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
    paddingLeft: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    flex: 1,
  },
});
