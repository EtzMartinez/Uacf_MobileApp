// Landingscreen.js

import React, { Component, useState } from 'react';
import { ActivityIndicator, Button, View, Text, TextInput, Image, ImageBackground } from 'react-native';




export default class LandingScreen extends Component {

    constructor() 
    {
      super()
      this.state = 
      {
         message: ' '
      }
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text>Welcome to the Landing Screen check</Text>
            </View>
        );
    };
}



const styles = {
container:{
    flex: 1,
    justifyContent: 'center', // aligns items by Row
    alignItems: 'center',     // aligns items by Column
    backgroundColor: '#fff',
}

}