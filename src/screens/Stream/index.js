import React, { useRef, useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, TouchableOpacity, FlatList, Image } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { GiftedChat } from 'react-native-gifted-chat'
import styles from './styles';

const Stream = ({ route }) => {
    let [isPublish, setPublish] = useState(false);
    let [publishBtnTitle, setPublishBtnTitle] = useState('Start Publish');
    let [shouldShow, setShouldShow] = useState(false);
    let [index, setIndex] = useState(0);
    let [routes] = useState([
        { key: 'first', title: 'Group Chat' },
        { key: 'second', title: 'Private Chat' }
    ]);
    let [messages] = useState([
        {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            },
        },
    ]);
    let [data] = useState([
        {
            id: 0,
            title: 'User 1',
        },
        {
            id: 1,
            title: 'User 2',
        },
        {
            id: 2,
            title: 'User 3',
        },
    ])
    let vb = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true);
        }, 1000);
    }, [])

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
            }
            else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const FirstRoute = () => (
        <GiftedChat
            messages={messages}
            // onSend={messages => this.onSend(messages)}
            user={{
                _id: 1,
            }}
        />
    );

    const SecondRoute = () => (
        <FlatList
            data={data}
            renderItem={({ item }) => <Item title={item.title} />}
            keyExtractor={item => item.id}
        />
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    const Item = ({ title }) => {
        return (
            <View style={{ borderWidth: 1, padding: 20, marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 60, height: 60 }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_S9DUg_S9CHf-DxgcNbxYzZmibzud95wxTQslnreREOxA1ch1&usqp=CAU' }} />
                <Text style={{ fontSize: 20, marginLeft: 10 }}>{title}</Text>
            </View>
        );
    }

    return (
        <>
            <View style={styles.CameraContainer}>
                {shouldShow && <NodeCameraView
                    style={styles.CameraView}
                    ref={vb}
                    // outputUrl={"rtmp://rtmp-global.cloud.vimeo.com/live/72d5b45f-15a9-49d4-acb4-a969e33c4e12"}// route.params.rtmpLink
                    camera={{ cameraId: 1, cameraFrontMirror: true }}
                    audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                    video={{ preset: 1, bitrate: 500000, profile: 1, fps: 15, videoFrontMirror: false }}
                    smoothSkinLevel={3}
                    autopreview={true}
                />}
                <View style={styles.ButtonContainer}>
                    <TouchableOpacity activeOpacity={0.5} style={{ ...styles.CameraButton, backgroundColor: '#ff0000' }} onPress={requestCameraPermission}>
                        <Text style={styles.ButtonText}>request permissions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={{ ...styles.CameraButton, backgroundColor: '#b20000' }} onPress={() => {
                        if (isPublish) {
                            setPublishBtnTitle('Start Publish');
                            setPublish(false);
                            vb.current.stop();
                        }
                        else {
                            setPublishBtnTitle('Stop Publish');
                            setPublish(true);
                            vb.current.start();
                        }
                    }}>
                        <Text style={styles.ButtonText}>{publishBtnTitle}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderTabBar={props => <TabBar {...props} indicatorStyle={{ borderColor: 'red', borderWidth: 2 }} activeColor="red" style={{ backgroundColor: '#f37c76' }} />}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={styles.TabViewInitialLayout}
            />

        </>
    );
};

export default Stream;