import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './pages/main';
import SignIn from './pages/signIn';
import Dashboard from './pages/dashboard';

const Routes = createStackNavigator(
  {
    Main,
    SignIn,
    Dashboard,
  },
);

export default createAppContainer(Routes);