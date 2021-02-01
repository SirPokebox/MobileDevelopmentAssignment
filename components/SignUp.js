import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';

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
          throw 'that account already exists, please use a different email';
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
      <View style ={styles.container}>
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
          onPress={() => this.CreateAccount()}
        >
          <Text style = {styles.text}>Create Account</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6F4E37',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    margin: 5,
    marginTop: 8
  },
  text: {
    color: 'white',
    fontSize: 25
  }
});

export default Register;
