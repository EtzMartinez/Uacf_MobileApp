import React, { Component, useState } from 'react';
import { ActivityIndicator, Button, View, Text, TextInput, Image, ImageBackground } from 'react-native';

// global.localName = '';
// global.password = '';
// global.userId = -1;
// global.firstName = '';
// global.lastName = '';

export const localName = '';
export const password = '';
export const id = '';
export const firstName = '';
export const lastName = '';
export const token = '';


export default class LoginScreen extends Component {

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
      <ImageBackground source={require('../assets/LoginBG.jpg')} style ={{flex:1}}>
      <View style={styles.container}>
      
      <View style={styles.body}>
        <View style={styles.logoTitleContainer}>
          <Image
            source={require('../assets/logo-border.png')}
            style={styles.logo}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
                {" "} U [Actually] Can {"\n"} Finish Scheduling
            </Text>
          </View>
        </View>

        <Text style={{fontSize:15}}> </Text>
        <View style={{alignItems: 'flex-end'}}>
          
          <View style={{ flexDirection:'row' }}>
            <Text style={{fontSize:20}}>Username: </Text>
            <TextInput
              style={styles.textInp}
              placeholder=" Username"
              onChangeText={(val) => { this.changeLoginNameHandler(val) }}
            />        
          </View>
          {/* Below line places space between text/images */}
          <Text style={{fontSize:10}}> </Text>

          <View style={{ flexDirection:'row' }}>
            <Text style={{fontSize:20}}>Password: </Text>
            <TextInput
              style={styles.textInp}
              placeholder=" Password"
              secureTextEntry={true}
              onChangeText={(val) => { this.changePasswordHandler(val) }}
            />
          </View>
          <Text style={{fontSize:15}}>{this.state.message} </Text>
        </View>

        <Button
          title="Login"
          onPress={this.handleClick}
        />
        <Button
          title="Register"
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
        <Button
          title="skip login"
          onPress={ () => this.props.navigation.navigate('Landing')} //onPress takes in a function
          //  no input, followed by action
        />
      </View>
      </View>
      </ImageBackground>
    );
  }

  handleClick = async () =>
  {
    try
    {
      var obj = {Login:global.loginName.trim(),Password:global.password.trim()};
      var js = JSON.stringify(obj);

      const response = await fetch('http://cop4331-ucaf1.herokuapp.com/user/login',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      console.log("JSON ID:" + res.id);

      if( res.success == false )
      {
        this.setState({message: "User/Password combination incorrect" });
      }
      else
      {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.id = res.id;
        global.token = res.CookieToken;
        console.log("From Login screen ------ userID: " + global.id + ", Token: "+ global.token);
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
    //backgroundColor: '#aaaaa0',
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
  
  textInp: {
    height: 30,
    width: 120,
    fontSize:20, 
    backgroundColor:'#ffffff',
    borderRadius: 5
  },

  logoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  titleContainer: {
    paddingBottom: 5,
    borderBottomWidth: 3,
    borderBottomColor: 'black',
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },

}