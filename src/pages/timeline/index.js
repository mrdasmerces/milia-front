import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class Timeline extends Component {
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> <Icon name="wrench" size={25} color={'#FC6663'} /> Homens trabalhando! Página do diário em breve. </Text>
      </View>
    );
  }
}

export default Timeline;