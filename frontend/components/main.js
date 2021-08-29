import React, { Component } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from "../redux/actions"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import FeedScreen from './main/feed'
import ProfileScreen from './main/profile'
import SearchScreen from './main/search'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import firebase from 'firebase'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
        this.setState({ loaded: true });
    }

    render() {
        const { loaded } = this.state;
        if (!loaded) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: "#F2F2F2" }}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }
        else {
            return (
                <Tab.Navigator initialRouteName="Feed" labeled={false} inactiveColor="#9b9b9b" barStyle={{ backgroundColor: "#F9F9F9" }}>
                    <Tab.Screen name="Feed" component={FeedScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={26} />
                            ),
                        }} />
                    <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="magnify" color={color} size={26} />
                            ),
                        }} />
                    <Tab.Screen name="PostContainer" component={EmptyScreen}
                        listeners={({ navigation }) => ({
                            tabPress: event => {
                                event.preventDefault()
                                navigation.navigate("AddPost")
                            }
                        })}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                            ),
                        }} />
                    <Tab.Screen name="Profile" component={ProfileScreen}
                        listeners={({ navigation }) => ({
                            tabPress: event => {
                                event.preventDefault()
                                navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                            }
                        })}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                            ),
                        }} />
                </Tab.Navigator>
            )
        }
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main);
