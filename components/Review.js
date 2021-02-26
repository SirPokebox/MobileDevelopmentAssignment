
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class Coffee is the home screen where the user can decide what they like to do on the application */
class Coffee extends Component{

  /** constructor used for props */
  constructor(props){
    super(props);
  }

  /** componentDidMount calls the function this.checkedLoggedIn and this.unsubscribe which double checks if a user is logged in or not */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () =>{
    this.checkedLoggedIn();
    });
  }

  /** componentWillUnmount calls the function this.unsubscribe */
  componentWillUnmount(){
    this.unsubscribe();
  }

  /** The async function checkedLoggedIn checks if the user has a token, if they do not they get navigated to the login screen*/
  checkedLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Home');
    }
  };

  /**
  *  logout is an async arrow function used to log the user out
  *
  *  await AsyncStorage.getItem - retrieves the token and user id that is stored witihin async storage
  *  return fetch-  makes a request to the url provided, it is followed by a post request to the api which includes the token variable
  *  .then((response) - if there is a 200 status code from the server a ToastAndroid is outputted to the user informing them they have logged out and they are navigated to the login screen Home
  *  otherwise the api will throw a server error which is handled with if/else if statements 
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
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
        throw 'Unauthorised';
        this.props.navigation.navigate('Home');
      }else if(response.staus === 500){
        throw 'Server Error';
      }else{
        throw 'something went wrong' ;
      }
    })
    .catch((error) =>{
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }
  
  /**
  *  render displays everything out to the user side
  *
  *  <View> - is used and it contains the menu options
  *  <Text> - is used to display the page title
  *  <TouchableOpacity> - When pressed will direct the user to another part of the application whether that is making a review or viewing their profile or logging out and calling the logout function
  */
  render(){
    const navigation = this.props.navigation;

    return(
      <View style ={styles.container}>
        <Text style = {styles.pagetitle}>Home Screen</Text>
        <ScrollView>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('UserProfile')}
          >
            <Text style = {styles.text}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('FavouriteCoffee')}
          >
            <Text style = {styles.text}>My Favourite Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('SelectCoffee')}
          >
            <Text style = {styles.text}>View a Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('Map View')}
          >
            <Text style = {styles.text}>See Local Coffee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('ViewAllReviews')}
          >
            <Text style = {styles.text}>See All Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('MakeReview')}
          >
            <Text style = {styles.text}>Make a review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => this.logout()}
          >
            <Text style = {styles.text}>Log Out</Text>
        </TouchableOpacity>
        </ScrollView>
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
