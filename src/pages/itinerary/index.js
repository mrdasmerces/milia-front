import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, ProviderPropType, Marker }from 'react-native-maps';

let animationTimeout;
const timeout = 2000;

class Itinerary extends Component {
  constructor(props) {
    super(props);

    propTypes = {
      provider: ProviderPropType,
    };

    this.state = {
      region : {
        latitude: -26.253902,
        longitude: 28.013295,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [
        {
          image: 'http://icom-russia.com/bitrix/templates/icom/components/ithive/offices.list/.default/images/museum-icon.png',
          identifier: '1',
          key: `31`,
          latlng: {
            latitude: -26.253902,
            longitude: 28.013295,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,            
          },
          title: 'Golden Falcon Spur Steak Ranch',
          description: 'Ótimas carnes!',
        },
        {
          image: 'http://icom-russia.com/bitrix/templates/icom/components/ithive/offices.list/.default/images/museum-icon.png',
          identifier: '2',
          key: `21`,
          latlng: {
            latitude: -26.237854,
            longitude: 28.008372,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,            
          },
          title: 'Museu do Apartheid',
          description: 'Museu que narra a história da África do Sul no século 20 e o extinto sistema de apartheid.',
        },               
      ]
    }

    this.mapStyle = require('../../utils/googleMapsStyle.json');
  }

  componentWillUnmount() {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
  }

  componentDidMount() {
    animationTimeout = setTimeout(() => {
      //this.map.fitToSuppliedMarkers(this.state.markers.map(m => m.identifier), false);
    }, timeout);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
    });

    return(
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          ref={ref => {
            this.map = ref;
          }}
          style={styles.map}
          region={this.state.region}
          onRegionChange={(e) => this.onRegionChange(e)}
        >
          {this.state.markers.map(marker => (
          <Marker
            identifier={marker.identifier}
            key={marker.key}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
          ))}
        </MapView>
      </View>
    );
  }
}

export default Itinerary;