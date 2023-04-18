// RegScreen.js

import React, { Component, useState } from 'react';
import { ImageBackground, Button, View, Text, TextInput } from 'react-native';

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
      <ImageBackground source ={require('../assets/RegisterBG.jpg')} style ={{flex:1}}>
      <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.titleContainer}>
          <Text style={{fontSize:30}}>{" "}Register </Text>
        </View>
        <Text style={{fontSize:20}}> </Text> 
        {/* Above line puts a gap between words */}

        <View style={{alignItems: 'flex-end'}}>
          {/* First Name */}
          <View style={{ flexDirection:'row' }}>
            <Text style={{fontSize:20}}>First Name: </Text>
            <TextInput
            style={styles.textInp}
            placeholder=" First Name"
            onChangeText={(val) => { this.changeFirstNameHandler(val) }}
            />        
          </View>
          <Text style={{fontSize:20}}> </Text>
          {/* Last Name */}
          <View style={{ flexDirection:'row' }}>
            <Text style={{fontSize:20}}>Last Name: </Text>
            <TextInput
            style={styles.textInp}
            placeholder=" Last Name"
            onChangeText={(val) => { this.changeLastNameHandler(val) }}
            />
          </View>
          <Text style={{fontSize:20}}> </Text>
          {/* Email */}
          <View style={{ flexDirection:'row' }}>
            <Text style={{fontSize:20}}>E-mail: </Text>
            <TextInput
            style={styles.textInp}
            placeholder=" Email"
            onChangeText={(val) => { this.changeEmailHandler(val) }}
            />
          </View>
          <Text style={{fontSize:20}}> </Text>
          {/* Login */}
          <View style={{ flexDirection:'row' }}>
            <Text style={{fontSize:20}}>Login: </Text>
            <TextInput
            style={styles.textInp}
            placeholder=" Login"
            onChangeText={(val) => { this.changeLoginNameHandler(val) }}
            />
          </View>
          <Text style={{fontSize:20}}> </Text>
          {/* Password */}
          <View style={{ flexDirection:'row' }}>
            <Text style={{fontSize:20}}>Password: </Text>
            <TextInput
            style={styles.textInp}
            placeholder=" Last Name"
            onChangeText={(val) => { this.changePasswordHandler(val) }}
            />
          </View>
          <Text style={{fontSize:15}}>{this.state.message} </Text>
        </View>

        <Button
          title="Register"
          onPress={() => {
            this.handleClick().then(succeed => {
              if (succeed){
                this.sendVerificationEmail();
              }
            })
          }}
        />
      </View>
      </View>
      </ImageBackground>
    );
  }

  // registers user and calls the function that send the verification email
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
      console.log("register JSON return: ");
      console.log(res);

      if( res.Success == false )
      {
        this.setState({message: "New user failed to be created" });
      }
      else
      {

        global.userId = res.User.insertedId;

        console.log("res.id: " + res.User.insertedId + "     global.userId" + global.userId);

        console.log("User Created, Now sending verification email");
        // this.sendVerificationEmail();
        

        this.setState({message: "New User Created. Please register your E-mail." });

        return res.Success;
      }
    }
    catch(e)
    {
      this.setState({message: e.message });
    }
  } //end of creating new user endpoint call

  sendVerificationEmail = async() => {
    try{
      console.log("id: " + global.userId + "  first name: " + global.firstName + "  last name: "+ global.lastName);

      var obj = { userId : global.userId }
      console.log("142: test 1");

      var js = JSON.stringify(obj);

      console.log("JSON to be sent to email/sendverification");
      console.log(js);
      console.log("146: test 2");
      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/email/sendverification',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      console.log("150: test 3");

      var res = JSON.parse(await response.text());
      console.log("email verification response: ");
      console.log(res);

      if (res.Success == false){
        console.log("Threw: Email Not Sent Successfully");
        throw "Email Not Sent Successfully"
      }
      else{
        console.log("Email sent");
      }

    }
    catch(e){
      console.log("sendVerificationEmail error message:");
      console.log(e);
      this.setState({message: e.message})
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


const styles = {
  container: {
    flex: 1,                  // takes up the available width of the container ( relative to other flex values of other objects)
    justifyContent: 'center', // aligns items by Row
    alignItems: 'center',     // aligns items by Column
    //backgroundColor: '#aaaaa0',
  },
  body: {
    borderRadius: 10,
    backgroundColor: '#F8CD46',
    paddingVertical: 15,              // how many pixels around the text that this View will also take up
    paddingHorizontal: 25,

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

  textInp: {
    height: 30,
    width: 120,
    fontSize:20, 
    backgroundColor:'#ffffff',
    borderRadius: 5
  },
  titleContainer: {
    alignSelf: 'center',
    padding: 5,
    borderBottomWidth: 3,
    borderBottomColor: 'black',
  },
}