import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import { View, ActivityIndicator, YellowBox } from 'react-native';

import _ from 'lodash';
import {
  NavigationContainer
} from '@react-navigation/native';

import {
  Provider as PaperProvider
} from 'react-native-paper';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './screens/Drawer/DrawerContent';

import AppContainer from './Routing/AppNavigation';
import RootStackNavigation from './Routing/RootStackNavigation';

import { AuthContext } from './components/context';
import { CheckAuthContext } from './components/checkAuthContext';
import loginReducer from "./reducers/LoginReducer";
import * as c from './constants';

const App = () => {

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const initialAuthState = {
    isLoggedIn: false,
    userName: ''
  }

  const [authState, setAuthState] = useState(initialAuthState);

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      const userToken = String(foundUser.userToken);

      const userName = foundUser.username;
      setAuthState({
        userName: userName,
        isLoggedIn: true 
      })
      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async () => {
      try {
        await c.deleteToken();
        setAuthState({
          userName: '',
          isLoggedIn: false 
        })
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: async (foundUser) => {

      const userToken = String(foundUser.userToken);

      const userName = foundUser.username;
      dispatch({ type: 'REGISTER', id: userName, token: userToken });
    },
  }), []);

  const font = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  useEffect(() => {
    font();

    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await c.getToken();
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const Drawer = createDrawerNavigator();

  return (
    <PaperProvider>
      <AuthContext.Provider value={authContext}>
        <CheckAuthContext.Provider value={authState}>
          <NavigationContainer>
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="AuthDrawer" component={loginState.userToken !== null ? AppContainer : RootStackNavigation} />
            </Drawer.Navigator>
          </NavigationContainer>
        </CheckAuthContext.Provider>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};