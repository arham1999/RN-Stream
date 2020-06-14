import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { firebaseCredentials } from "../constants/credentials";
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseCredentials);
}

export const firebaseGoogleLogin = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const credential = auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
        await auth().signInWithCredential(credential);
        let userAllowed = await firestore().collection('userAllowed').doc('users').get();
        if (userAllowed.data().users.find(email => userInfo.user.email === email)) {
            return {
                name: userInfo.user.name,
                email: userInfo.user.email
            }
        }
        else {
            await signOut();
            return null
        }
    } catch (error) {
        console.log(error);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log("user cancelled the login flow");
        }
        else if (error.code === statusCodes.IN_PROGRESS) {
            console.log("operation (f.e. sign in) is in progress already");
        }
        else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log("play services not available or outdated");
        }
        else {
            console.log("some other error happened");
        }
    }
}

export const getCurrentUserInfo = async () => {
    return GoogleSignin.signInSilently();
};

export const checkAccessKey = async (accessKey) => {
    let reqEvent = await firestore().collection("events").where("accessPin", "==", accessKey).get();
    if (reqEvent.empty) {
        return null;
    }
    let link;
    reqEvent.forEach(res => {
        link = res.data().rtmpLink;
    });
    return link;
}

export const signOut = async () => {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await auth().signOut();
    } catch (error) {
        console.error(error);
    }
};