import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AsyncStorage from '@react-native-community/async-storage';

import { StackActions, NavigationActions } from 'react-navigation';

import MiliaService from '../../services/api';

import Loader from '../../common/loader';

import {
  Container,
  Logo,
  Input,
  ErrorMessage,
  Button,
  SignUpLink,
  SignUpLinkText,
  ButtonText,
} from './styles';

export default class SignIn extends Component {
  constructor(props){
    super(props);
  };

  static navigationOptions = {
    title: 'Login',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
    }).isRequired,
  };

  state = {
    email: '',
    password: '',
    error: '',
    loading: false,
  };

  miliaService = new MiliaService();

  async componentWillMount() {
    const token = await AsyncStorage.getItem('@Milia:token');
    const email = await AsyncStorage.getItem('@Milia:username');

    if(token) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Dashboard', params: { email } }),
        ],
      });
  
      this.props.navigation.dispatch(resetAction);   
    }
  }

  handleEmailChange = (email) => {
    this.setState({ email });
  };

  handlePasswordChange = (password) => {
    this.setState({ password });
  };

  handleCreateAccountPress = () => {
    this.props.navigation.navigate('SignUp', { idSessionSignup: '_' + Math.random().toString(36).substr(2, 9) });
  }

  handleSignInPress = async () => {
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      return this.setState({ error: 'Preencha usuário e senha para continuar!' }, () => false);
    }

    try {

      this.setState({ loading: true });

      const response = await this.miliaService.authenticate(this.state.email, this.state.password);
      this.setState({ loading: false });

      await AsyncStorage.setItem('@Milia:token', response.data.token);
      await AsyncStorage.setItem('@Milia:username', this.state.email);


      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Dashboard', params: { email: this.state.email } }),
        ],
      });

      this.props.navigation.dispatch(resetAction);
    } catch (_err) {
      console.log(_err);
      this.setState({ loading: false });

      this.setState({ error: 'Houve um problema com o login, verifique suas credenciais!' });
    }
    
  };

  render() {
    return(
      <Container>
        {this.state.loading && 
        <Loader
          loading={this.state.loading} />
        }
        <Logo source={require('../../images/milia_avatar.png')} resizeMode="contain" />
        <Input
          placeholder="Endereço de e-mail"
          value={this.state.email}
          onChangeText={this.handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          placeholder="Senha"
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        {this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
        <Button onPress={this.handleSignInPress}>
          <ButtonText>Entrar</ButtonText>
        </Button>
        <SignUpLink onPress={this.handleCreateAccountPress}>
          <SignUpLinkText>Criar conta grátis</SignUpLinkText>
        </SignUpLink>        
      </Container>
    );
  }
}