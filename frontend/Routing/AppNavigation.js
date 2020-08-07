import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/Home/HomeScreen';

const HomeStack = createStackNavigator();

function HomeStackNavigator({ navigation }) {
    return (
        <HomeStack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#1f65ff'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }}>
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{
                title: "Home",
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
                ),
            }}
            />
        </HomeStack.Navigator>
    )
}


const Tab = createMaterialBottomTabNavigator();


const MainTabScreen = () => {

    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#fff"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#1f65ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
                options={{
                    tabBarLabel: 'Home',
                    tabBarColor: '#009387',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-home" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppContainer({ navigation }) {
    return (
        <MainTabScreen />
    )
}

console.disableYellowBox = true;