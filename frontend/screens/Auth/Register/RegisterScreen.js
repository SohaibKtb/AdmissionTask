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

import * as AuthApi from '../../../APIs/AuthApi';
import * as c from '../../../constants';

import { AuthContext } from '../../../components/context';

const RegisterScreen = ({ navigation }) => {

    const { signUp, signIn } = React.useContext(AuthContext);

    //isValid.... etc, is used for text style to show red when isValid.. is false, but I didn't used it now
    const [data, setData] = React.useState({
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        check_firstNameInputChange: false,
        check_lastNameInputChange: false,
        secureTextEntry: true,
        isValidFirstName: true,
        isValidLastName: true,
        isValidEmail: true,
        confirm_secureTextEntry: true,
    });

    const mounted = useRef(true);

    const [register, setRegister] = React.useState({
        isRegistered: false
    });

    const firstNameInputChange = (val) => {
        if (val.length >= 4) {
            if (mounted.current) {
                setData({
                    ...data,
                    first_name: val,
                    check_firstNameInputChange: true,
                    isValidFirstName: true,
                });
            }
        } else {
            if (mounted.current) {
                setData({
                    ...data,
                    first_name: val,
                    check_firstNameInputChange: false,
                    isValidFirstName: false,
                });
            }
        }
    }

    const lastNameInputChange = (val) => {
        if (val.length >= 4) {
            if (mounted.current) {
                setData({
                    ...data,
                    last_name: val,
                    check_lastNameInputChange: true,
                    isValidLastName: true,
                });
            }
        } else {
            if (mounted.current) {
                setData({
                    ...data,
                    last_name: val,
                    check_lastNameInputChange: false,
                    isValidLastName: false,
                });
            }
        }
    }

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
        if (mounted.current) {
            setData({
                ...data,
                password: val
            });
        }
    }

    const handleOnConfirmPasswordChange = (val) => {
        if (mounted.current) {
            setData({
                ...data,
                confirm_password: val
            });
        }
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
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

    const registerHandle = async (data) => {

        if (data.first_name < 5) {
            alert("First name is not valid");
            return false;
        }

        if (data.last_name < 5) {
            alert("Last name is not valid");
            return false;
        }

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(data.email) === false) {
            alert("Email is Not Correct");
            return false;
        }

        if (data.isValidPassword === false) {
            alert('Password must be more than 3 characters');
            return false;
        }

        if (data.password !== data.confirm_password) {
            alert('Password is not like Confirm Password');
            return false;
        }

        let registerData = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password
        };

        return AuthApi.register(registerData)
            .then(data => {
                if (data.success) {
                    signUp("success");
                    if (mounted.current) {
                        setRegister({
                            isRegistered: true
                        });
                    }
                    c.setToken(data.access_token);
                    return true;
                } else if (data.errors?.email) {
                    if (mounted.current) {
                        setRegister({
                            isRegistered: false
                        });
                    }
                    alert(data.errors.email[0]);
                    navigation.navigate('LoginScreen');
                } else if (data.errors) {
                    if (mounted.current) {
                        setRegister({
                            isRegistered: false
                        });
                    }
                    throw Error("The given data was invalid");
                }else{
                    throw Error("Some Error Occurred");
                }
            }).then(async () => {
                return AuthApi.AuthUser().then(async (data) => {
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
                    if (data.message === 'Unauthenticated.') {
                        return;
                    } else {
                        signIn(foundUser);
                    }
                });
            }).catch((e) => alert(e));

    }

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, []);

    return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                        <Text style={styles.logoText}>Register</Text>
                        <TextInput
                            placeholder="first name"
                            placeholderColor="#c4c3cb"
                            style={styles.loginFormTextInput}
                            onChangeText={(text) => firstNameInputChange(text)}
                            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                            textContentType="emailAddress"
                        />
                        <TextInput
                            placeholder="last name"
                            placeholderColor="#c4c3cb"
                            style={styles.loginFormTextInput}
                            onChangeText={(text) => lastNameInputChange(text)}
                            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                            textContentType="emailAddress"
                        />
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
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderColor="#c4c3cb"
                            style={styles.loginFormTextInput}
                            onChangeText={(text) => handleOnConfirmPasswordChange(text)}
                            secureTextEntry={true}
                        />
                        <Button
                            buttonStyle={styles.loginButton}
                            onPress={async () => {
                                let bool = await registerHandle({ ...data });
                                if (bool === true) {
                                    navigation.navigate('LoginScreen');
                                }
                            }}
                            title="Register"
                        />
                        <Button
                            buttonStyle={styles.loginButton}
                            onPress={() => navigation.navigate('LoginScreen')}
                            title="Back To Login"
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default RegisterScreen;