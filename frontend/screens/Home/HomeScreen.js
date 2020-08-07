import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  CardItem,
  Text as NativeText,
  Icon
} from 'native-base';

import * as UsersApi from '../../APIs/UsersApi';

const HomeScreen = (props) => {


  const initialState = {
    users: [],
    isLoading: false,
  }

  const mounted = useRef(true);

  const [state, setState] = useState(initialState);

  const getAllUsers = async () => {
    await UsersApi.RegisteredUsers()
      .then(data => {
        if (mounted.current) {
          setState({
            ...state,
            users: data.users
          })
        }
      })
  }

  useEffect(() => {
    mounted.current = true;
    getAllUsers();
    return () => {
      mounted.current = false;
    }
  }, []);

  const renderUsers = ({ item }) => {
    return (
      <Card>
        <CardItem>
          <Icon active name="person" />
          <NativeText>UserName: {item.first_name + " " + item.last_name}</NativeText>
        </CardItem>
      </Card>
    )
  };

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={state.users}
        renderItem={renderUsers}
        keyExtractor={item => `${item.id}`}
        vertical
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;