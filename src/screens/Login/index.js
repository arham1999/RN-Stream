import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { firebaseGoogleLogin } from '../../config/firebase';
import { GoogleSignin } from 'react-native-google-signin';
import { loginUserData } from "../../store/actions/login";
import { useDispatch, useSelector } from "react-redux";
import styles from './styles';

const Login = ({ navigation }) => {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.user);

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: '936694143166-jh4uhtu20d0m87m34undsnev1suii5sr.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true
            // accountName: 'Stover'
        });
    }, [])

    useEffect(() => {
        if (user) {
            navigation.replace('Pin');
        }        
    }, [user])

    const loginUser = async () => {
        setLoader(true);
        let user = await firebaseGoogleLogin();
        if (user) {
            dispatch(loginUserData(user));
        }
        else if(user === null) {
            Alert.alert("Info", "Your account is under review we will update you soon");
        }
        setLoader(false);
    }

    return (
        <ImageBackground source={require('../../assets/background.gif')} style={styles.BackgroundImage}>
           {!loader ? <View style={styles.MainContainer}>
                <TouchableOpacity style={styles.GooglePlusStyle} activeOpacity={0.5} onPress={loginUser}>
                    <Image
                        source={require('../../assets/google-logo.png')}
                        style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Continue With Google </Text>
                </TouchableOpacity>
            </View> : <ActivityIndicator size={50} color="red" />}
        </ImageBackground>
    );
};

export default Login;