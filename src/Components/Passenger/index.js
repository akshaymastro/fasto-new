import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TextInput,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {usetheme} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {useTheme} from '../node_modules/react-native-paper';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import apiKey from '../google_api_key';
import _ from 'lodash';
import socketIO from 'socket.io-client';
// import BottomButton from '../component/BottomButton';
import Select2 from 'react-native-select-two';
import Modal from 'react-native-modal';

const mockData = [
  {id: 1, name: 'React Native Developer', checked: true}, // set default checked for render option item
  {id: 2, name: 'Android Developer'},
  {id: 3, name: 'iOS Developer'},
];

const mapDarkStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];

const mapStanderedStyle = [
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
];

//  const HomeScreen = ({navigation}) => {

export default class PassengerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lookingForDriver: false,
      driverIsOnTheWay: false,
      predictions: [],
      isModalVisible: false,
    };
    this.onChangeDestinationDebounced = _.debounce(
      this.onChangeDestination,
      1000,
    );
  }

  openModal() {
    this.setState({isModalVisible: true});
  }

  closeModal() {
    this.setState({isModalVisible: false});
  }

  // const { colors } = useTheme();

  // const theme = useTheme();

  async onChangeDestination(destination) {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}
        &input=${destination}&location=${this.props.latitude},${this.props.longitude}&radius=2000`;
    console.log(apiUrl);
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions,
      });
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  }

  async requestDriver() {
    this.setState({lookingForDriver: true});
    var socket = socketIO.connect(
      'https://CanineHopefulFonts--thevisionclicks.repl.co',
    );

    socket.on('connect', () => {
      console.log('client connected');
      //Request a taxi!
      socket.emit('taxiRequest', this.props.routeResponse);
    });

    socket.on('driverLocation', (driverLocation) => {
      const pointCoords = [...this.props.pointCoords, driverLocation];
      this.map.fitToCoordinates(pointCoords, {
        edgePadding: {top: 140, bottom: 20, left: 20, right: 20},
      });
      this.setState({
        lookingForDriver: false,
        driverIsOnTheWay: true,
        driverLocation,
      });
    });
  }

  render() {
    let marker = null;
    let getDriver = null;
    let findingDriverActIndicator = null;
    let driverMarker = null;

    if (this.props.latitude === null) return null;

    if (this.state.driverIsOnTheWay) {
      driverMarker = (
        <Marker coordinate={this.state.driverLocation}>
          <Image
            source={require('../../assets/ace.png')}
            style={{width: 40, height: 80}}
          />
        </Marker>
      );
    }

    if (this.state.lookingForDriver) {
      findingDriverActIndicator = (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForDriver}
        />
      );
    }

    if (this.props.pointCoords.length > 1) {
      marker = (
        <Marker
          coordinate={this.props.pointCoords[this.props.pointCoords.length - 1]}
        />
      );
      getDriver = (
        <View style={styles.InputField}>
          <View style={styles.InputArea}>
            {/* scroll view indicator remove */}
            <ScrollView horizontal={true} invertStickyHeaders={true}>
              <TouchableOpacity style={styles.TouchableOpacity}>
                <Text style={styles.toselected}>Tata Ace</Text>
                <Image
                  source={require('../../assets/tempo/tata-ace.png')}
                  width={55}
                  style={styles.tempoImageSelected}
                />
                <Text style={styles.toselected}>9 Mins</Text>
                <Text style={styles.toselected}>₹ 500.00</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.TouchableOpacity}>
                <Text>Tata Ape</Text>
                <Image
                  source={require('../../assets/tempo/tata-ace.png')}
                  width={55}
                  style={styles.tempoImage}
                />
                <Text>9 Mins</Text>
                <Text>₹ 500.00</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.TouchableOpacity}>
                <Text>Eco</Text>
                <Image
                  source={require('../../assets/tempo/eeco.png')}
                  width={55}
                  style={styles.tempoImage}
                />
                <Text>5 Mins</Text>
                <Text>₹ 650.00</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.TouchableOpacity}>
                <Text>Pickup</Text>
                <Image
                  source={require('../../assets/tempo/pick-up.png')}
                  width={55}
                  style={styles.tempoImage}
                />
                <Text>8 Mins</Text>
                <Text>₹ 800.00</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.InputAreaContact}>
            <View style={styles.InputAreaContactDetailsPickup}>
              <Text style={styles.InputAreaContactDetailsPickupText}>
                Pickup Contact
              </Text>
            </View>
            <View style={styles.InputAreaContactDetails}>
              <TouchableOpacity onPress={() => this.openModal()}>
                <Text>Show</Text>
              </TouchableOpacity>

              <Modal
                isVisible={this.state.isModalVisible}
                deviceWidth={styles.ex.width}
                deviceHeight={styles.ex.height}>
                <View style={{flex: 1}}>
                  <Text>Hello!</Text>

                  <TouchableOpacity onPress={() => this.closeModal()}>
                    <Text>Hide</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
          <View style={styles.category}>
            <Text style={styles.categoryItem}>Choose a category</Text>
            <Select2
              isSelectSingle
              style={{borderRadius: 5}}
              colorTheme="blue"
              popupTitle="Select Category"
              title="Select Category"
              searchPlaceHolderText="Search Category"
              cancelButtonText="Cancel"
              selectButtonText="Select"
              data={mockData}
              onSelect={(data) => {
                this.setState({data});
              }}
              onRemoveItem={(data) => {
                this.setState({data});
              }}
            />
          </View>

          {/* <BottomButton
            onPressFunction={() => this.requestDriver()}
            buttonText="REQUEST 🚗">
            {findingDriverActIndicator}
          </BottomButton> */}
        </View>
      );
    }

    const predictions = this.state.predictions.map((prediction) => (
      <TouchableHighlight
        onPress={async () => {
          const destinationName = await this.props.getRouteDirections(
            prediction.place_id,
            prediction.structured_formatting.main_text,
          );

          this.setState({predictions: [], destination: destinationName});
          this.map.fitToCoordinates(this.props.pointCoords, {
            edgePadding: {top: 20, bottom: 20, left: 20, right: 20},
          });
        }}
        key={prediction.id}>
        <View>
          <Text style={styles.suggestions}>
            {prediction.structured_formatting.main_text}
          </Text>
        </View>
      </TouchableHighlight>
    ));
    return (
      <View style={styles.top}>
        <View style={styles.action}>
          <Feather
            name="map-pin"
            color="green"
            size={20}
            style={styles.feather}
          />
          <TextInput
            placeholder="enter Destination.."
            value={this.state.destination}
            style={styles.textInput}
            clearButtonMode="always"
            onChangeText={(destination) => {
              console.log(destination);
              this.setState({destination});
              this.onChangeDestinationDebounced(destination);
            }}
          />
        </View>
        {predictions}

        {/* <Button
           title="Go to Details Screen"
           onPress={() => navigation.navigate("Details")}
         />   */}

        {/* <View style={styles.action}>
         <Text >Turn On Device Location </Text>
         <MaterialIcons 
          name="navigate-next"
         color="blue"
          size={20}
         />
         </View>  */}
        <MapView
          ref={(map) => {
            this.map = map;
          }}
          style={styles.map}
          //  customMapStyle={theme =(theme.dark ? mapDarkStyle : mapStanderedStyle)}
          initialRegion={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}>
          <Polyline
            coordinates={this.props.pointCoords}
            strokeWidth={4}
            strokeColor="#f9a602"
          />
          {marker}
          {driverMarker}

          <Marker
            coordinate={this.props}
            image={require('../../assets/map_marker.png')}
            title="Location Title"
            description="this is the discription">
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text style={styles.name}> Favorite Location </Text>
                  {/* <Text>A Short description</Text>   */}
                  <Image
                    style={styles.image}
                    source={require('../../assets/logo-white-back.png')}
                    resizeMode="stretch"
                  />
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>

          {/* <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} /> */}
        </MapView>

        {getDriver}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  suggestions: {
    backgroundColor: 'white',
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5,
  },
  bottomButton: {
    backgroundColor: 'black',
    marginTop: 'auto',
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: 'center',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 20,
  },
  destinationInput: {
    height: 40,
    borderWidth: 1,
    marginTop: 50,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    marginTop: 10,
    paddingLeft: 10,
    color: 'black',
    backgroundColor: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  top: {
    flex: 1,
    paddingHorizontal: 20,
  },
  feather: {
    paddingRight: 10,
    marginTop: 20,
  },
  opneLocation: {
    color: 'blue',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    zIndex: -9999,
  },
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 80,
  },
  textStyle: {
    marginLeft: 30,
    padding: 5,
    color: 'black',
    backgroundColor: 'white',
    fontSize: 14,
    borderWidth: 1,
  },
  InputArea: {
    flexDirection: 'row',
  },
  InputField: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 'auto',
  },
  TouchableOpacity: {
    padding: 10,
    width: '25%',
    alignItems: 'center',
  },
  tempoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  toselected: {
    fontWeight: 'bold',
  },
  tempoImageSelected: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
  InputAreaContact: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  InputAreaContactDetails: {
    width: '50%',
    alignItems: 'center',
    flexDirection: 'row',
    color: 'blue',
    justifyContent: 'center',
  },
  InputAreaContactDetailsPickup: {
    width: '50%',
    alignItems: 'center',
    fontSize: 15,
  },
  InputAreaContactDetailsText: {
    fontWeight: 'bold',
  },
  category: {
    flexDirection: 'row',
  },
  categoryItem: {
    padding: 5,
    textAlignVertical: 'center',
  },
  ex: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
});
