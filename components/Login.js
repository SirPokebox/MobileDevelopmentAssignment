import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component{
  constructor(props) {
    super(props);
    this.state={
      email: "",
      password: ""
    }
  }
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
          throw 'Invalid email address or password entered';
        }else{
          throw 'Something went wrong';
        }
    })
    .then(async (responseJson) => {
          console.log(responseJson);
          await AsyncStorage.setItem('@session_token', responseJson.toString());
          ToastAndroid.show('Login successful!', ToastAndroid.SHORT);
          this.props.navigation.navigate("Coffee");
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
