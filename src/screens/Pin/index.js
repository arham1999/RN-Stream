import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, ImageBackground, TextInput, Button } from 'react-native';
import styles from "./styles";

const Pin = ({ navigation }) => {

    return (
        <ImageBackground source={require('../../assets/background.gif')} style={styles.BackgroundImage}>
            <View style={styles.MainContainer}>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', padding: 10 }}
                />
                <Text>{"\n"}</Text>
                <Button
                title="Start Streaming"
                onPress={_ => navigation.push('Stream')}
                color="red"
                />
            </View>
        </ImageBackground>
    );
};

export default Pin;