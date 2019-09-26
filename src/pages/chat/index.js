import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View, Text, Linking } from 'react-native'
import MiliaService from '../../services/api';
import styles from './styles';

class Chat extends Component {
  state = {
    messages: [],
    typingText: '',
    lastPosition: '',
    email: '',
  }

  watchID = null;

  previousMessages = [];

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

  async componentWillMount() {
    const email = this.props.screenProps.email;
    const lastPosition = this.props.screenProps.lastPosition;
    const messages = this.props.screenProps.messages.data;
    this.previousMessages = messages;
    this.setState({email, lastPosition});
  }

  componentDidMount() {
    const welcomeMessage = {
      _id: 1,
      text: 'Olá, bem-vindo de volta! Como posso te ajudar hoje?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Milia',
        avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
      },
    };

    for(const message of this.previousMessages) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message]),
      }));
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [welcomeMessage])
    }));
  }

  onQuickReply = replies => {
    this[replies[0].function](replies[0]);
  }  

  async findAPlace(replie) {
    const newMessage = {
      text: replie.newMessage,
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      user: {
        _id: 1
      }
    };

    await this.onSend([newMessage]);
  }

  async goToPlace(replie) {
    Linking.canOpenURL(replie.mapUrl)
    .then((supported) => {
      if (!supported) {
        console.log("Can't handle url: " + replie.mapUrl);
      } else {
        return Linking.openURL(replie.mapUrl);
      }
    })
    .catch((err) => console.error('An error occurred', err));
  }  

  async onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    const paramsUser = {
      lastPosition: this.state.lastPosition,
      email: this.state.email,
    };

    this.setState({typingText: 'Milia está digitando...'});
    const result = await this.miliaService.askMilia(messages[0].text, paramsUser);

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
      />
    )
  }
};


export default Chat;