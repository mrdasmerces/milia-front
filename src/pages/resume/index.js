import React, { Component } from 'react';

import {
  ScrollView, View, Text,
} from 'react-native';

import { Card, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

import MiliaService from '../../services/api';
import Loader from '../../common/loader';

class Resume extends Component {
  state = {
    imageUri: 'https://data.1freewallpapers.com/download/map-road-travel-trip-1024x576.jpg',
    imageTitle: 'Carregando...',
    cardText: 'Carregando...',
    buttonTitle: 'Carregando...',
    buttonAction: '',
    timelineText: 'Carregando...',
    miliaText: 'Carregando...',
    email: '',
    loading: false,
  };

  miliaService = new MiliaService();

  async componentWillMount() {
    this.setState({ loading: true });

    const email = this.props.screenProps.email;
    this.setState({email});

    const resumeData = await this.miliaService.getResume(email);

    this.setState({
      imageUri: resumeData.data.imageUri,
      imageTitle: resumeData.data.imageTitle,
      cardText: resumeData.data.cardText,
      buttonTitle: resumeData.data.buttonTitle,
      buttonAction: resumeData.data.buttonAction,
      timelineText: resumeData.data.timelineText,
      miliaText: resumeData.data.miliaText,
    })

    this.setState({ loading: false });
  }

  render() {
    const { navigate } = this.props.navigation
    return(
      <ScrollView>
        {this.state.loading && 
        <Loader
          loading={this.state.loading} />
        }
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
            source={{uri: 'https://jemmaimages.blob.core.windows.net/katablog-wordpress/2019/01/Bringing-Life-and-Personality-to-Your-Chatbots-02-1024x576.jpg'}} 
            title='Chat'
          />          
          <CardContent text={this.state.miliaText} />
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
        <Card>
          <CardImage 
            source={{uri: 'http://numb.honey-vanity.net/wp-content/uploads/2017/05/17-05-08-19-11-29-585_deco-1024x576.jpg'}} 
            title='Diário'
          />          
          <CardContent text={this.state.timelineText} />
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
      </ScrollView>
    );
  }
}

export default Resume;