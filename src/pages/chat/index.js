import React, { Component } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { View, Text, Linking } from 'react-native'
import MiliaService from '../../services/api';
import styles from './styles';

class Chat extends Component {

  state = {
    placeToAdd: {},
    itinerary: {},
    dayChose: {},
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

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: styles.bubbleColor.color,
          }
        }}
      />
    )
  }  

  async componentWillMount() {
    const email = this.props.screenProps.state.email;
    const lastPosition = this.props.screenProps.state.lastPosition;
    const messages = this.props.screenProps.state.messages.data;
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
  
  async addToItinerary(replie) {
    const placeMarker = JSON.parse(replie.marker);
    const itinerary = JSON.parse(replie.itinerary);

    const newMessage = {
      text: replie.value,
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      user: {
        _id: 1
      }
    };

    this.setState(previousState => ({
      itinerary: itinerary,
      placeToAdd: placeMarker,
      messages: GiftedChat.append(previousState.messages, [newMessage]),
    }));

    const replieMessage = {
      _id: placeMarker.identifier,
      text: `Para qual dia do seu roteiro você quer adicionar ${placeMarker.title}?`,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Milia',
        avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
      },
      quickReplies: {
        type: 'radio',
        keepIt: false,
        values: itinerary.itinerary.days.map((d, index) => {
          const obj = {
            value: index,
            function: 'addToSpecificDay',
          };

          if(index === 0) {
            obj.title = 'Hoje';
            return obj;
          }

          if(index === 1) {
            obj.title = 'Amanhã';
            return obj;
          }
          
          obj.title = d.name
          return obj;
        }),
      },
    };     

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [replieMessage]),
    }));
  }

  async navigateTo(replie) {
    this.props.navigation.navigate(replie.value, { newDay: this.state.dayChoose, newDayIndex: replie.dayIndex });
  }

  async addToSpecificDay(replie) {
    const newMessage = {
      text: `${replie.title}.`,
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      user: {
        _id: 1
      }
    };

    let replieMessage = {
      _id: Math.round(Math.random() * 1000000),
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Milia',
        avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
      },      
    };

    const itineraryToUpdate = this.state.itinerary.itinerary;
    const dayChoose = itineraryToUpdate.days[replie.value];

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [newMessage]),
      typingText: 'Milia está digitando...',
      dayChoose,
    }));
    

    if(dayChoose.markers.filter(m => m.identifier === this.state.placeToAdd.identifier).length) {
      replieMessage.text = 'Ops, parece que esse lugar já está incluso no dia que você quer adicionar.';

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [replieMessage]),
      }));
      
      const reReplieMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: `Para qual dia do seu roteiro você quer adicionar ${this.state.placeToAdd.title}?`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Milia',
          avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
        },
        quickReplies: {
          type: 'radio',
          keepIt: false,
          values: itineraryToUpdate.days.map((d, index) => {
            const obj = {
              value: index,
              function: 'addToSpecificDay',
            };

            if(index === 0) {
              obj.title = 'Hoje';
              return obj;
            }

            if(index === 1) {
              obj.title = 'Amanhã';
              return obj;
            }
            
            obj.title = d.name
            return obj;
          }),
        },      
      }; 

      return this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [reReplieMessage]),
        typingText: '',
      }));
    }

    dayChoose.markers.push(this.state.placeToAdd);

    itineraryToUpdate.days[replie.value] = dayChoose;

    const newItinerary = {
      hotelLocation: itineraryToUpdate.hotelLocation,
      days: itineraryToUpdate.days,
    };

    await this.miliaService.updateItinerary({itinerary: newItinerary, tripId: this.state.itinerary.tripId})

    const finalMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: `Sucesso! ${this.state.placeToAdd.title} foi adicionado para ${replie.title.toLowerCase()} no seu roteiro. Clique no botão para ver o roteiro atualizado.`,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Milia',
        avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
      },
      quickReplies: {
        type: 'radio',
        keepIt: false,
        values: [{
          title: 'Ir para o roteiro',
          value: 'Roteiro',
          dayIndex: replie.value,
          function: 'navigateTo',
        }],
      },       
    };

    return this.setState(previousState => ({
      itinerary: itineraryToUpdate,
      messages: GiftedChat.append(previousState.messages, [finalMessage]),
      typingText: '',
    }));    
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
        renderBubble={this.renderBubble}
      />
    )
  }
};


export default Chat;