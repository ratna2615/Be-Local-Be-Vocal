import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {getData, putData} from '../logistics';
const {width} = Dimensions.get('window');
const height = width * 0.6;

const Feed_card = ({
  images,
  productName,
  vendor,
  likes,
  description,
  time,
  availability,
  price,
  navigate,
  _id,
  fromCreatePost,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [likeState, setLikeState] = useState({liked: false, likes: likes});

  const changeActiveImage = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== activeImage) setActiveImage(slide);
  };

  const updateLike = async () => {
    if (likeState.liked)
      setLikeState({
        likes: likeState.likes - 1,
        liked: !likeState.liked,
      });
    else
      setLikeState({
        likes: likeState.likes + 1,
        liked: !likeState.liked,
      });
    await putData(`post/${likeState.liked ? 'unlike' : 'like'}`, {
      postId: _id,
    });
  };

  const isLiked = async () => {
    const res = await getData(`post/isliked/${_id}`);
    setLikeState({...likeState, liked: res.liked});
  };

  useEffect(() => {
    isLiked();
    return () => {
      setLikeState({});
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        pagingEnabled
        horizontal
        onScroll={changeActiveImage}
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={imageUrl => imageUrl}
        renderItem={imageUrl => (
          <Pressable
            onPress={() => {
              navigate('MarketExpanded', {
                data: {
                  images,
                  productName,
                  vendor,
                  likes,
                  description,
                  time,
                  availability,
                  price,
                  navigate,
                  _id,
                  fromCreatePost,
                },
              });
            }}>
            <View
              style={{
                backgroundColor: '#c4c4c4f1',
                borderRadius: 15,
                height: height,
                width: width * 0.95,
              }}>
              <Image
                style={styles.carouselItem}
                source={{uri: imageUrl.item}}
              />
            </View>
          </Pressable>
        )}
      />
      <View style={styles.carouselDotsContainer}>
        {images?.map((image, key) => (
          <Text
            key={key}
            style={
              key === activeImage
                ? styles.carouselDots
                : styles.carouselDotsInActive
            }>
            ⬤
          </Text>
        ))}
      </View>
      <View style={styles.icon}>
        <Pressable onPress={() => updateLike()}>
          <FontAwesomeIcon
            icon={faThumbsUp}
            size={25}
            color={likeState.liked ? '#5DB075' : '#5DB075aa'}
          />
        </Pressable>
        <Text style={styles.likeText}>{likeState.likes}</Text>
      </View>
      <View style={styles.UserInfo}>
        <Pressable
          onPress={() => {
            navigate('MarketExpanded', {
              data: {
                images,
                productName,
                vendor,
                likes,
                description,
                time,
                availability,
                price,
                navigate,
                _id,
                fromCreatePost,
              },
            });
          }}>
          <Text style={styles.userText}>{productName}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigate('Account', {
              username: vendor?.username,
              shopName: vendor?.shopName,
              id: vendor._id,
            });
          }}>
          <Text style={styles.userText}>{vendor?.username}</Text>
        </Pressable>
      </View>
      <Text style={styles.desc}>{description}</Text>
      <View style={styles.desc}>
        <Text>Availability: {availability}pcs</Text>
        <Text>₹ {price}/pc</Text>
      </View>
      <View>
        <Text style={styles.TimeText}>
          {
            time
              .toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
              .split('T')[0]
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 35,
  },
  UserInfo: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  desc: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  TimeText: {
    paddingHorizontal: 10,
    color: '#c4c4c4f1',
  },
  carouselDotsInActive: {
    color: '#c4c4c4',
    marginHorizontal: 2,
  },
  carouselDots: {
    color: 'green',
    marginHorizontal: 2,
  },
  carouselDotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    bottom: 0,
  },
  carouselItem: {
    width: width * 0.95,
    borderRadius: 15,
    height,
    resizeMode: 'cover',
  },
  likeText: {
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default Feed_card;
