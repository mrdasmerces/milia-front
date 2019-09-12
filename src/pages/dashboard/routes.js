import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import Chat from '../chat';
import Itinerary from '../itinerary';
import Maps from '../maps';
import Resume from '../resume';
import Account from '../account';
import Timeline from '../timeline';

const bottomTabNavigator = createBottomTabNavigator(
  {
    Resumo: {
      screen: Resume,
    },
    Roteiro: {
      screen: Itinerary,
    },
    Mapa: {
      screen: Maps,
    },
    Milia: {
      screen: Chat,
    },
    Diario: {
      screen: Timeline,
    },
    Conta: {
      screen: Account,
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