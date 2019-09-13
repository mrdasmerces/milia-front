import React, { Component } from 'react'
import Geolocation from '@react-native-community/geolocation';
import BottomNavigation from './routes';

class Dashboard extends Component {
  state = {
    initialPosition: '',
    lastPosition: '',
  }

  watchID = null;

  componentWillMount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      error => alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  render() {
    return (
      <BottomNavigation/>    
    )
  }
};


export default Dashboard;