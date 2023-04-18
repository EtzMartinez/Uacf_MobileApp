import React, { Component, useState } from 'react';
import { ImageBackground, Button, View, Text, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

global.login = '';

global.userId = -1;
global.firstName = '';
global.lastName = '';

global.emailToSendOut = '';
global.cookieToken = '';
global.verificationKey = '';

global.email = '';
global.confCode = '';
global.password = '';
global.passwordRetype = '';


export default class PasswordScreen extends Component {
  //const [outputText, setOutputText] = useState('We Love COP 4331');

  constructor(props) {  // useState cannot be used inside components
    super(props);
    this.state = {
      outputText: 'password screen',
      messageEmail: 'whatup',
      messagePass: 'hello'
    };
  }

  render(){
    return(
      <View style = {styles.container}>
        <View style={{alignItems: 'flex-end'}}>
        {/* E-Mail for Password Recovery: */}
        <View style={{ flexDirection:'row' }}>
          <Text style={{fontSize:20}}>E-Mail for Password Recovery: </Text>
          <TextInput
          style={styles.textInp}
          placeholder=" Email"
          onChangeText={(val) => { this.changeEmailHandler(val) }}
          />        
        </View>
        <Text style={{fontSize:20}}> {this.state.messageEmail} </Text>

        <TouchableOpacity style={styles.universalButton} onPress={() => this.sendConfirmationCode()}>
          <Text>Send Confirmation Code</Text>
        </TouchableOpacity>


        {/* Confirmation */}
        <View style={{ flexDirection:'row' }}>
          <Text style={{fontSize:20}}>Confirmation Code: </Text>
          <TextInput
          style={styles.textInp}
          placeholder=" Confirmation Code"
          onChangeText={(val) => { this.changeConfCodeHandler(val) }}
          />
        </View>
        <Text style={{fontSize:20}}>  </Text>
        {/* password */}
        <View style={{ flexDirection:'row' }}>
          <Text style={{fontSize:20}}>E-mail: </Text>
          <TextInput
          style={styles.textInp}
          placeholder=" Password"
          onChangeText={(val) => { this.changePasswordHandler(val) }}
          />
        </View>
        <Text style={{fontSize:20}}> </Text>
        {/* Password retype */}
        <View style={{ flexDirection:'row' }}>
          <Text style={{fontSize:20}}>Password: </Text>
          <TextInput
          style={styles.textInp}
          placeholder=" Retype Password"
          onChangeText={(val) => { this.changePasswordRetypeHandler(val) }}
          />
        </View>
        
      
        <TouchableOpacity style={styles.universalButton} onPress={() => this.changePasswordCall()}>
          <Text>Change Password</Text>
        </TouchableOpacity>

        <Text style={{fontSize:15}}>{this.state.messagePass} </Text>

      </View>
    </View>
  )}



  changeEmailHandler = async (val) =>
  {
    global.email = val;
    
  } 

  changeConfCodeHandler = async (val) =>
  {
    global.confCode = val;
 
  }  
  
  changePasswordHandler = async (val) =>
  {
    global.password = val;
  }  
  changePasswordRetypeHandler = async (val) =>
  {
    global.passwordRetype = val;
  }  

  // ------------------- API calls ----------------------
  sendConfirmationCode = async() => {
    console.log("--------------send confirmation code --------------");
    console.log("email global: " + global.email);
    this.setState( {messageEmail: "Trying to send email..."} );

    try{

      //make email/passwordrest call
      var obj = { Email: global.email };
      var js = JSON.stringify(obj);

      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/email/passwordreset',
      {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());
      console.log(res);

      if(res.Success){
        global.id = res.user._id;
        global.login = res.user.Login;
        // dont need password
        global.firstName = res.userFirstName;
        global.lastName = res.user.LastName;
        global.emailToSendOut = res.user.Email;
        global.cookieToken = res.user.CookieToken;
        global.verificationKey = res.user.VerfKey;
        console.log("user hopefully update");
      }

    }
    catch (e){
      console.log(e);
      this.setState({messagePass: e})
    }



  }


  changePasswordCall = async() => {
    console.log("-------------change password in database --------------");
    this.setState( {messagePass: "Sending change password request..."} );
    console.log("conf code global: " + global.confCode);
    console.log("verifcation key from data base: " + global.verificationKey);
    console.log("pass global: " + global.password);
    console.log("pass retype global: " + global.passwordRetype);

    try{
      //make sure passwords match
      if(global.password !== global.passwordRetype){
        throw "Passwords do not match"
      }
      //check if confirmation key works
      if (global.confCode !== global.verificationKey){
        throw "Incorrect Verification Code"
      }
      
      // if the test were goodm then package the JSON
      var obj = {
        userId: global.id,
        login: global.login,
        password: global.passwordRetype,
        FirstName: global.firstName,
        LastName: global.lastName,
        Email: global.emailToSendOut,
        CookieToken: global.cookieToken
      };
      var js = JSON.stringify(obj);

      const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/update',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());
      console.log(res);

      if (!res.Success){
        throw "failed attempt"
      }
      else{
        throw "password change successful"
      }

    }
    catch(e){
      console.log(e);
      this.setState({messagePass: e})
    }


  }

}



const styles = {
  container: {
    flex: 1,                  // takes up the available width of the container ( relative to other flex values of other objects)
    justifyContent: 'flex-start', // aligns items by Row
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

  universalButton:{
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: "#f8cd48",

    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  universalButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
}