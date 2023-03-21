import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import HeadingBar from '../component/HeadingBar';
import Notification from '../component/Notification';
import {postData} from '../logistics';

const Notifications = props => {
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    await postData('notification');
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <HeadingBar title={'Notifications'} />
        {loading ? (
          <ActivityIndicator
            style={{paddingHorizontal: '45%', flex: 1}}
            size="large"
            color="#5DB075"
          />
        ) : props.route?.params?.notifications?.length ? (
          <FlatList
            style={{padding: 10, paddingVertical: 20}}
            data={props.route?.params?.notifications}
            keyExtractor={notification => notification._id}
            renderItem={notification => (
              <Notification
                fromConnectionId={notification.item.fromConnectionId}
                fromConnectionName={notification.item.fromConnectionName}
                navigate={props.navigation.navigate}
              />
            )}
          />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              flex: 1,
              paddingTop: 50,
              fontSize: 15,
            }}>
            Nothing Here Yet!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
