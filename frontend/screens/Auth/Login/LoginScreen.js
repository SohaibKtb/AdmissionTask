import React, { useEffect, useRef } from "react";

import styles from './style';
import {
    Keyboard,
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView
} from 'react-native';
import { Button } from 'react-native-elements';

import { AuthContext } from '../../../components/context';

import * as AuthApi from '../../../APIs/AuthApi';
import * as c from '../../../constants';

const LoginScreen = (props) => {

    const [data, setData] = React.useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidEmail: true,
        isValidPassword: true,
        isLoading: false
    });

    const mounted = useRef(true);

    const { signIn } = React.useContext(AuthContext);

    const handleOnEmailChange = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            if (mounted.current) {
                setData({
                    ...data,
                    email: text,
                    check_textInputChange: false,
                    isValidEmail: false
                });
            }
        } else {
            if (mounted.current) {
                setData({
                    ...data,
                    email: text,
                    check_textInputChange: true,
                    isValidEmail: true
                });
            }
        }
    }

    const handleOnPasswordChange = (val) => {
        if (val.trim().length >= 8) {
            if (mounted.current) {
                setData({
                    ...data,
                    password: val,
                    isValidPassword: true
                });
            }
        } else {
            if (mounted.current) {
                setData({
                    ...data,
                    isValidPassword: false
                });
            }
        }
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 10) {
            if (mounted.current) {
                setData({
                    ...data,
                    isValidEmail: true
                });
            }
        } else {
            if (mounted.current) {
                setData({
                    ...data,
                    isValidEmail: false
                });
            }
        }
    }

    const loginHandle = async (email, password) => {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            alert("Email is Not Correct");
            if (mounted.current) {
                setData({
                    ...data,
                    isLoading: false,
                    isValidEmail: false
                });
            }
            return false;
        }
        if (mounted.current) {
            setData({
                ...data,
                isLoading: true,
                isValidEmail: true,
                isValidPassword: true
            });
        }

        let user = {
            email: email,
            password: password
        };

        AuthApi.login(user)
            .then(data => {
                if (data.access_token) {
                    c.setToken(data.access_token);
                } else if (data.error === "Unauthorized") {
                        if (mounted.current) {
                            setData({
                                ...data,
                                isLoading: false,
                                isValidEmail: false,
                                isValidPassword: false
                            });
                        }
                        throw Error("Your Email or Password is wrong");
                    }else if(data.error === 'Email Does Not Exists'){
                        props.navigation.navigate('RegisterScreen');
                        throw Error("Email Does Not Exists");
                    } else {
                        throw Error("Error Occured");
                    }
            }).then(async () => {
                return await AuthApi.AuthUser().then(async (data) => {
                    const token = await c.getToken();
                    const foundUser = {
                        userToken: token,
                        username: data.first_name + " " + data.last_name
                    }

                    if (foundUser.length == 0) {
                        Alert.alert('Invalid User!', 'Email or password is incorrect.', [
                            { text: 'Okay' }
                        ]);
                        if (mounted.current) {
                            setData({
                                ...data,
                                isLoading: false,
                                isValidEmail: false,
                                isValidPassword: false
                            });
                        }
                        return;
                    }
                    if (mounted.current) {
                        setData({
                            ...data,
                            isLoading: false,
                            isValidEmail: true,
                            isValidPassword: true
                        });
                    }
                    signIn(foundUser);
                });
            }).catch((e) => alert(e));
    }

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                        <Text style={styles.logoText}>Login</Text>
                        <TextInput
                            placeholder="Email"
                            placeholderColor="#c4c3cb"
                            style={styles.loginFormTextInput}
                            onChangeText={(text) => handleOnEmailChange(text)}
                            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                            textContentType="emailAddress"
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderColor="#c4c3cb"
                            style={styles.loginFormTextInput}
                            onChangeText={(text) => handleOnPasswordChange(text)}
                            secureTextEntry={true}
                        />
                        <Button
                            buttonStyle={styles.loginButton}
                            onPress={() => loginHandle(data.email, data.password)}
                            title="Login"
                        />
                        <Button
                            buttonStyle={styles.loginButton}
                            onPress={() => props.navigation.navigate('RegisterScreen')}
                            title="Register"
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen
