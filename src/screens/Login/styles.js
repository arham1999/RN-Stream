import { StyleSheet } from 'react-native';
import { screenWidth } from '../../constants/screen';

export default StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    BackgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    GooglePlusStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        height: 45,
        width: screenWidth / 1.4,
        borderRadius: 30,
        margin: 5
    },
    ImageIconStyle: {
        margin: 15,
        height: 25,
        width: 25,
        marginRight: 'auto'
    },
    TextStyle: {
        margin: -15,
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 'auto'
    }
});