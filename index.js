/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import console from 'console';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
