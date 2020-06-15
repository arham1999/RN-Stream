import React, { useRef, useState } from 'react';
import { View, Text, PermissionsAndroid, Button } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';

const Stream = ({ route }) => {

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
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } 
            else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    let [isPublish, setPublish] = useState(false);
    let [publishBtnTitle, setPublishBtnTitle] = useState('Start Publish');
    let vb = useRef(null);

    return (
        <>
            <NodeCameraView
                style={{ flex: 1 }}
                ref={vb}
                outputUrl={route.params.rtmpLink}
                camera={{ cameraId: 1, cameraFrontMirror: true }}
                audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                video={{ preset: 1, bitrate: 500000, profile: 1, fps: 15, videoFrontMirror: false }}
                smoothSkinLevel={3}
                autopreview={true}
            />
            <Button title="request permissions" onPress={requestCameraPermission} />
            <Button
                onPress={() => {
                    if (isPublish) {
                        setPublishBtnTitle('Start Publish');
                        setPublish(false);
                        vb.current.stop();
                    } else {
                        setPublishBtnTitle('Stop Publish');
                        setPublish(true);
                        vb.current.start();
                    }
                }}
                title={publishBtnTitle}
                color="#841584"
            />
        </>
    );
};

export default Stream;