// Loginscreen.js

import React, { Component, useState } from 'react';
import { ActivityIndicator, Button, View, Text, TextInput } from 'react-native';

global.localName = '';
global.password = '';
global.userId = -1;
global.firstName = '';
global.lastName = '';
global.email = '';

export default class RegisterScreen extends Component {

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
        <View style={{ backgroundColor:'#0cc00c', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
        <Text style={{fontSize:30}}>Register Screen </Text>
        <Text style={{fontSize:20}}> </Text> 
        {/* Above line puts a gap between words */}

        <View style={{alignItems: 'flex-end'}}>
            {/* First Name */}
            <View style={{ flexDirection:'row' }}>
                <Text style={{fontSize:20}}>First Name: </Text>
                <TextInput
                style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
                placeholder="First Name"
                onChangeText={(val) => { this.changeFirstNameHandler(val) }}
                />        
            </View>
            <Text style={{fontSize:20}}> </Text>
            {/* Last Name */}
            <View style={{ flexDirection:'row' }}>
                <Text style={{fontSize:20}}>Last Name: </Text>
                <TextInput
                style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
                placeholder="Last Name"
                onChangeText={(val) => { this.changeLastNameHandler(val) }}
                />
            </View>
            <Text style={{fontSize:20}}> </Text>
            {/* Email */}
            <View style={{ flexDirection:'row' }}>
                <Text style={{fontSize:20}}>E-mail: </Text>
                <TextInput
                style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
                placeholder="Email"
                onChangeText={(val) => { this.changeEmailHandler(val) }}
                />
            </View>
            <Text style={{fontSize:20}}> </Text>
            {/* Login */}
            <View style={{ flexDirection:'row' }}>
                <Text style={{fontSize:20}}>Login: </Text>
                <TextInput
                style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
                placeholder="Login"
                onChangeText={(val) => { this.changeLoginNameHandler(val) }}
                />
            </View>
            <Text style={{fontSize:20}}> </Text>
            {/* Password */}
            <View style={{ flexDirection:'row' }}>
                <Text style={{fontSize:20}}>Password: </Text>
                <TextInput
                style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
                placeholder="Last Name"
                onChangeText={(val) => { this.changePasswordHandler(val) }}
                />
            </View>
            <Text style={{fontSize:20}}>{this.state.message} </Text>


        </View>

        <Button
            title="Register"
            onPress={this.handleClick}
        />
        </View>
    );
  }

  handleClick = async () =>
  {
    try
    {
        var obj = {
            FirstName: global.firstName.trim(),
            LastName: global.lastName.trim(),
            login: global.loginName.trim(),
            password: global.password.trim(),
            Email: global.email.trim()
        };
        var js = JSON.stringify(obj);

        const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/register',
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

        var res = JSON.parse(await response.text());

        if( res.id <= 0 )
        {
            this.setState({message: "New user failed to be created" });
        }
        else
        {
            global.firstName = res.firstName;
            global.lastName = res.lastName;
            global.userId = res.id;
            this.setState({message: "New User Created... hopefully" });
        }
    }
    catch(e)
    {
      this.setState({message: e.message });
    }
  }  

  changeFirstNameHandler = async (val) =>
  {
    global.firstName = val;
  }  
  changeLastNameHandler = async (val) =>
  {
    global.lastName = val;
  }  
  changeEmailHandler = async (val) =>
  {
    global.email = val;
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
