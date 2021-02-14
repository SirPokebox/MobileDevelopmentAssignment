import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Coffee extends Component{
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () =>{
    this.checkedLoggedIn();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  checkedLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Home');
    }
  };
  constructor(props){
    super(props);
  }
  logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method: 'post',
      headers: {
        "X-Authorization": token
      }
    })
    .then((response) => {
      if(response.status === 200){
        ToastAndroid.show("Log out successful!", ToastAndroid.SHORT);
        this.props.navigation.navigate('Home');
      }else if(response.staus === 401){
        ToastAndroid.show("No user logged in!", ToastAndroid.SHORT);
        this.props.navigation.navigate('Home');
      }else{
        throw 'something went wrong' ;
      }
    })
    .catch((error) =>{
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  render(){
    const navigation = this.props.navigation;

    return(
      <View style ={styles.container}>
        <Text style = {styles.pagetitle}>Review Screen</Text>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('Map View')}
          >
            <Text style = {styles.text}>See Local Coffee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => this.logout()}
          >
            <Text style = {styles.text}>Log Out</Text>
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
  text: {
    color: 'white',
    fontSize: 25
  },
  button: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginBottom: 40,
    textAlign:"center"
  }
});

export default Coffee;
