
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class Home is the loginscreen where the user must enter an email and password into the TextInputs to logon to the app */
class Home extends Component{

  /** This.state constructor initialises the variabes: email and password */
  constructor(props) {
    super(props);
    this.state={
      email: "",
      password: ""
    }
  }

  /**
  *  signIn is an async arrow function used to login to the app
  *
  *  return fetch-  makes a request to the url provided, it is followed by a post request to the api which includes the content-type
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response.json
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user, they are then navigated to the Coffee screen
  *  await AsyncStorage.setItem - is used to set both the token and user id
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  signIn = async () => {

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if(response.status === 400){
          throw 'Invalid Email/Password supplied';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then(async (responseJson) => {
          console.log(responseJson);
          await AsyncStorage.setItem('@session_token', responseJson.token);
          await AsyncStorage.setItem('id', responseJson.id.toString());
          ToastAndroid.show('Login successful!', ToastAndroid.SHORT);
          this.props.navigation.navigate("Coffee");
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  render displays everything out to the user side
  *
  *  <View> - is used and it contains the FlatList
  *  <Text> - is used to display the page title
  *  <TwxtInput> - is used to take the user input and sets the state of email and password when entered
  *  <TouchableOpacity> - When pressed will call either the signIn function or navigate the user to the Register screen
  */
  render(){
    const navigation = this.props.navigation;

    return(
      <View style ={styles.container}>
        <Text style={styles.pagetitle}>Coffee Reviews</Text>
        <TextInput
        placeholder="email address"
        onChangeText={(email) => this.setState({email})}
        value={this.state.email}
        style={styles.input}
        />
        <TextInput
        placeholder="password"
        onChangeText={(password) => this.setState({password})}
        value={this.state.password}
        style={styles.input}
        secureTextEntry
        />
        <TouchableOpacity
          style = {styles.button}
          onPress={() => this.signIn()}
        >
          <Text style = {styles.text}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('Register')}
          >
            <Text style = {styles.text}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

/**
*  styles is the name of the StyleSheet used to give the components their properties
*/
const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6F4E37',
    paddingHorizontal: 10
  },
  button: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6F4E37',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    margin: 5,
    marginTop: 8,
    width:"100%",
    borderRadius:25,
    height:50

  },
  text: {
    color: 'white',
    fontSize: 25
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginBottom: 40,
    textAlign:"center"
  }
});

export default Home;
