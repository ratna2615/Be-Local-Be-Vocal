import {View, StyleSheet, Pressable, Text, Image, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHouse,
  faUser,
  faPlus,
  faCartShopping,
  faBell,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {VENDOR, getData} from '../logistics';

const BottomTab = ({navigate, routeName}) => {
  const initialNotificationState = {
    newNotifications: 0,
    notifications: [],
  };

  const [active, setActive] = useState('Home');

  const [notificationState, setNotificationState] = useState(
    initialNotificationState,
  );

  const fetchNotifications = async () => {
    let notifications = await getData('notification');
    if (notifications) {
      let newNotifications = notifications?.filter(
        notification => notification?.seen === false,
      ).length;
      setNotificationState({
        newNotifications: newNotifications,
        notifications: notifications,
      });
    }
  };

  const navigateTo = (screen, data) => {
    Animated.spring(fontAnim).reset();
    Animated.spring(fontAnim, {
      toValue: 12,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    setActive(screen);
    navigate(screen, data);
  };

  const fontAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setActive(routeName);
    Animated.spring(fontAnim, {
      toValue: 12,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    if (active === 'Home') fetchNotifications();
    return () => {
      setNotificationState({});
    };
  }, [routeName]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          navigateTo('Home');
        }}>
        <View style={active === 'Home' ? styles.tabActive : styles.tab}>
          <FontAwesomeIcon
            icon={faHouse}
            size={20}
            color={active === 'Home' ? '#5DB075' : '#000'}
          />
          <Animated.Text style={[styles.tabText, {fontSize: fontAnim}]}>
            {active === 'Home' ? 'Home' : ' '}
          </Animated.Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          navigateTo('Market');
        }}>
        <View style={active === 'Market' ? styles.tabActive : styles.tab}>
          <FontAwesomeIcon
            icon={faCartShopping}
            size={20}
            color={active === 'Market' ? '#5DB075' : '#000'}
          />
          <Animated.Text style={[styles.tabText, {fontSize: fontAnim}]}>
            {active === 'Market' ? 'Market' : ' '}
          </Animated.Text>
        </View>
      </Pressable>
      {global.USER.role === VENDOR ? (
        <Pressable
          onPress={() => {
            navigateTo('Create');
          }}>
          <View style={active === 'Create' ? styles.tabActive : styles.tab}>
            <FontAwesomeIcon
              icon={faPlus}
              size={20}
              color={active === 'Create' ? '#5DB075' : '#000'}
            />
            <Animated.Text style={[styles.tabText, {fontSize: fontAnim}]}>
              {active === 'Create' ? 'Create' : ' '}
            </Animated.Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            navigateTo('Search');
          }}>
          <View style={active === 'Search' ? styles.tabActive : styles.tab}>
            <FontAwesomeIcon
              icon={faSearch}
              size={20}
              color={active === 'Search' ? '#5DB075' : '#000'}
            />
            <Animated.Text style={[styles.tabText, {fontSize: fontAnim}]}>
              {active === 'Search' ? 'Search' : ' '}
            </Animated.Text>
          </View>
        </Pressable>
      )}
      {notificationState.newNotifications ? (
        <View style={styles.unread}>
          <Text style={styles.unreadText}>
            +{notificationState.newNotifications}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => {
          setNotificationState({
            ...notificationState,
            newNotifications: 0,
          });
          navigateTo('Notifications', {
            notifications: notificationState.notifications,
          });
        }}>
        <View
          style={active === 'Notifications' ? styles.tabActive : styles.tab}>
          <FontAwesomeIcon
            icon={faBell}
            size={20}
            color={active === 'Notifications' ? '#5DB075' : '#000'}
          />
          <Animated.Text style={[styles.tabText, {fontSize: fontAnim}]}>
            {active === 'Notifications' ? 'Notifications' : ' '}
          </Animated.Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          navigateTo('Profile');
        }}>
        <View style={active === 'Profile' ? styles.tabActive : styles.tab}>
          {global.USER.profileImage ? (
            <Image
              style={styles.profileImage}
              source={{
                uri: global.USER.profileImage,
              }}
            />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faUser}
                size={20}
                color={active === 'Profile' ? '#5DB075' : '#000'}
              />
              <Animated.Text style={[styles.tabText, {fontSize: fontAnim}]}>
                {active === 'Profile' ? 'Profile' : ' '}
              </Animated.Text>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 60,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
  },
  tab: {
    height: 30,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    borderRadius: 80,
    backgroundColor: '#5DB07540',
    height: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginLeft: -10,
  },
  unread: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    borderRadius: 25,
    position: 'absolute',
    height: 20,
    width: 25,
    zIndex: 2,
    bottom: 20,
    left: 10,
  },
  unreadText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 11,
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },
  tabText: {
    fontWeight: 'bold',
    color: '#5DB075',
    paddingLeft: 6,
  },
});

export default BottomTab;
