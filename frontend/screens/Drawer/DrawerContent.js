import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Drawer,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../../components/context';
import { CheckAuthContext } from '../../components/checkAuthContext';

import * as AuthApi from '../../APIs/AuthApi';

export function DrawerContent(props) {

    const initialState = {
        userName: null
    };

    const [state, setState] = useState(initialState);

    const { signOut } = React.useContext(AuthContext);

    const getAuthUser = () => {
        AuthApi.AuthUser().then(data => {
            if (!data.error) {
                setState({
                    ...state,
                    userName: data.first_name + " " + data.last_name
                })
            }
        })
    }

    useEffect(() => {
        getAuthUser();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CheckAuthContext.Consumer>
                {context => (
                    <>
                        <DrawerContentScrollView {...props}>
                            <View style={styles.drawerContent}>
                                <View style={styles.userInfoSection}>
                                    <View>
                                        {context.isLoggedIn && (
                                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                                <Avatar.Image
                                                    source={require("../../assets/profile-icon.png")}
                                                    size={50}
                                                />
                                                <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                                    <Title style={styles.title}>{context.userName}</Title>
                                                    <Caption style={styles.caption}></Caption>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <Drawer.Section style={styles.drawerSection}>
                                    {context.isLoggedIn === false ? (
                                        <View>
                                            <DrawerItem
                                                icon={({ color, size }) => (
                                                    <Icon
                                                        name="login"
                                                        color={color}
                                                        size={size}
                                                    />
                                                )}
                                                label="Login"
                                                onPress={() => { props.navigation.navigate('LoginScreen') }}
                                            />
                                            <DrawerItem
                                                icon={({ color, size }) => (
                                                    <Icon
                                                        name="registered-trademark"
                                                        color={color}
                                                        size={size}
                                                    />
                                                )}
                                                label="Register"
                                                onPress={() => { props.navigation.navigate('RegisterScreen') }}
                                            />
                                        </View>
                                    ) :
                                        <DrawerItem
                                            icon={({ color, size }) => (
                                                <Icon
                                                    name="home-outline"
                                                    color={color}
                                                    size={size}
                                                />
                                            )}
                                            label="Users Retrieval"
                                            onPress={() => { props.navigation.navigate('HomeScreen') }}
                                        />
                                    }
                                </Drawer.Section>
                            </View>
                        </DrawerContentScrollView>
                        <Drawer.Section style={styles.bottomDrawerSection}>
                            {context.isLoggedIn &&
                                <DrawerItem
                                    icon={({ color, size }) => (
                                        <Icon
                                            name="logout"
                                            color={color}
                                            size={size}
                                        />
                                    )}
                                    label="Log Out"
                                    onPress={() => {
                                        signOut();
                                    }}
                                />}
                        </Drawer.Section>
                    </>
                )}
            </CheckAuthContext.Consumer>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});