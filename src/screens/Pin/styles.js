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
});