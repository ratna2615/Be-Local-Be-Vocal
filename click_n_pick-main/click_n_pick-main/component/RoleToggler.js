import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {CUSTOMER, VENDOR} from '../logistics';

const RoleToggler = ({role, toggleRole}) => {
  return (
    <View style={styles.roleContainer}>
      <Text style={{paddingLeft: 10, fontSize: 16}}>Role:</Text>
      <View style={styles.roleContainer}>
        <TouchableHighlight>
          <View style={role === VENDOR ? styles.roleBtnActive : styles.roleBtn}>
            <Text
              style={role === VENDOR ? styles.navigateActive : styles.navigate}
              onPress={() => {
                toggleRole(VENDOR);
              }}>
              Vendor
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight>
          <View
            style={role === CUSTOMER ? styles.roleBtnActive : styles.roleBtn}>
            <Text
              style={
                role === CUSTOMER ? styles.navigateActive : styles.navigate
              }
              onPress={() => {
                toggleRole(CUSTOMER);
              }}>
              Customer
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleBtn: {
    flexDirection: 'row',
    height: 45,
    backgroundColor: '#E8E8E888',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleBtnActive: {
    flexDirection: 'row',
    height: 45,
    margin: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#5DB075',
    backgroundColor: '#5DB075',
    alignItems: 'center',
  },
  navigate: {
    fontSize: 15,
    marginHorizontal: 20,
    color: '#5DB075',
  },
  navigateActive: {
    fontSize: 15,
    marginHorizontal: 20,
    color: 'white',
  },
});

export default RoleToggler;
