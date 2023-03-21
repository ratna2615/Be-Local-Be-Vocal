import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const HeadingBar = ({
  leftText,
  rightText,
  title,
  leftAction,
  rightAction,
  leftIcon,
  rightIcon,
  color,
}) => {
  return (
    <View style={[styles.HeadingBar, {backgroundColor: color}]}>
      <Pressable onPress={leftAction}>
        {leftIcon ? (
          <FontAwesomeIcon
            icon={leftIcon}
            size={25}
            color={color ? '#fff' : '#5DB075'}
          />
        ) : (
          <Text style={[styles.navigate, {color: color ? '#fff' : '#5DB075'}]}>
            {leftText}
          </Text>
        )}
      </Pressable>
      <Text style={[styles.title, {color: color ? '#fff' : '#000'}]}>
        {title}
      </Text>
      <Pressable onPress={rightAction}>
        {rightIcon ? (
          <FontAwesomeIcon
            icon={rightIcon}
            size={25}
            color={color ? '#fff' : '#5DB075'}
          />
        ) : (
          <Text style={[styles.navigate, {color: color ? '#fff' : '#5DB075'}]}>
            {rightText}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  HeadingBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    paddingHorizontal: 25,
    // backgroundColor: '#5DB075',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  navigate: {
    fontSize: 16,
    // fontWeight: 'bold',
  },
});

export default HeadingBar;
