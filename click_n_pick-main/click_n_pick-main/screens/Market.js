import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeadingBar from '../component/HeadingBar';
import Small_Feed_card from '../component/Small_Feed_card';
import {getData} from '../logistics';
import {
  faArrowRight,
  faSearch,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const Market = props => {
  const initialState = {
    hotDeals: [],
    deals: [],
    trending: [],
  };
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    const res = await Promise.all([
      getData('market/hotdeals'),
      getData('market/deals'),
      getData('market/trending'),
    ]);
    if (res[0] && res[1] && res[2])
      setData({...data, hotDeals: res[0], deals: res[1], trending: res[2]});
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchDeals();
    return () => {
      setData({});
    };
  }, []);

  return (
    <SafeAreaView>
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <View>
          <HeadingBar
            title={'Market'}
            leftIcon={faSearch}
            leftAction={() => props.navigation.navigate('Search')}
            rightIcon={faMessage}
            rightAction={() => props.navigation.navigate('Chats')}
          />
        </View>
        <ScrollView style={{padding: 5}}>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Hot Deals</Text>
            <FontAwesomeIcon color="#5DB075" icon={faArrowRight} size={25} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.hotDeals?.length ? (
              data.hotDeals?.map((deal, key) => (
                <Pressable
                  style={{padding: 5}}
                  key={key}
                  onPress={() => {
                    props.navigation.navigate('MarketExpanded', {data: deal});
                  }}>
                  <Small_Feed_card {...deal} />
                </Pressable>
              ))
            ) : (
              <View style={styles.nothing}>
                {loading ? (
                  <ActivityIndicator size="large" color="#5DB075" />
                ) : (
                  <Text style={styles.nothingText}>Coming Soon!</Text>
                )}
              </View>
            )}
          </ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Trending</Text>
            <FontAwesomeIcon color="#5DB075" icon={faArrowRight} size={25} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.trending?.length ? (
              data.trending?.map((deal, key) => (
                <Pressable
                  style={{padding: 5}}
                  key={key}
                  onPress={() => {
                    props.navigation.navigate('MarketExpanded', {data: deal});
                  }}>
                  <Small_Feed_card {...deal} />
                </Pressable>
              ))
            ) : (
              <View style={styles.nothing}>
                {loading ? (
                  <ActivityIndicator size="large" color="#5DB075" />
                ) : (
                  <Text style={styles.nothingText}>Coming Soon!</Text>
                )}
              </View>
            )}
          </ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Deals</Text>
          </View>
          <View style={styles.dealsContainer}>
            {data.deals?.length ? (
              data.deals?.map((deal, key) => (
                <Pressable
                  style={{padding: 5}}
                  key={key}
                  onPress={() => {
                    props.navigation?.navigate('MarketExpanded', {data: deal});
                  }}>
                  <Small_Feed_card {...deal} />
                </Pressable>
              ))
            ) : (
              <View style={styles.nothing}>
                {loading ? (
                  <ActivityIndicator size="large" color="#5DB075" />
                ) : (
                  <Text style={styles.nothingText}>Coming Soon!</Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Market;
const styles = StyleSheet.create({
  sectionHeading: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#5DB075',
    paddingLeft: 5,
  },
  section: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nothing: {
    height: 130,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    backgroundColor: '#5DB07550',
    borderRadius: 10,
    marginBottom: 20,
  },
  nothingText: {
    color: '#5DB075',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
