import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, TextInput, ActivityIndicator, Alert } from 'react-native';
import { checkAccessKey, signOut } from '../../config/firebase';
import { logout } from "../../store/actions/login";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";

const Pin = ({ navigation }) => {
    const dispatch = useDispatch();
    const [accessKey, setAccessKey] = useState("");
    const [loader, setLoader] = useState(false);

    const validateAccessKey = async () => {
        if (!accessKey) {
            return Alert.alert('Error', 'Please write access key');
        }
        setLoader(true);
        let link = await checkAccessKey(accessKey);
        setLoader(false);
        if (link === null) {
            return Alert.alert('Error', 'Access key is invalid');
        }
        navigation.push('Stream', { rtmpLink: link });
    }

    const signUserOut = async () => {
        setLoader(true);
        await signOut();
        dispatch(logout());
        setLoader(false);
        navigation.replace("Login");
    }

    return (
        <ImageBackground source={require('../../assets/background.gif')} style={styles.BackgroundImage}>
            <View style={styles.MainContainer}>
                <TextInput style={styles.AccessPinInput} autoCorrect={false} onChangeText={text => setAccessKey(text)} value={accessKey} />
                {!loader ? <>
                    <TouchableOpacity activeOpacity={0.5} style={styles.StreamButton} onPress={validateAccessKey}>
                        <Text style={styles.ButtonText}>Start Streaming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={styles.LoginButton} onPress={signUserOut}>
                        <Text style={styles.ButtonText}>Logout</Text>
                    </TouchableOpacity>
                </> : <ActivityIndicator size={50} color="red" style={{ marginTop: 30 }} />}
            </View>
        </ImageBackground>
    );
};

export default Pin;