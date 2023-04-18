// App.js

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

//for landing page navigation
// import 'react-native-gesture-handler';  // finalizes the import for the hamburger menu
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
// } from '@react-navigation/drawer';
// import { Feather } from "@expo/vector-icons";

import LoginScreen from './screens/LoginScreen';
import CardScreen from './screens/CardScreen';
import RegisterScreen from './screens/RegScreen';
import TestScreen from './screens/TestScreen';
import LandingScreen from './screens/LandingScreen';
import ClassScreen from './screens/ClassesScreen';
import PasswordScreen from './screens/PasswordRecScreen';

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,  // dictates the screen we are in 
    navigationOptions: {
      header: null // Will hide header for HomePage
    }
  },
  Card: {
    screen: CardScreen,
    navigationOptions: {
      header: null 
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions:{
      title: null,
      headerStyle: { backgroundColor: "#F8CD46" },
      headerBackTitle: "Login Screen",
      headerTintColor: 'black',
    }
  },
  Test: {
    screen: TestScreen,
    navigationOptions: {
      header: null
    }
  },
  Landing: {
    screen: LandingScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Events",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold'
      },
      headerStyle: { 
        backgroundColor: "#F8CD46",
        borderBottomWidth: 2,
        borderBottomColor: 'black',
      },
      headerBackTitleStyle: { fontSize: 17 },
      headerBackTitle: "Sign out",
      headerTintColor: 'black',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Classes')}>
          <Text style={{ marginRight: 10, fontSize: 17 }}>View Classes</Text>
        </TouchableOpacity>
      ),
    }),
  },
  Classes:{
    screen: ClassScreen,
    navigationOptions:{
      title: "Classes",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold'
      },
      headerStyle: { 
        backgroundColor: "#F8CD46",
        borderBottomWidth: 2,
        borderBottomColor: 'black',
      },
      headerBackTitleStyle: { fontSize: 17 },
      headerBackTitle: "Events",
      headerTintColor: 'black',
    }
  },
  Password:{
    screen: PasswordScreen,
    navigationOptions: {
      title: "Password Recovery",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold'
      },
      headerStyle: { 
        backgroundColor: "#F8CD46",
        borderBottomWidth: 2,
        borderBottomColor: 'black',
      },
      headerTintColor: 'black'
    }
  }
},{
  initialRouteName: "Login" // sets the first screen shown to the user as the
});

const AppContainer = createAppContainer(AppNavigator); //AppNavigator handles user navigation actions, AppContainer Holds the results

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
