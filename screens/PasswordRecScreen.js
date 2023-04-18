import React, { Component, useState } from 'react';
import { ImageBackground, Button, View, Text, TextInput } from 'react-native';


export default class PasswordScreen extends Component {
    //const [outputText, setOutputText] = useState('We Love COP 4331');
  
    constructor(props) {  // useState cannot be used inside components
      super(props);
      this.state = {
        outputText: 'password screen'
      };
    }

    render(){
        return(
            <View>
                <Text> hello from {this.state.outputText} </Text>
            </View>
    )}

}