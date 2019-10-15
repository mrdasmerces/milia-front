import React, { Component } from 'react';

import {
  ScrollView, View, Text,
} from 'react-native';

import Modal from "react-native-modal";
import { Card, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

import MiliaService from '../../services/api';
import Loader from '../../common/loader';
import styles from './styles';

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
    visibleModalId: null,
    visibleModal: null,
    details: {},
  };

  miliaService = new MiliaService();

  async componentWillMount() {
    this.setState({ loading: true });

    const email = this.props.screenProps.state.email;
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
      details: resumeData.data.details,
    })

    this.setState({ loading: false });
  }

  executeBottonAction = () => {
    if(this.state.buttonAction === 'Milia' || this.state.buttonAction === 'Roteiro') {
      return this.props.navigation.navigate(this.state.buttonAction);
    }

    this.setState({ visibleModal: 'scrollable' })
  }

  handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    });
  };

  handleScrollTo = p => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(p);
    }
  };

  renderModalContent = () => (
    <View style={styles.scrollableModal}>
    <ScrollView
      ref={ref => (this.scrollViewRef = ref)}
      onScroll={this.handleOnScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.scrollableModalContent1}>
        <Text style={styles.scrollableModalText1}>{this.state.details.placesVisited} 💡</Text>
      </View>    
      <View style={styles.scrollableModalContent2}>
        <Text style={styles.scrollableModalText2}>{this.state.details.placesToVisit} 🗺</Text>
      </View>
      <View style={styles.scrollableModalContent4}>
        <Text style={styles.scrollableModalText4}>{this.state.details.timeline} 🏆</Text>
      </View>      
      <View style={styles.scrollableModalContent3}>
        <Text style={styles.scrollableModalText3}>{this.state.details.messages} ✉️</Text>
      </View>           
    </ScrollView>
  </View>
  );

  render() {
    const { navigate } = this.props.navigation
    return(
      <ScrollView>
        {this.state.loading && 
        <Loader
          loading={this.state.loading} />
        }
        <Modal
          isVisible={this.state.visibleModal}
          onSwipeComplete={() => this.setState({ visibleModal: null })}
          swipeDirection="down"
          scrollTo={this.handleScrollTo}
          scrollOffset={this.state.scrollOffset}
          scrollOffsetMax={400 - 300}
          onBackdropPress={() => this.setState({ visibleModal: null })}
          style={styles.bottomModal}>
            {this.renderModalContent()}
        </Modal>        
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
              onPress={this.executeBottonAction}
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
              title='Ver diário'
              color="#FC6663"
            />
          </CardAction>          
        </Card>                    
      </ScrollView>
    );
  }
}

export default Resume;