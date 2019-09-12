import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import Chat from '../chat';

class Explore extends Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> This is my Explore screen </Text>
      </View>
    );
  }
}

const bottomTabNavigator = createBottomTabNavigator(
  {
    Chat,
    Explore,
  },
  {
    initialRouteName: 'Chat'
  }
);

export default createAppContainer(bottomTabNavigator);