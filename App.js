/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from './src/Components/SplashScreen';
import Home from './src/Components/Home';
import SignInScreen from './src/Components/User/Signin';
import store from './src/redux/store';
import {Provider} from 'react-redux';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const StackNavigation = (props) => {
  console.log(props.token, 'tokenenene');
  return (
    <Stack.Navigator>
      {props.token !== null ? (
        <Stack.Screen name="drawer" component={DrawerNav} />
      ) : (
        <Stack.Screen name="Sigin" component={SignInScreen} />
      )}
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const {colors} = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [usertoken, setToken] = useState(null);
  const [userDetail, setUserDetail] = useState('');
  useEffect(() => {
    async function checkTime() {
      const data = await performTimeConsumingTask();
      if (data !== null) {
        setLoading(false);
      }
    }
    checkTime();
  }, []);
  const performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(async () => {
        let token = await AsyncStorage.getItem('token');
        console.log(token, 'tokenenne');
        setToken(token);

        resolve('result');
      }, 2000),
    );
  };
  return (
    <>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <Provider store={store}>
          <NavigationContainer>
            <StackNavigation token={usertoken} />
          </NavigationContainer>
        </Provider>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    // backgroundColor: colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    // color: colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    // color: colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    // color: colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
