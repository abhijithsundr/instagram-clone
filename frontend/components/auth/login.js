import { View, Button, TextInput, Image, StyleSheet, SafeAreaView, Text, TouchableOpacity, Alert } from 'react-native';
import React, { Component } from 'react';
import firebase from 'firebase';

const image = require('../../images/instagram_logo.svg');

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    logInWithFb = () =>
        Alert.alert(
            "Feature currently not implemented",
            "Check back later",
            [
                { text: "OK" }
            ]
        );


    render() {
        return (
            <SafeAreaView style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={styles.container}>
                    <Image
                        style={styles.logo}
                        source={image} />
                    <View style={{ height: 48 }} />
                    <TextInput style={styles.textInput}
                        placeholder="Email"
                        onChangeText={(email) => this.setState({ email })}
                    />
                    <View style={{ height: 4 }} />
                    <TextInput style={styles.textInput}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                    />
                    <View style={{ height: 8 }} />
                    <TouchableOpacity style={styles.loginButton} onPress={() => { this.onSignUp() }}>
                        <View>
                            <Text style={{ color: 'white', fontSize: "1.3 rem", textAlign: "center" }}>Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', marginTop: "20px", marginBottom: "20px" }}>
                    <View
                        style={{
                            borderBottomColor: '#dbdbdb',
                            borderBottomWidth: 2,
                            border: "1px solid transparent",
                            width: 125,
                            marginBottom: 7
                        }}
                    />
                    <Text style={{
                        color: "#8e8e8e",
                        fontWeight: 600,
                        fontSize: "12px",
                        marginLeft: "6px",
                        marginRight: "6px"
                    }}>OR</Text>
                    <View
                        style={{
                            borderBottomColor: '#dbdbdb',
                            borderBottomWidth: 2,
                            border: "1px solid transparent",
                            width: 125,
                            marginBottom: 7
                        }}
                    />
                </View>

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text
                        style={{ color: '#385185', fontSize: "16px", textAlign: "center", fontWeight: "600", marginBottom: "24px" }}
                        onPress={() => this.logInWithFb()}>Log in with Facebook</Text>

                    <Text style={{ color: "#00376b", fontSize: "12px" }} onPress={() => this.logInWithFb()}>Forgot Password?</Text>
                </View>

                <View style={styles.registerContainer}>
                    <Text>Don't have an account? </Text>
                    <Text
                        style={styles.signUpText}
                        onPress={() => this.props.navigation.navigate('Register')}>Sign Up</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        height: "100%",
        width: "100%",
        paddingTop: "48px"
    },
    logo: {
        height: 83,
        width: 280,
    },
    textInput: {
        flex: "1 0 auto",
        padding: "14px 2px 2px 8px",
        borderStyle: "solid",
        borderWidth: "0.2px",
        borderColor: "#BFD5F6",
        width: 280,
        height: 30,
        paddingLeft: "6px",
        fontSize: "1.3 rem"
    },
    loginButton: {
        backgroundColor: '#0095f6',
        width: 280,
        height: 30,
        borderRadius: "2px",
        alignItems: "center",
        justifyContent: "center"
    },
    registerContainer: {
        flexDirection: "row",
        paddingBottom: 48,
        paddingTop: 48
    },
    signUpText: {
        fontWeight: "700",
        color: "#0095f6",
    },
    signUpFbBtn: {
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: "#F2F2F2",
        width: "280px",
        height: "30px",
        marginBottom: "20px"
    },
})

export default Login;


