import { View, Button, TextInput, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import React, { Component } from 'react';
import firebase from 'firebase';

const image = require('../../images/instagram_logo.svg');

export class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email
                    })
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <View style={styles.registerContainer}>
                <Image
                    style={styles.instagramLogo}
                    source={image} />

                <h2 style={{
                    color: "#8e8e8e",
                    fontSize: "17px",
                    fontWeight: 600,
                    textAlign: "center",
                    margin: "0 40px 10px",
                    lineHeight: "20px",
                    marginBottom: "24px"
                }}>Sign up to see photos and videos from your friends.</h2>

                <TouchableOpacity style={styles.signUpFbBtn}>
                    <View>
                        <Text style={{ color: 'white', fontSize: "1.3 rem", textAlign: "center" }}>Login with Facebook</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', marginBottom: "20px" }}>
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

                <TextInput
                    style={styles.registerTxtInput}
                    placeholder="Username"
                    onChangeText={(name) => this.setState({ name })}
                />
                <TextInput
                    style={styles.registerTxtInput}
                    placeholder="Email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    style={styles.registerTxtInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <TouchableOpacity style={styles.signUpBtn} onPress={() => this.onSignUp()}>
                    <View>
                        <Text style={{ color: 'white', fontSize: "1.3 rem", textAlign: "center" }}>Sign Up</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.tncText}>
                    By signing up, you agree to our Terms , Data Policy and Cookies Policy .
                </Text>
                <View style={{ alignItems: "center", justifyContent: "conter", flexDirection: "row" }}>
                    <Text>Have an account? </Text>
                    <Text
                        style={{ fontWeight: "700", color: "#0095f6" }}
                        onPress={() => this.props.navigation.navigate('Login')}>Log In
                    </Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    registerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#F2F2F2',
    },
    instagramLogo: {
        backgroundPosition: "0 -130px",
        height: "51px",
        width: "175px",
        marginBottom: "24px"
    },
    signUpLabel: {
        color: "#8e8e8e",
        fontSize: "17px",
        fontWeight: 600,
        textAlign: "center",
        maxWidth: "280px"
    },
    signUpFbBtn: {
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: "#0095f6",
        width: "280px",
        height: "30px",
        marginBottom: "20px"
    },
    registerTxtInput: {
        width: "280px",
        height: "30px",
        borderWidth: "0.2px",
        borderColor: "#dbdbdb",
        marginTop: "3px",
        marginBottom: "3px",
        padding: "14px 2px 2px 8px",
        paddingLeft: "6px"
    },
    signUpBtn: {
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: "#0095f6",
        width: "280px",
        height: "30px",
        marginTop: "12px",
        marginBottom: "12px"
    },
    tncText: {
        color: "#8e8e8e",
        fontSize: "12px",
        textAlign: "center",
        margin: "0 40px 10px",
        lineHeight: "20px",
        marginBottom: "24px",
        width: "280px "
    }
})

export default Register;

