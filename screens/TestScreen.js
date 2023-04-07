import React, { Component, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default class TestScreen extends Component {
  //const [outputText, setOutputText] = useState('We Love COP 4331');

  constructor(props) {  // useState cannot be used inside components
    super(props);
    this.state = {
      outputText: 'We Love COP 4331'
    };
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.card}>
          <Image style = { {width: 150, height: 150} }
                 source = {require('../assets/logo-border.png')}
          />
          <Text>{this.state.outputText}</Text>
            <Button title="Change Text" onPress={()=>this.setState( {outputText: 'We REALLY Love COP4331' }) } />
          <StatusBar style="auto" />
        </View>
      </View>
    );
  };
}

const styles = {
container: {
  flex: 1,                  // takes up the available width of the container ( relative to other flex values of other objects)
  justifyContent: 'center', // aligns items by Row
  alignItems: 'center',     // aligns items by Column
  backgroundColor: '#fff',
},
body: {
  backgroundColor: '#aa17',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,              // how many pixels around the text that this View will also take up
},
card: {
  borderRadius: 10,
  backgroundColor: '#eee',
  margin: 10,
  padding: 15,
  width: '80%',
  shadowColor: '#000',
  shadowOffset: {
    width: 5,
    height: 5,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  alignItems: 'center',
  justifyContent: 'center',
}
}