import React, { useRef, useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useSelector } from "react-redux";
import { NodeCameraView } from 'react-native-nodemediaclient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { GiftedChat } from 'react-native-gifted-chat'
import { initializeTwilioForGroup, initializeTwilioForPM } from '../../config/twilio';
import styles from './styles';

const Stream = ({ route }) => {
    let [isPublish, setPublish] = useState(false);
    let [publishBtnTitle, setPublishBtnTitle] = useState('Start Publish');
    const appUser = useSelector(state => state.login.user);
    let [shouldShow, setShouldShow] = useState(false);
    let [index, setIndex] = useState(0);
    const [groupMessages, setGroupMessages] = useState([]);
    const [channel, setChannel] = useState(false);
    const [client, setClient] = useState(false);
    const [activePMScreen, setActivePMScreen] = useState(false);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [privateChannel, setPrivateChannel] = useState(false);
    const [loader, setLoader] = useState(false);

    let [routes] = useState([
        { key: 'first', title: 'Group Chat' },
        { key: 'second', title: 'Private Chat' }
    ]);

    let [users, setUsers] = useState([])
    let vb = useRef(null);


    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true);
        }, 1000);
        (async _ => {
            setLoader(true);
            let response = await initializeTwilioForGroup(appUser.name, 'streamId');// route.params.            
            setClient(response.client);
            let channelExist = await response.channel;
            if (channelExist) {
                setChannel(channelExist);
                try {
                    let messages = await channelExist.getMessages();
                    setGroupMessages(messages.items.map(e => ({
                        _id: 'streamId',// route.params.streamId
                        text: e.body,
                        user: {
                            _id: e.sid,
                            name: e.author
                        },
                    })));
                    let members = await channelExist.getMembers();
                    let me = await channelExist.getMemberByIdentity(appUser.name);
                    setUsers(members.filter(e => e.sid !== me.sid).map(e => ({ title: e.identity, sid: e.sid })));
                    setLoader(false);
                } catch(err) {
                    console.log('this is the error:', err);
                    setLoader(false);
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
                    _id: 'streamId',// route.params.streamId
                    text: e.body,
                    user: {
                        _id: e.sid,
                        name: e.author
                    },
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
            messages={groupMessages}
            renderAvatar={null}
            renderUsernameOnMessage={true}
            renderLoading={_ => <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#0000ff" />}
            inverted={false}
            onSend={message => channel.sendMessage(message[0].text, { id: 'streamId' })}// route.params.streamId
            user={{
                _id: 'streamId'// route.params.streamId
            }}
        />
    );

    const SecondRoute = () => (
        !loader ? (!activePMScreen ? <FlatList
            data={users}
            renderItem={({ item }) => <Item title={item.title} sid={item.sid} />}
            keyExtractor={item => item.id}
        /> : <React.Fragment>
            <TouchableOpacity onPress={_ => {setActivePMScreen(false);privateChannel.removeAllListeners()}} style={{ padding: 5, backgroundColor: 'purple', width: 40 }}>
                <Text style={{ textAlign: 'center', fontSize: 20, color: 'white', fontWeight: 'bold' }}> {"<"} </Text>
            </TouchableOpacity>
            <GiftedChat
                messages={privateMessages}
                renderAvatar={null}
                renderUsernameOnMessage={true}
                renderLoading={_ => <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#0000ff" />}
                inverted={false}
                onSend={message => privateChannel.sendMessage(message[0].text, { id: 'streamId' })}// route.params.streamId
                user={{
                    _id: 'streamId'// route.params.streamId
                }}
            />
            </React.Fragment>) : <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#0000ff" />
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    useEffect(() => {
        if (privateChannel && privateChannel.listenerCount('messageAdded') <= 1) {
            privateChannel.on('messageAdded', async function (message) {
                // console.log('new message', message, privateMessages);
                let messages = await privateChannel.getMessages();
                setPrivateMessages(messages.items.map(e => ({
                    _id: 'streamId',// route.params.streamId
                    text: e.body,
                    user: {
                        _id: e.sid,
                        name: e.author
                    },
                })))
            });

        }
    }, [privateMessages, privateChannel])

    const initializePM = async (sid) => {
        setLoader(true);
        let channelExist = await initializeTwilioForPM(client, sid);
        if (channelExist) {
            setPrivateChannel(channelExist);
            let messages = await channelExist.getMessages();
            setPrivateMessages(messages.items.map(e => ({
                _id: 'streamId',// route.params.streamId
                text: e.body,
                user: {
                    _id: e.sid,
                    name: e.author
                },
            })));
        }
        setLoader(false);
        setActivePMScreen(true);
    }

    const Item = ({ title, sid }) => {
        return (
            <TouchableOpacity onPress={_ => initializePM(sid)} style={{ borderBottomWidth: 1, borderBottomColor: 'grey', padding: 15, marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 50, height: 50 }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_S9DUg_S9CHf-DxgcNbxYzZmibzud95wxTQslnreREOxA1ch1&usqp=CAU' }} />
                <Text style={{ fontSize: 16, marginLeft: 10, color: 'purple' }}>{title}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <View style={styles.CameraContainer}>
                {shouldShow && <NodeCameraView
                    style={styles.CameraView}
                    ref={vb}
                    // outputUrl={"rtmp://rtmp-global.cloud.vimeo.com/live/72d5b45f-15a9-49d4-acb4-a969e33c4e12"}// route.params.rtmpLink
                    camera={{ cameraId: 0, cameraFrontMirror: true }}
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