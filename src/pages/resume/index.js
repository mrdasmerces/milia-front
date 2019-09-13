import React, { Component } from 'react';

import {
  ScrollView, View, Text,
} from 'react-native';

import { Card, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

class Resume extends Component {

  state = {
    imageUri: 'http://bit.ly/2GfzooV',
    imageTitle: 'Viagem atual para África do Sul',
    city: 'Joanesburgo',
    cardText: 'Dia 2 de 10',
    buttonTitle: 'Explorar',
    buttonAction: 'Roteiro',
    timelinePosts: 4,
    miliaResponses: 57,
  };

  render() {
    const { navigate } = this.props.navigation
    return(
      <ScrollView>
        <Card>
          <CardImage 
            source={{uri: this.state.imageUri}} 
            title={this.state.imageTitle}
          />
          <CardContent text={this.state.cardText} />
          <CardAction 
            separator={true}
            inColumn={false}>
            <CardButton
              onPress={() => navigate(this.state.buttonAction)}
              title={this.state.buttonTitle}
              color="#FC6663"
            />
          </CardAction>
        </Card>
        <Card>
          <CardImage 
            source={{uri: 'http://numb.honey-vanity.net/wp-content/uploads/2017/05/17-05-08-19-11-29-585_deco-1024x576.jpg'}} 
            title='Diário'
          />          
          <CardContent text={`Você fez ${this.state.timelinePosts} postagens no diário`} />
          <CardAction 
            separator={true} 
            inColumn={false}>
            <CardButton
              onPress={() => navigate('Diário')}
              title='Novo post'
              color="#FC6663"
            />
          </CardAction>          
        </Card>
        <Card>
          <CardImage 
            source={{uri: 'https://jemmaimages.blob.core.windows.net/katablog-wordpress/2019/01/Bringing-Life-and-Personality-to-Your-Chatbots-02-1024x576.jpg'}} 
            title='Chat'
          />          
          <CardContent text={`Você falou com a Milia ${this.state.miliaResponses} vezes`} />
          <CardAction 
            separator={true} 
            inColumn={false}>
            <CardButton
              onPress={() => navigate('Milia')}
              title='Falar com a Milia'
              color="#FC6663"
            />
          </CardAction>          
        </Card>                     
      </ScrollView>
    );
  }
}

export default Resume;