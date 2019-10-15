import { createStackNavigator, createAppContainer } from 'react-navigation';

import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Dashboard from './pages/dashboard';

const Routes = createStackNavigator(
  {
    SignIn,
    SignUp,
    Dashboard,
  },
  {
    initialRouteName: 'SignIn',
  }
);

export default createAppContainer(Routes);