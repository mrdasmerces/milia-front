import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
} from 'react-native';

import styles from './styles';

import MapView, { PROVIDER_GOOGLE, ProviderPropType, Marker } from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';
import MiliaService from '../../services/api';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCbhJQ9YTC73K1hRq0vH6fGkwBnW0BjeYc';

class Itinerary extends Component {
  constructor(props) {
    super(props);

    propTypes = {
      provider: ProviderPropType,
    };

    this.state = {
      showToast: false,
      itinerary: {},
      mode: 'DRIVING',
      actualDay: '',
      region : {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [
        {
          identifier: '1',
          latitude: 0,
          longitude:0,
          title: '',
          description: '',
        },              
      ]
    }

    this.mapStyle = require('../../utils/googleMapsStyle.json');
  }

  miliaService = new MiliaService();

  async componentWillMount() {
    const email = this.props.screenProps.email;

    const itineraryData = await this.miliaService.getItinerary(email);

    if(!itineraryData.data.actualTrip) {
      return this.setState({
        showToast: true,
      });
    }

    if(!itineraryData.data.itinerary) {
  
    }


  }

  render() {
    return(
      <View style={styles.container}>  
        <MapView
          provider={this.props.provider}
          ref={ref => {
            this.mapView = ref;
          }}
          style={styles.map}
          initialRegion={this.state.region}
        >
          {this.state.markers.map((coordinate, index) =>
          <Marker
            identifier={coordinate.identifier}
            key={`coordinate_${index}`}
            coordinate={coordinate}
            title={coordinate.title}
            description={coordinate.description}
          />
          )}
          {(this.state.markers.length >= 2) && (
            <MapViewDirections
              origin={this.state.region}
              waypoints={this.state.markers}
              destination={this.state.region}
              apikey={GOOGLE_MAPS_APIKEY}
              language='pt-BR'
              strokeWidth={3}
              strokeColor="#FC6663"
              mode={this.state.mode}
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={result => {
                console.log(`Distance: ${result.distance} km`)
                console.log(`Duration: ${result.duration} min.`)
                this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width / 10),
                    bottom: (height / 10),
                    left: (width / 10),
                    top: (height / 10),
                  },
                });              
              }}
              onError={(errorMessage) => {
                console.log('GOT AN ERROR');
              }}
            />
          )}          
        </MapView>
      </View>
    );
  }
}

export default Itinerary;