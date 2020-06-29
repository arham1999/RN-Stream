import React, { useRef, useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { useSelector } from "react-redux";
import { initializeTwilioForGroup } from '../../config/twilio';
import styles from './styles';

const Stream = ({ route, navigation }) => {
    const appUser = useSelector(state => state.login.user);
    let [channel, setChannel] = useState(false);
    let [groupMessages, setGroupMessages] = useState([]);
    let [isPublish, setPublish] = useState(false);
    let [publishBtnTitle, setPublishBtnTitle] = useState('Start Publish');
    let [shouldShow, setShouldShow] = useState(false);
    let vb = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true);
        }, 1000);
        (async _ => {
            let response = await initializeTwilioForGroup(appUser.name, route.params.streamId);// route.params.streamId
            let channelExist = await response.channel;
            if (channelExist) {
                setChannel(channelExist);
                try {
                    let messages = await channelExist.getMessages();
                    setGroupMessages(messages.items.map(e => ({
                        name: e.author,
                        message: e.body
                    })));
                } catch (err) {
                    console.log('this is the error:', err);
                }
            }
        })()
    }, [])

    useEffect(() => {
        if (channel && channel.listenerCount('messageAdded') <= 1) {
            channel.on('messageAdded', async function (message) {
                // console.log('new message', message, groupMessages);
                let messages = await channel.getMessages();
                setGroupMessages(messages.items.map(e => ({
                    name: e.author,
                    message: e.body
                })))
            });
        }
    }, [groupMessages, channel])

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
                {
                    title: "Cool Photo App Camera And Microphone Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if ('granted' === PermissionsAndroid.RESULTS.GRANTED) { // granted
                console.log("You can use the camera");
                setPublishBtnTitle('Stop Publish');
                setPublish(true);
                setShouldShow(false);
                setTimeout(() => {
                    setShouldShow(true);
                    vb.current.start();
                }, 1000);
            }
            else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    return (
        <View style={styles.CameraContainer}>
            {shouldShow &&
                <>
                    <NodeCameraView
                        style={styles.CameraView}
                        ref={vb}
                        outputUrl={route.params.rtmpLink} // route.params.rtmpLink
                        camera={{ cameraId: 0, cameraFrontMirror: true }}
                        audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                        video={{ preset: 1, bitrate: 500000, profile: 1, fps: 15, videoFrontMirror: false }}
                        smoothSkinLevel={3}
                        autopreview={true}
                    />

                    <TouchableOpacity activeOpacity={0.5} style={{ ...styles.CameraButton, backgroundColor: '#b20000' }} onPress={async () => {
                        if (isPublish) {
                            setPublishBtnTitle('Start Publish');
                            setPublish(false);
                            vb.current.stop();
                        }
                        else {
                            await requestCameraPermission();
                        }
                    }}>
                        <Text style={styles.ButtonText}>{publishBtnTitle}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={_ => navigation.push('Chat', { rtmpLink: route.params.rtmpLink, streamId: route.params.streamId })} activeOpacity={0.5} style={{ ...styles.CameraButton, backgroundColor: '#b20000' }}>
                        <Text style={styles.ButtonText}>Start Chat</Text>
                    </TouchableOpacity>

                    <View style={styles.chatOverlay}>
                        {!!groupMessages.length && groupMessages.map(messageObj => {
                            return <View style={{ alignItems: messageObj.name === appUser.name ? "flex-end" : "flex-start", padding: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: messageObj.name === appUser.name ? '#F37C76' : '#800080' }}>{messageObj.name}</Text>
                                <Text style={{ color: 'white' }}>{messageObj.message}</Text>
                            </View>
                        })}
                    </View>

                </>}
        </View>
    );
};

export default Stream;