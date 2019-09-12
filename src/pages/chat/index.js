import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View, Text } from 'react-native'
import MiliaService from '../../services/api';
import styles from './styles';
import Geolocation from '@react-native-community/geolocation';

class Chat extends Component {
  state = {
    messages: [],
    typingText: '',
    initialPosition: '',
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

  componentWillMount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
    
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Olá, bem-vindo de volta! Como posso te ajudar hoje?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Milia',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });
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
    alert("Vou te levar pro mapa, em breve!!!")
  }  

  async onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    const paramsUser = {
      lastPosition: this.state.lastPosition,
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