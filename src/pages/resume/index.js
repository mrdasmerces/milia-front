import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

class Resume extends Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> This is my Resume screen </Text>
      </View>
    );
  }
}

export default Resume;