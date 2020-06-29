import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useSelector } from "react-redux";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { GiftedChat } from 'react-native-gifted-chat'
import { initializeTwilioForGroup, initializeTwilioForPM } from '../../config/twilio';
import styles from './styles';

const Chat = ({ route }) => {
    const appUser = useSelector(state => state.login.user);
    let [index, setIndex] = useState(0);
    const [groupMessages, setGroupMessages] = useState([]);
    const [channel, setChannel] = useState(false);
    const [client, setClient] = useState(false);
    const [activePMScreen, setActivePMScreen] = useState(false);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [privateChannel, setPrivateChannel] = useState(false);
    const [loader, setLoader] = useState(false);

    let [routes] = useState([
        { key: 'first', title: 'Chat' },
        { key: 'second', title: 'Q&A' }
    ]);

    let [users, setUsers] = useState([])

    useEffect(() => {
        (async _ => {
            setLoader(true);
            let response = await initializeTwilioForGroup(appUser.name, route.params.streamId);// route.params.streamId
            setClient(response.client);
            let channelExist = await response.channel;
            if (channelExist) {
                setChannel(channelExist);
                try {
                    let messages = await channelExist.getMessages();
                    setGroupMessages(messages.items.map(e => ({
                        _id: route.params.streamId, // route.params.streamId
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
                } catch (err) {
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
                    _id: route.params.streamId,// route.params.streamId
                    text: e.body,
                    user: {
                        _id: e.sid,
                        name: e.author
                    },
                })))
            });
        }
    }, [groupMessages, channel])

    const FirstRoute = () => (
        <GiftedChat
            messages={groupMessages}
            renderMessage={({ currentMessage }) => {
                return <View style={{ alignItems: currentMessage.user.name === appUser.name ? 'flex-end' : 'flex-start', padding: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: currentMessage.user.name === appUser.name ? '#F37C76' : '#800080' }}>{currentMessage.user.name}</Text>
                    <Text>{currentMessage.text}</Text>
                </View>
            }}
            renderLoading={_ => <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#0000ff" />}
            inverted={false}
            onSend={message => channel.sendMessage(message[0].text, { id: route.params.streamId })}// route.params.streamId
            user={{
                _id: route.params.streamId// route.params.streamId
            }}
        />
    );

    const SecondRoute = () => (
        !loader ? (!activePMScreen ? <FlatList
            data={users}
            renderItem={({ item }) => <Item title={item.title} sid={item.sid} />}
            keyExtractor={item => item.id}
        /> : <React.Fragment>
                <TouchableOpacity onPress={_ => { setActivePMScreen(false); privateChannel.removeAllListeners() }} style={styles.pmChatBackBtn}>
                    <Text style={styles.pmChatBackBtnText}> {"<"} </Text>
                </TouchableOpacity>
                <GiftedChat
                    messages={privateMessages}
                    renderAvatar={null}
                    renderUsernameOnMessage={true}
                    renderLoading={_ => <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#0000ff" />}
                    inverted={false}
                    renderMessage={({ currentMessage }) => {
                        return <View style={{ alignItems: currentMessage.user.name === appUser.name ? 'flex-end' : 'flex-start', padding: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: currentMessage.user.name === appUser.name ? '#F37C76' : '#800080' }}>{currentMessage.user.name}</Text>
                            <Text>{currentMessage.text}</Text>
                        </View>
                    }}
                    onSend={message => privateChannel.sendMessage(message[0].text, { id: route.params.streamId })}// route.params.streamId
                    user={{
                        _id: route.params.streamId// route.params.streamId
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
                    _id: route.params.streamId,// route.params.streamId
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
                _id: route.params.streamId,// route.params.streamId
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
            <TouchableOpacity onPress={_ => initializePM(sid)} style={styles.userListContainer}>
                <Image style={styles.userListImage} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_S9DUg_S9CHf-DxgcNbxYzZmibzud95wxTQslnreREOxA1ch1&usqp=CAU' }} />
                <Text style={styles.userListText}>{title}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TabView
            navigationState={{ index, routes }}
            renderTabBar={props => <TabBar {...props} indicatorStyle={styles.tabIndicator} activeColor="red" style={styles.tabColor} />}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={styles.TabViewInitialLayout}
        />
    );
};

export default Chat;