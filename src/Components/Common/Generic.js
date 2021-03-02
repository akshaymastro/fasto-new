import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Keyboard, PermissionsAndroid, Platform} from 'react-native';
import PolyLine from '@mapbox/polyline';
import apiKey from '../google_api_key';

function genericContainer(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        latitude: null,
        longitude: null,
        pointCoords: [],
        destination: '',
        routeResponse: {},
      };
      this.getRouteDirections = this.getRouteDirections.bind(this);
    }

    async checkAndroidPermissions() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Fasto',
            message:
              'Fasto App needs to use your location to shows routs and get rides for you',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    async componentDidMount() {
      //Get current location and set initial region to this
      let granted = false;
      if (Platform.OS === 'ios') {
        granted = true;
      } else {
        granted = await this.checkAndroidPermissions();
      }
      if (granted)
        this.watchId = Geolocation.watchPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => console.log(error),
          {enableHighAccuracy: true, maximumAge: 2000, timeout: 20000},
        );
    }

    componentWillUnmount() {
      Geolocation.clearWatch(watchId);
    }

    async getRouteDirections(destinationPlaceId, destinationName) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${destinationPlaceId}&key=${apiKey}`,
        );
        const json = await response.json();
        console.log(json);
        const points = PolyLine.decode(json.routes[0].overview_polyline.points);
        const pointCoords = points.map((point) => {
          return {latitude: point[0], longitude: point[1]};
        });
        this.setState({
          pointCoords,
          routeResponse: json,
        });
        Keyboard.dismiss();
        return destinationName;
      } catch (error) {
        console.error(error);
      }
    }

    render() {
      return (
        <WrappedComponent
          getRouteDirections={this.getRouteDirections}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          pointCoords={this.state.pointCoords}
          destination={this.state.destination}
          routeResponse={this.state.routeResponse}
        />
      );
    }
  };
}

export default genericContainer;
