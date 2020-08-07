import React from 'react';
import * as SecureStore from 'expo-secure-store';

//Auth Token Store
export const getToken = async () => {
    return await SecureStore.getItemAsync('secure_token');
};

export const setToken = async (token) => {
    await SecureStore.setItemAsync('secure_token', JSON.stringify(token));
};

export const deleteToken = async () => {
    await SecureStore.deleteItemAsync('secure_token');
};