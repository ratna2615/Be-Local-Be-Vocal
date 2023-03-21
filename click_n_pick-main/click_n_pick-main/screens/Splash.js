import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.appLogo} source={require('../applogo.png')} />
      <View style={styles.nameAndTagline}>
        <Text style={styles.logoContainer}>
          <Text style={styles.logo}>Click & Pick</Text>
        </Text>
        <Text style={styles.taglineContainer}>
          <Text style={styles.tagline}>Vocal for Local!</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  logoContainer: {
    padding: 10,
  },
  logo: {
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#5DB075',
  },
  taglineContainer: {
    padding: 10,
  },
  tagline: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  appLogo: {
    height: 150,
    width: 200,
    resizeMode: 'contain',
  },
  nameAndTagline: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default Splash;
