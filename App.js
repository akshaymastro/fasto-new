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
import Otp from './src/Components/User/Signin/Otpscreen';
import store from './src/redux/store';
import {Provider} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AppTabs = createBottomTabNavigator();
const AppTabsScreen = () => (
  <AppTabs.Navigator>
    <AppTabs.Screen
      name="Contacts"
      component={Home}
      options={{
        tabBarIcon: (props) => (
          <Ionicons name="ios-contacts" size={props.size} color={props.color} />
        ),
      }}
    />
  </AppTabs.Navigator>
);

const AppDrawer = createDrawerNavigator();
const AppDrawerScreen = () => (
  <AppDrawer.Navigator drawerPosition="right" initialRouteName="Home">
    <AppDrawer.Screen
      name="Home"
      component={Home}
      options={{
        gestureEnabled: true,
      }}
    />
  </AppDrawer.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreen = (props) => (
  <AuthStack.Navigator initialRouteName={props.token ? 'drawer' : 'Sigin'}>
    <AuthStack.Screen name="Sigin" component={SignInScreen} />
    <AuthStack.Screen name="otp" component={Otp} />
    <AuthStack.Screen name="drawer" component={AppDrawerScreen} />
    <AuthStack.Screen name="tabs" component={AppTabsScreen} />
  </AuthStack.Navigator>
);

export default function App() {
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
        setToken(token);
        resolve('result');
      }, 2000),
    );
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoading ? (
          <SplashScreen />
        ) : usertoken !== null ? (
          <>
            <AppDrawerScreen />
            {/* <AppTabsScreen /> */}
          </>
        ) : (
          <AuthStackScreen token={usertoken} />
        )}
      </NavigationContainer>
    </Provider>
  );
}

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
