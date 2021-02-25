
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ToastAndroid, ScrollView, SafeAreaView } from 'react-native';

/** @description The class Register is the signup screen that lets the user create an account to use the app */
class Register extends Component{

  /** This.state constructor initialises the variabes: first_name, last_name, email and password */
  constructor(props) {
    super(props);
    this.state={
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    }
  }
  
  /** signupValidation is a validation check to see if the user has actually set a secure password/set an email address, once the validation has passed it then calls the CreateAccount function */
  signupValidation=()=> {
    const { email, password} = this.state

    if(email == ""){
      ToastAndroid.show('Please enter an email address', ToastAndroid.SHORT);
      return false
    } else if(password.length < 6){
      ToastAndroid.show('Please enter a secure pasword with atleast 6 characters', ToastAndroid.SHORT);
      return false
    }
    this.CreateAccount()
  }

  /**
  *  create is an arrow function used to sign up to the app
  *
  *  return fetch-  makes a request to the url provided, it is followed by a post request to the api which includes the content-type
  *  body - is set to this.state which is JSON.stringified
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response.json
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user, they are then navigated to the login screen Home
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  CreateAccount = () => {

    return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 201){
          return response.json()
        }else if(response.status === 400){
          throw 'Bad Request';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
          ToastAndroid.show('New Account Created Successfully!', ToastAndroid.SHORT);
          console.log("Account created with ID: ", responseJson);
          this.props.navigation.navigate("Home");
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  render displays everything out to the user side
  *
  *  <SafeAreaView> - is used and it contains the menu options
  *  <ScrollView> - used so the user can scroll whilst filling in the <TextInput> fields
  *  <Text> - is used to display the page title
  *  <TextInput> - used for the user to input their details and changes the state of: first_name, last_name, email and password
  *  <TouchableOpacity> - When pressed will the signupValidation function
  */
  render(){
    const navigation = this.props.navigation;

    return(
      <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.pagetitle}>Create Account</Text>
        <TextInput
        placeholder="first name"
        onChangeText={(first_name) => this.setState({first_name})}
        value={this.state.first_name}
        style={styles.input}
        />
        <TextInput
        placeholder="last name"
        onChangeText={(last_name) => this.setState({last_name})}
        value={this.state.last_name}
        style={styles.input}
        />
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
          onPress={() => this.signupValidation()}
        >
          <Text style = {styles.text}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    );
  }
}

/**
*  styles is the name of the StyleSheet used to give the components their properties
*/
const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#6F4E37',
    paddingHorizontal: 10
  },
  button: {
    marginTop: 20,
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
    margin: 1,
    marginTop: 45,
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
    marginTop:80,
    marginBottom: 40,
    textAlign:"center"
  }
});

export default Register;
