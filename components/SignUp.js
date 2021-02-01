import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, ScrollView, SafeAreaView } from 'react-native';

class Register extends Component{
  constructor(props) {
    super(props);
    this.state={
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    }
  }
  signupValidation=()=> {
    const { email, password} = this.state

    if(email == ""){
      ToastAndroid.show('Please enter a valid email address', ToastAndroid.SHORT);
      return false
    } else if(password.length < 6){
      ToastAndroid.show('Please enter a secure pasword with atleast 6 characters', ToastAndroid.SHORT);
      return false
    }
    this.CreateAccount()
  }
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
          throw 'please fill in the empty field';
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
