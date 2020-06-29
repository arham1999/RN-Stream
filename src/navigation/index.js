import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from "../screens";

const Navigation = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Pin">
            <Stack.Screen name="Login" component={Screens.Login} options={{
                title: 'Login',
                headerStyle: {
                    backgroundColor: '#f37c76',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 21
                },
                headerTitleAlign: 'center'
            }} />
            <Stack.Screen name="Pin" component={Screens.Pin} options={{
                title: 'Access Pin',
                headerStyle: {
                    backgroundColor: '#f37c76',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 21
                },
                headerTitleAlign: 'center'
            }} />
            <Stack.Screen name="Stream" component={Screens.Stream} options={{
                title: 'Stream',
                headerStyle: {
                    backgroundColor: '#f37c76',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 21
                },
                headerTitleAlign: 'center'
            }} />
            <Stack.Screen name="Chat" component={Screens.Chat} options={{
                title: 'Chat',
                headerStyle: {
                    backgroundColor: '#f37c76',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 21
                },
                headerTitleAlign: 'center'
            }} />
        </Stack.Navigator>
    );

}

export default Navigation;