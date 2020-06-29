import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from '../../constants/screen';

export default StyleSheet.create({
    TabViewInitialLayout: {
        width: screenWidth        
    },
    tabIndicator: {
        borderColor: 'red', 
        borderWidth: 2
    },
    tabColor: { 
        backgroundColor: '#f37c76' 
    },
    userListContainer: {
        borderBottomWidth: 1, 
        borderBottomColor: 'grey', 
        padding: 15, 
        marginVertical: 5, 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    userListImage: {
        width: 50, 
        height: 50
    },
    userListText: {
        fontSize: 16, 
        marginLeft: 10, 
        color: 'purple'
    },
    pmChatBackBtn: {
        padding: 5, 
        backgroundColor: 'purple', 
        width: 40
    },
    pmChatBackBtnText: {
        textAlign: 'center', 
        fontSize: 20, 
        color: 'white', 
        fontWeight: 'bold'
    }
});