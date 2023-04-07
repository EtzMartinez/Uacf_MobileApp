// Loginscreen.js

import React, { Component, useState } from 'react';
import { ActivityIndicator, Button, View, Text, TextInput, Image, ImageBackground } from 'react-native';

global.localName = '';
global.password = '';
global.userId = -1;
global.firstName = '';
global.lastName = '';
global.search = '';
global.card = '';

export default class Homescreen extends Component {

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
      <View style={styles.container}>
      {/* <Image
            style = {styles.back}
            source = {require('../assets/unsplash-BG.jpg')}
      /> */}
      
      <View style={styles.body}>
        <Image 
            style = {styles.logo}
            source = {require('../assets/logo-border.png')}
        />
        <Text style={{fontSize:10}}> </Text>
        <View style={{alignItems: 'flex-end'}}>
          
        <View style={{ flexDirection:'row' }}>
          <Text style={{fontSize:20}}>Username: </Text>
          <TextInput
            style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
            placeholder="Username"
            onChangeText={(val) => { this.changeLoginNameHandler(val) }}
          />        
        </View>
        {/* Below line places space between text/images */}
        <Text style={{fontSize:10}}> </Text>

        <View style={{ flexDirection:'row' }}>
          <Text style={{fontSize:20}}>Password: </Text>
          <TextInput
            style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(val) => { this.changePasswordHandler(val) }}
          />
        </View>
        <Text style={{fontSize:20}}>{this.state.message} </Text>
        </View>

        <Button
          title="Do Login"
          onPress={this.handleClick}
        />
        <Button
          title="Don't have an account? Register here."
          onPress={ () => this.props.navigation.navigate('Register')} //onPress takes in a function
          //  no input, followed by action
        />
        <Button
          title="To Cards Page"
          onPress={ () => this.props.navigation.navigate('Card')} //onPress takes in a function
          //  no input, followed by action
        />
        <Button
          title="To Test Page"
          onPress={ () => this.props.navigation.navigate('Test')} //onPress takes in a function
          //  no input, followed by action
        />
    </View>
    </View> 
    );
  }

  handleClick = async () =>
  {
    try
    {
      var obj = {login:global.loginName.trim(),password:global.password.trim()};
      var js = JSON.stringify(obj);

      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/login',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.id <= 0 )
      {
        this.setState({message: "Usere/Password combination incorrect" });
      }
      else
      {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.userId = res.id;
        this.props.navigation.navigate('Landing');
      }
    }
    catch(e)
    {
      this.setState({message: e.message });
    }
  }  

  changeLoginNameHandler = async (val) =>
  {
    global.loginName = val;
  }  

  changePasswordHandler = async (val) =>
  {
    global.password = val;
  }  

}


const styles = {
  container: {
    flex: 1,                  // takes up the available width of the container ( relative to other flex values of other objects)
    justifyContent: 'center', // aligns items by Row
    alignItems: 'center',     // aligns items by Column
    backgroundColor: '#aaaaa0',
  },
  body: {
    borderRadius: 10,
    backgroundColor: '#F8CD46',
    padding: 15,              // how many pixels around the text that this View will also take up

    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,    //establishes layering

    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:  {
    width: 125,
    height: 125,
    resizeMode: 'contain',
  },
  back: {
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
    elavation: -1,
  }
}