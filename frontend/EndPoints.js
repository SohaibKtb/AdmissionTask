import React from 'react';
import * as c from "./constants";

//API URL
export const API_URL = 'http://192.168.0.101:80/api';

//AUTH API End Points
export const REGISTER = `${API_URL}/auth/register`;
export const LOGIN = `${API_URL}/auth/login`;
export const AUTH_USER = `${API_URL}/auth/user`;

//Users
export const USERS = `${API_URL}/users`;


export const HeadersWithToken = async () => {
    let token = await c.getToken();
    return {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(token),
        'Content-Type': 'application/json'
    };
}

export const HeadersWithoutToken = () => {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}