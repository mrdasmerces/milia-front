import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

class Account extends Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> This is my Account screen </Text>
      </View>
    );
  }
}

export default Account;