import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './pages/main';
import SignIn from './pages/signIn';

const Routes = createStackNavigator(
  {
    Main,
    SignIn,
  },
);

export default createAppContainer(Routes);