import firebase from "firebase";
import "firebase/firestore";
import { firebaseCredentials } from "../constants/credentials";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

firebase.initializeApp(firebaseCredentials);

export const firebaseGoogleLogin = async () => {

    try {
        // add any configuration settings here:
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        let userAllowed = ['farrukhehsan444@gmail.com', 'arhamawan99@gmail.com'];
        // await firebase.firestore().collection('userAllowed').doc('users').get();
        if(userAllowed.find(email => userInfo.user.email === email)) {
            return userInfo.user.email
        }
        // this.setState({ userInfo: userInfo, loggedIn: true });
        // let tokens = await GoogleSignin.getTokens();
        // create a new firebase credential with the token
        // const credential = firebase.auth.GoogleAuthProvider.credential(tokens.idToken, tokens.accessToken)
        // // login with credential
        // const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
        // console.log('firebaseUserCredential', firebaseUserCredential)
        // console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (error) {
        console.log(error)
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            console.log("user cancelled the login flow");
        } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (f.e. sign in) is in progress already
            console.log("operation (f.e. sign in) is in progress already");
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            console.log("play services not available or outdated");
        } else {
            // some other error happened
            console.log("some other error happened");
        }
    }
}

export const getCurrentUserInfo = async () => {
    try {
        const userInfo = await GoogleSignin.signInSilently();
        // this.setState({ userInfo });
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            // user has not signed in yet
            console.log("user has not signed in yet");
            this.setState({ loggedIn: false });
        } else {
            // some other error
            console.log("some other error happened");
            this.setState({ loggedIn: false });
        }
    }
};

export const signOut = async () => {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        // this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
    } catch (error) {
        console.error(error);
    }
};
