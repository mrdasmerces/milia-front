import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './pages/main';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Dashboard from './pages/dashboard';

const Routes = createStackNavigator(
  {
    Main,
    SignIn,
    Dashboard,
    SignUp,
  },
);

export default createAppContainer(Routes);