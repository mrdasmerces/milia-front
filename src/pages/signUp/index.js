import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View, Text } from 'react-native'
import MiliaService from '../../services/api';
import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';

class SignUp extends Component {
  state = {
    messages: [],
    typingText: '',
    lastPosition: '',
  }

  watchID = null;

  miliaService = new MiliaService();

  renderFooter = () => {
    if (this.state.typingText) {
      return (
        <View>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      )
    }
    return null;
  }

  async componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Olá, viajante! Sou a Milia, sua assistente virtual de viagens. Vamos fazer seu cadastro comigo agora :)',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Milia',
            avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
          },
        },
      ],
      typingText: 'Milia está digitando...'
    });

    const result = await this.miliaService.miliaSignup('#signup', this.props.navigation.getParam('idSessionSignup'));

    for(const message of result.data.dialogflowResult) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message]),
        typingText: '',
      }));
    }     
  }

  onQuickReply = replies => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [{text: replies[0].newMessage, _id: '_' + Math.random().toString(36).substr(2, 9), user: { _id: 1}, createdAt: new Date()}]),
      typingText: 'Milia está digitando...',
    }));
    
    this[replies[0].function]();
  }  

  async newSignup() {
    const result = await this.miliaService.miliaSignup('#signup', this.props.navigation.getParam('idSessionSignup'));

    for(const message of result.data.dialogflowResult) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message]),
        typingText: '',
      }));
    }
  }

  async successSignup() {
    const result = await this.miliaService.miliaSignup('#success_signup', this.props.navigation.getParam('idSessionSignup'));

    for(const message of result.data.dialogflowResult) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message]),
        typingText: '',
      }));
    }
    
    if(result.data.dialogflowResult[0].authenticateUser) {
      const response = await this.miliaService.authenticate(result.data.dialogflowResult[0].username, result.data.dialogflowResult[0].password);

      await AsyncStorage.setItem('@Milia:token', response.data.token);
      await AsyncStorage.setItem('@Milia:username', result.data.dialogflowResult[0].username);

      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Dashboard', params: { email: result.data.dialogflowResult[0].username } }),
        ],
      });

      this.props.navigation.dispatch(resetAction);      
    }    
  }
  
  async forgotPassword(replie) {
    const result = await this.miliaService.miliaSignup('#forgot_password', this.props.navigation.getParam('idSessionSignup'));

    for(const message of result.data.dialogflowResult) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message]),
        typingText: '',
      }));
    }   
  }  

  async onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    const idSessionSignup = this.props.navigation.getParam('idSessionSignup');

    this.setState({typingText: 'Milia está digitando...'});
    const result = await this.miliaService.miliaSignup(messages[0].text, idSessionSignup);

    for(const message of result.data.dialogflowResult) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message]),
        typingText: '',
      }));
    }
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
        onQuickReply={this.onQuickReply}
        renderFooter={this.renderFooter}
      >
      </GiftedChat>      
    )
  }
};


export default SignUp;