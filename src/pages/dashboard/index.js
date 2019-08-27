import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View, Text } from 'react-native'
import MiliaService from '../../services/api';
import styles from './styles';

class Dashboard extends Component {
  state = {
    messages: [],
    typingText: '',
  }

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

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Milia',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  async onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    const paramsUser = {};

    this.setState({typingText: 'Milia está digitando...'});
    const result = await this.miliaService.askMilia(messages[0].text, paramsUser);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, result.data.dialogflowResult),
      typingText: ''
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
        renderFooter={this.renderFooter}
      />
    )
  }
};

export default Dashboard;