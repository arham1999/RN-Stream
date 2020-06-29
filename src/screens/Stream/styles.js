import { StyleSheet, StatusBar } from 'react-native';
import { screenWidth, screenHeight } from '../../constants/screen';

export default StyleSheet.create({
    CameraContainer: {
        height: '100%'
    },
    CameraView: {
        flex: 1
    },
    CameraButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        width: screenWidth
    },
    ButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    chatOverlay: { 
        padding: 10, 
        position: 'absolute', 
        bottom: 0, 
        marginBottom: 80 ,
        width: screenWidth
    }
});