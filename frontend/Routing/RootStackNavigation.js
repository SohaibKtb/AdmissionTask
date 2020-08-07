import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/Auth/Login/LoginScreen';
import RegisterScreen from '../screens/Auth/Register/RegisterScreen';

const RootStack = createStackNavigator();

const RootStackNavigation = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="LoginScreen" component={LoginScreen}/>
        <RootStack.Screen name="RegisterScreen" component={RegisterScreen}/>
    </RootStack.Navigator>
);

export default RootStackNavigation;