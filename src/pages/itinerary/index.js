import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
} from 'react-native';

import styles from './styles';
import { InputGray, ErrorMessage, Image } from '../signIn/styles';

import MapView, { ProviderPropType, Marker } from 'react-native-maps';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import RadioForm from 'react-native-simple-radio-button';
import Loader from '../../common/loader';

import MapViewDirections from 'react-native-maps-directions';
import MiliaService from '../../services/api';
import moment from "moment";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCbhJQ9YTC73K1hRq0vH6fGkwBnW0BjeYc';

const radio_props = [
  {label: 'Desbravador', value: 9 },
  {label: 'Aventureiro', value: 6 },
  {label: 'Curioso', value: 3 }
];

const radio_props_description = {
  9: 'Coragem, ok? Serão muitos lugares pra ver!',
  6: 'Você vai se aventurar, mas não vai cansar.',
  3: 'Você é curioso, mas nem tanto. Ritmo leve.',
}

class Itinerary extends Component {
  constructor(props) {
    super(props);

    propTypes = {
      provider: ProviderPropType,
    };


    this.state = {
      radio_props_description_actual: 'Coragem, ok? Serão muitos lugares pra ver!',
      actualTrip: {},
      actualDay: '',
      attractionsList: [],
      loading: false,
      errorMessage: '',
      hotelName: '',
      hotel: {},
      attractionsPerDay: 10,
      errors: false,
      buildItinerary: false,
      showToast: false,
      itinerary: {},
      mode: 'WALKING',
      actualDay: '',
      region : {
        latitude: -23.533773,
        longitude: 46.625290,
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
    this.setState({ loading: true });

    const email = this.props.screenProps.email;

    const itineraryData = await this.miliaService.getItinerary(email);

    if(!itineraryData.data.actualTrip) {
      return this.setState({
        showToast: true,
        loading: false,
      });
    }

    this.setState({
      actualTrip: itineraryData.data.actualTrip
    });

    if(!itineraryData.data.itinerary) {
      return this.setState({
        buildItinerary: true,
        loading: false,
      });    
    }

    this.setActualItineraryDay(this.state.actualTrip, itineraryData.data.itinerary.itinerary);

    this.setState({
      itinerary: itineraryData.data.itinerary.itinerary,
      buildItinerary: false,
      loading: false,
    });

  }

  setActualItineraryDay = (actualTrip, itinerary) => {
    const numberDays = moment(moment().format()).diff(actualTrip.startTripDate, 'days');
    this.setState({
      actualDay: `Dia ${numberDays > 0 ? numberDays : 1}`,
    });
    const actualItinerary = itinerary.days.filter(d => d.name === this.state.actualDay)[0];

    const hotelMarker = {
      identifier: itinerary.hotelLocation.place_id,
      latitude: itinerary.hotelLocation.geometry.location.lat,
      longitude: itinerary.hotelLocation.geometry.location.lng,
      title: itinerary.hotelLocation.name,
      description: 'Você está hospedado aqui',
    };

    actualItinerary.markers.unshift(hotelMarker);

    this.setState({
      markers: actualItinerary.markers,
      region: {
        latitude: hotelMarker.latitude,
        longitude: hotelMarker.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    });    
  }

  handleHotelNameChange = (hotelName) => {
    this.setState({
      errorMessage: '',
      hotelName,
    });    
  };

  validateHotel = async () => {
    if(!this.state.hotelName) {
      return this.setState({ errorMessage: 'Você deve preencher o nome do hotel.' });
    }

    this.setState({ loading: true });

    const hotelFound = await this.miliaService.getHotel(this.state.hotelName, GOOGLE_MAPS_APIKEY);

    if(hotelFound.data && hotelFound.data.candidates && hotelFound.data.candidates[0]) {

      return this.setState({
        errorMessage: '',
        hotel: hotelFound.data.candidates[0],
        errors: false,
        loading: false,
      });
    }

    this.setState({
      errorMessage: 'Ops, não foi encontrado seu hotel.',
      errors: true,
      loading: false,
    });
  }; 

  buildItinerary = async () => {
    this.setState({ loading: true });

    const params = {
      attractionsPerDay: this.state.attractionsPerDay,
      hotelLocation: this.state.hotel,
      tripId: this.state.actualTrip.tripId,
      city: this.state.actualTrip.initialCity,
      tripDays: moment(this.state.actualTrip.endTripDate).diff(moment(this.state.actualTrip.startTripDate), 'days'),
    }

    const itinerary = await this.miliaService.buildItinerary(params);

    alert(itinerary);
  };  

  onSubmitStep = () => {
    alert('epa');
  };
  
  onSelectProfile = (value) => {
    this.setState({
      attractionsPerDay:value,
      radio_props_description_actual: radio_props_description[value],
    })
  } 

  render() {
    return(
      <View style={styles.container}>
        {this.state.loading && 
        <Loader
          loading={this.state.loading} />
        }      
        {this.state.buildItinerary && 
          <ProgressSteps
            activeLabelColor={styles.activeLabelColor.color}
            completedStepIconColor={styles.completedStepIconColor.color}
            completedProgressBarColor={styles.completedProgressBarColor.color}
            activeStepIconBorderColor={styles.activeStepIconBorderColor.color}>
            <ProgressStep label="Hotel" 
              onNext={this.validateHotel} 
              nextBtnText={'Próximo'}
              nextBtnTextStyle={styles.nextBtnTextStyle}
              errors={this.state.errors}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.textStyle}>Vamos pra começar!</Text>
                <Text style={styles.textStyle}>Informe o hotel que ficará hospedado.</Text>
                <InputGray
                  placeholder="Nome do Hotel"
                  value={this.state.hotelName}
                  onChangeText={this.handleHotelNameChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {this.state.errorMessage.length !== 0 && <ErrorMessage>{this.state.errorMessage}</ErrorMessage>}
              </View>
            </ProgressStep>
            <ProgressStep label="Perfil" 
              nextBtnTextStyle={styles.nextBtnTextStyle}
              previousBtnTextStyle={styles.nextBtnTextStyle}
              onNext={this.buildItinerary} 
              previousBtnText={'Anterior'}
              nextBtnText={'Próximo'} 
              errors={this.state.errors}>
              <View style={{ alignItems: 'center' }}>
              <Text style={styles.textStyle}>Quase lá!</Text>
              <Text style={styles.textStyle}>Selecione seu perfil de turista.</Text>
              <RadioForm
                style={ { marginTop: 30 }}
                buttonColor={styles.activeLabelColor.color}
                selectedButtonColor={styles.activeLabelColor.color}
                radio_props={radio_props}
                onPress={this.onSelectProfile}
              />
                {this.state.radio_props_description_actual.length !== 0 && <ErrorMessage>{this.state.radio_props_description_actual}</ErrorMessage>}
              </View>
            </ProgressStep>
            <ProgressStep label="Sugestões" 
              nextBtnTextStyle={styles.nextBtnTextStyle}
              previousBtnTextStyle={styles.nextBtnTextStyle}
              finishBtnText={'Finalizar'}
              previousBtnText={'Anterior'}
              onSubmit={this.onSubmitStep} 
              errors={this.state.errors}>
              <View style={{ alignItems: 'center' }}>
                  <Text>This is the content within step 3!</Text>
              </View>
            </ProgressStep>            
          </ProgressSteps>
        }
        {!this.state.buildItinerary && 
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
        }
      </View>
    );
  }
}

export default Itinerary;