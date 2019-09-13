import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

class Itinerary extends Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> This is my Itinerary screen </Text>
      </View>
    );
  }
}

export default Itinerary;