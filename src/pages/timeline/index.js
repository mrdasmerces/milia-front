import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

class Timeline extends Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> This is my Timeline screen </Text>
      </View>
    );
  }
}

export default Timeline;