//import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './components/auth/register';
import LoginScreen from './components/auth/login';
import MainScreen from './components/main';
import { View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import AddPostScreen from './components/main/add-post'
import SaveScreen from './components/main/save'
import CommentScreen from './components/main/comment'
import LogoTitle from './LogoTitle';
import { REACT_APP_FIREBASE_API_KEY } from "@env";

var firebaseConfig = {
  apiKey: `${REACT_APP_FIREBASE_API_KEY}`,
  authDomain: "uber-cool-photo-sharing-app.firebaseapp.com",
  projectId: "uber-cool-photo-sharing-app",
  storageBucket: "uber-cool-photo-sharing-app.appspot.com",
  messagingSenderId: "663256179889",
  appId: "1:663256179889:web:4f4ed8cf4c8eeb6f34ae90",
  measurementId: "G-05GMQNYNVK"
};

if (firebase.apps.length == 0) firebase.initializeApp(firebaseConfig);

const Stack = createStackNavigator();

const store = createStore(rootReducer, applyMiddleware(thunk));

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }
      else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: "#F2F2F2" }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
    else {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen} options={{
                headerTitle: props => <LogoTitle {...props} />,
                headerStyle: { height: 50, backgroundColor: "#F9F9F9" }
              }} />
              <Stack.Screen name="AddPost" component={AddPostScreen} navigation={this.props.navigation} options={{ headerShown: false }} />
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}
                options={{
                  headerTitle: "Save",
                  headerTitleAlign: "center",
                  headerStyle: { height: 50, backgroundColor: "#F9F9F9" }
                }} />
              <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}
                options={{
                  headerTitle: "Comment",
                  headerTitleAlign: "center",
                  headerStyle: { height: 50, backgroundColor: "#F9F9F9" }
                }} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      )
    }
  }
}

export default App

