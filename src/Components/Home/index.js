import React, {Component} from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {usetheme} from '@react-navigation/native';

import PassengerScreen from '../Passenger';
import DriverScreen from '../Driver';
import genericContainer from '../Common/Generic';

const DriverWithGenericContainer = genericContainer(DriverScreen);
const PassengerWithGenericContainer = genericContainer(PassengerScreen);

// const HomeScreen = ({navigation}) => {
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDriver: false,
      isPassenger: false,
    };
  }

  // const { colors } = useTheme();

  // const theme = useTheme();

  render() {
    if (this.state.isDriver) {
      return <DriverWithGenericContainer />;
    }
    if (this.state.isPassenger) {
      return <PassengerWithGenericContainer />;
    }

    return (
      <View style={styles.container}>
        <Button
          title="Passenger"
          onPress={() => this.setState({isPassenger: true})}
        />
        <Button
          title="Driver"
          onPress={() => this.setState({isDriver: true})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    marginTop: 50,
  },
});
