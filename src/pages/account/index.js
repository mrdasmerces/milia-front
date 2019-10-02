import React, { Component } from 'react';
import {
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import {
  Container,
  Logo,
  Input,
  ErrorMessage,
  Button,
  SignUpLink,
  SignUpLinkText,
  ButtonText,
} from '../signIn/styles';

class Account extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
    }).isRequired,
  };

  render() {
    return(
      <Container>
        <Text> <Icon name="wrench" size={25} color={'#FC6663'} /> Homens trabalhando! Funcionalidades em breve. </Text>
        <Button onPress={async () => {
          await AsyncStorage.removeItem('@Milia:token');
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'SignIn' }),
            ],
          });
      
          this.props.screenProps.rootNavigation.dispatch(resetAction);
        }}>
          <ButtonText>Sair</ButtonText>
        </Button>    
      </Container>
    );
  }
}

export default Account;