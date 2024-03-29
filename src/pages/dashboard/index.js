import React, { Component } from 'react'
import Geolocation from '@react-native-community/geolocation';
import BottomNavigation from './routes';
import MiliaService from '../../services/api';

class Dashboard extends Component {
  state = {
    initialPosition: '',
    lastPosition: '',
    email: '',
    messages: [],
    timeline: [],
  }

  miliaService = new MiliaService();

  watchID = null;

  async componentWillMount() {
    const email = this.props.navigation.getParam('email');

    this.setState({
      email,
    });

    this.watchID != null && Geolocation.clearWatch(this.watchID);

    const messages = await this.miliaService.getPreviousMessages(email);
    const timeline = await this.miliaService.getTimelinePosts(email);

    this.setState({
      messages,
      timeline,
    });
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      error => {
        this.setState({
          initialPosition: JSON.stringify({
            coords: {
              latitude: -23.574333,
              longitude: -46.623546,
            }
          })
        })
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  render() {
    return (
      <BottomNavigation
        screenProps={{state: this.state, rootNavigation: this.props.navigation}}
      >
      </BottomNavigation>   
    )
  }
};


export default Dashboard;