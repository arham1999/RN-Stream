import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, ImageBackground } from 'react-native';
import { firebaseGoogleLogin } from '../../config/firebase';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { loginUserData } from "../../store/actions/login";
import { useDispatch, useSelector } from "react-redux";
import styles from './styles';

const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.user)

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '936694143166-jh4uhtu20d0m87m34undsnev1suii5sr.apps.googleusercontent.com',
            offlineAccess: true,
            forceConsentPrompt: true,
            // accountName: 'Stover'
        });
    }, [])

    const loginUser = async () => {
        let email = await firebaseGoogleLogin();
        console.log(email)
        if (email) {
            navigation.push('Pin')
            dispatch(loginUserData(email));
        }
    }

    return (
        <ImageBackground source={require('../../assets/background.gif')} style={styles.BackgroundImage}>
            <View style={styles.MainContainer}>
                <TouchableOpacity style={styles.GooglePlusStyle} activeOpacity={0.5} onPress={loginUser}>
                    <Image
                        source={require('../../assets/google-logo.png')}
                        style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Continue With Google </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default Login;