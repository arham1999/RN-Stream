import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from '../../constants/screen';

export default StyleSheet.create({
    CameraContainer: {
        height: screenHeight / 2.5
    },
    CameraView: {
        flex: 1
    },
    ButtonContainer: {
        flexDirection: 'row'
    },
    CameraButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        width: screenWidth / 2
    },
    ButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    TabViewInitialLayout: {
        width: screenWidth        
    }
});