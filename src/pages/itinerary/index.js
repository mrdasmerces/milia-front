import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';
import { InputGray, ErrorMessage, Image, Button, ButtonText } from '../signIn/styles';
import Toast, {DURATION} from 'react-native-easy-toast'
import DraggableFlatList from 'react-native-draggable-flatlist'
import MapView, { ProviderPropType, Marker } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import RadioForm from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
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

const radio_props_modes = [
  {label: 'A pé', value: 'WALKING' },
  {label: 'De carro', value: 'DRIVING' }
];

const radio_props_description = {
  9: 'Coragem, ok? Serão muitos lugares pra ver!',
  6: 'Você vai se aventurar, mas não vai cansar.',
  3: 'Você é curioso, mas nem tanto. Ritmo leve.',
}

let COUNT_RENDER = 0;

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
      return this.refs.toast.show('Ops, parece que você não tem nenhuma viagem próxima! Fale já com a Milia para cadastrar sua trip.', DURATION.FOREVER);
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
      tripDays: moment(this.state.actualTrip.endTripDate).diff(moment(this.state.actualTrip.startTripDate), 'days')+1,
    }

    const itinerary = await this.miliaService.buildItinerary(params);

    const draggableItens = [];
    for(const day of itinerary.data.days) {
      const dayIndex = day.name;
      let label = `${dayIndex}:`
      for(const marker of day.markers) {
        label = label.concat(` ${marker.title},`)
      }
      label = label.concat(' etc.')
      draggableItens.push({dayIndex, label});
    }

    this.setState({
      loading: false,
      attractionsList: draggableItens.map(d => ({
        key: d.dayIndex,
        label: d.label,
        backgroundColor: '#FC6663',
      })),
      itinerary: itinerary.data
     });
     
  };  

  onSubmitStep = async () => {
    this.setState({
      loading: true,
    });

    const newItineraryReOrdened = [];

    for(let actualDay = 1; actualDay <= this.state.attractionsList.length; actualDay++){
      for(const oldDay of this.state.itinerary.days) {
        if(this.state.attractionsList[actualDay-1].key === oldDay.name) {
          newItineraryReOrdened.push({
            name: `Dia ${actualDay}`,
            markers: oldDay.markers
          });

          break;
        }
      }
    }

    const newItinerary = {
      hotelLocation: this.state.itinerary.hotelLocation,
      days: newItineraryReOrdened,
    };

    await this.miliaService.updateItinerary({itinerary: newItinerary, tripId: this.state.actualTrip.tripId})

    this.setActualItineraryDay(this.state.actualTrip, newItinerary);

    this.setState({
      itinerary: newItinerary,
      buildItinerary: false,
      loading: false,
    });
  };
  
  onSelectProfile = (value) => {
    this.setState({
      attractionsPerDay:value,
      radio_props_description_actual: radio_props_description[value],
    })
  }
  
  onSelectMode = (value) => {
    this.setState({
      mode:value,
    })
  } 

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <TouchableOpacity
        style={{ 
          height: 100, 
          backgroundColor: isActive ? 'blue' : item.backgroundColor,
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
        onLongPress={move}
        onPressOut={moveEnd}
      >
        <Text style={{ 
          fontWeight: 'bold', 
          color: 'white',
          fontSize: 16,
        }}>{item.label}</Text>
      </TouchableOpacity>
    )
  }

  handleOpenMaps = () => {
    const data = {
      source: {
       latitude: this.state.region.latitude,
       longitude: this.state.region.longitude,
     },
     destination: {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    },
     params: [
       {
         key: "travelmode",
         value: this.state.mode        // may be "walking", "bicycling" or "transit" as well
       },
       {
         key: "dir_action",
         value: "navigate",
       }
     ],
     waypoints: this.state.markers.map(m => ({
       longitude: m.longitude,
       latitude: m.latitude,
     })),
   };

   getDirections(data)
  }

  render() {
    COUNT_RENDER++;
    const newDayIndex = this.props.navigation.getParam('newDayIndex');
    const newDay = this.props.navigation.getParam('newDay')

    if(newDayIndex !== undefined && newDay) {
      this.state.itinerary.days[newDayIndex] = newDay;

      if(this.state.actualDay === `Dia ${newDayIndex+1}`) {
        this.state.markers = newDay.markers;
      }
    }

    return(
      <View style={styles.container}>    
        <Toast
          ref="toast"
          style={{backgroundColor:"#FC6663"}}
          position='top'
          positionValue={50}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color:"#FFF"}}
        />        
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
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={styles.textStyle}>Vamos lá!</Text>
                <Text style={styles.textStyle}>Esses são os seus locais selecionados!</Text>
                <Text style={styles.textStyle}>Finalize para ver o mapa com o dia-a-dia.</Text>
                <DraggableFlatList
                  data={this.state.attractionsList}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => `draggable-item-${item.key}`}
                  scrollPercent={5}
                  onMoveEnd={({ data }) => this.setState({ attractionsList: data })}
                />
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
                  const duration = moment.utc().startOf('day').add({ minutes: result.duration }).format('H:mm');
                  this.refs.toast.show(`${this.state.actualDay} - Duração: ${duration}. Distância total: ${result.distance.toFixed()} km.`, DURATION.FOREVER);
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
                  console.log(errorMessage);
                }}
              />
            )} 
        </MapView>
        }
        {!this.state.buildItinerary &&
        <View style={styles.inputContainer}>
          <RadioForm
            style={ { marginTop: 30 }}
            buttonColor={styles.activeLabelColor.color}
            selectedButtonColor={styles.activeLabelColor.color}
            radio_props={radio_props_modes}
            formHorizontal={true}
            labelHorizontal={false}
            onPress={this.onSelectMode}
          />
          <Button onPress={this.handleOpenMaps}>
            <ButtonText> <Icon name="location-arrow" size={25}/> Ir para direções </ButtonText>
          </Button> 
        </View>
        }      
      </View>
    );
  }
}

export default Itinerary;