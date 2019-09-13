import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import Chat from '../chat';
import Itinerary from '../itinerary';
import Resume from '../resume';
import Account from '../account';
import Timeline from '../timeline';
import Icon from 'react-native-vector-icons/FontAwesome';

Icon.loadFont();

const bottomTabNavigator = createBottomTabNavigator(
  {
    Resumo: {
      screen: Resume,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={25} color={tintColor} />
        )
      }
    },
    Roteiro: {
      screen: Itinerary,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="map-signs" size={25} color={tintColor} />
        )
      }
    },
    Milia: {
      screen: Chat,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="comments" size={25} color={tintColor} />
        )
      }
    },    
    'Diário': {
      screen: Timeline,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="book" size={25} color={tintColor} />
        )
      }
    },
    Conta: {
      screen: Account,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="user" size={25} color={tintColor} />
        )
      }
    },
  },
  {
    initialRouteName: 'Resumo',
    tabBarOptions: {
      activeTintColor: '#FC6663'
    }
  }
);

export default createAppContainer(bottomTabNavigator);