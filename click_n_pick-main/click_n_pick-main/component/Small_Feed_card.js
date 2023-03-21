import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';

const Small_Feed_card = props => {
  return (
    <View style={styles.container}>
      <Image style={styles.smallImage} source={{uri: props.images[0]}} />
      <View style={styles.desc}>
        <Text>{props.productName}</Text>
        {props.price ? <Text style={styles.price}>₹{props.price}</Text> : null}
      </View>
    </View>
  );
};

export default Small_Feed_card;

const styles = StyleSheet.create({
  smallImage: {
    height: 100,
    width: 100,
    borderRadius: 15,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  desc: {
    width: 100,
    paddingLeft: 2,
  },
  container: {
    alignItems: 'baseline',
    flexDirection: 'column',
  },
});
