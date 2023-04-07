// import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';

// export default function App() {
//   // useState: returns the value of the state variable and a function that can be used to update it
//   const [outputText, setOutputText] = useState('We Love COP 4331'); 
//   return (
//     <View style={styles.container}>
//       <Text>{outputText}</Text>
//       <Button title="Change Text" onPress={()=>setOutputText('We REALLY Love COP 4331')}/>
//       <StatusBar style="auto" />
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// App.js

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import LoginScreen from './screens/LoginScreen';
import CardScreen from './screens/CardScreen';
import RegisterScreen from './screens/RegScreen';
import TestScreen from './screens/TestScreen';
import LandingScreen from './screens/LandingScreen';

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
      header: null // Will hide header for HomePage
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null
    }
  },
  Test: {
    screen: TestScreen,
    navigationOptions: {
      header: null
    }
  },
  Landing:{
    screen: LandingScreen,
    navigationOptions:{
      header: null
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
