import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Button, AsyncStorage, TouchableOpacity, Dimensions, TextInput, StatusBar, Alert, ImageBackground } from 'react-native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { AuthContext } from '../component/context';
import Users from '../model/users';
import { connect, useSelector, useDispatch } from 'react-redux';
import { sendOtp, setUserDetail, userLogin } from "../redux/actions/userAction"

import { useTheme } from '@react-navigation/native';
// import { Andar } from './actions/myactions';
const axios = require('axios');


const SignInScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const image = require('../assets/backgroundSmall.png');
    const { otp, userDetail, user } = useSelector(state => state.user)
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const [view, changeView] = React.useState({
        viewTitle: 'Mobile no.',
        viewPlaceholder: '+91-00000-00000'
    });

    // const { signIn } = React.useContext(AuthContext);



    const OTPInput = (val) => {
        if (val.trim().length >= 5) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true,
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const textInputChange = (val) => {
        if (val.trim().length >= 10) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true,
            });

        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }


    const handlePasswordChnage = (val) => {
        if (val.trim().length >= 8) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateScecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry

        });
    }

    const handleValiUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });

        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const dispatch = useDispatch()
    // const Go = async () => {
    //     dispatch(Andar())
    // }

    const Login = async () => {
        dispatch(setUserDetail(data.username))
        const res = await dispatch(sendOtp({ Mobile: data.username }))
        navigation.navigate('otp')
    }

    const Register = async (GetNumber) => {
        const url = `http://192.168.43.75:4000/auth/createuser`;

        await axios.post(url, { Mobile: GetNumber }).then(async (response) => await AsyncStorage.setItem('USER',
            JSON.stringify(response.data))).catch((error) => console.log(error));
        let GetUser = await AsyncStorage.getItem('USER')
        console.log('User from async when registed as new' + " " + GetUser)
    }

    const GetUser = async (Username) => {
        const url1 = 'http://192.168.43.75:4000/auth/getuser';
        await axios.post(url1, { Mobile: Username })
            .then(async (resp) => await AsyncStorage.setItem('USER', JSON.stringify(resp.data))).catch((error) => console.log(error))
        let GetUser = await AsyncStorage.getItem('USER')
        console.log('User from async' + " " + GetUser)
    }



    const loginHandle = (userName, password) => {
        const foundUser = Users.filter(item => {
            return userName == item.username && password == item.password;
        });

        if (data.username.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong input', 'Username or Password field cannot be empty', [
                { text: 'Okay' }
            ]);
            return;
        }

        if (foundUser.length == 0) {
            Alert.alert('Invalid User', 'Username or Password is incorrect.', [
                { text: 'Okay' }
            ]);
            return;
        }
        signIn(foundUser);
    }
    console.log(userDetail, "otpptptptptp")
    console.log(otp, "otpptptptptp")
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor='#222546'
                barStyle='light-content'
            />


            <ImageBackground
                source={image}
                style={styles.image}>


                <View style={styles.header}>
                    <Text style={styles.text_header}> Welcome! </Text>
                </View>
            </ImageBackground>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, { backgroundColor: colors.background }]}
            >
                <Text style={[styles.text_footer, { color: colors.text }]}> {view.viewTitle} </Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="phone"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        keyboardType="number-pad"
                        maxLength={10}
                        placeholder={view.viewPlaceholder}
                        style={[styles.textInput, { color: colors.text }]}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValiUser(e.nativeEvent.text)}
                    />
                    {data.check_textInputChange ?
                        <Animatable.View>
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => Login()}
                    >
                        <LinearGradient
                            colors={['#222546', '#222546']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, { color: '#fff' }]} >Enter</Text>

                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </Animatable.View>
        </View>
    );
};





export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222546'
    },
    header: {
        flex: 3,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        paddingLeft: 10,
    },
    button: {
        alignItems: 'center',
        marginTop: 50,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    image: {
        flex: 1,
        resizeMode: 'stretch',
    }
});