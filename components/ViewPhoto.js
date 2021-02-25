
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating, AirbnbRating } from 'react-native-ratings';

/** imports the class UserReviews */
import UserReviews from './UserReviews.js'

/** @description The class ReviewPhoto lets the user view the review made and photo that was uploaded to that review */
class ReviewPhoto extends Component{

/** This.state constructor initialises the variabes: photoUrl loc_id and rev_id */
  constructor(props) {
    super(props);
    this.state={
      loc_id : "",
      rev_id: "",
      photoUrl: null,
    }
  }

/** componentDidMount sets the state of loc_id and rev_id to the const locid and revid which are stored in this.props.route.params which have been passed over from the previous screen, it also calls the ViewUserReview function */
  componentDidMount(){
    const {revid} = this.props.route.params;
    const {locid} = this.props.route.params;
    this.setState({
      loc_id: locid,
      rev_id: revid
    });
    this.ViewUserReview();
  }

  /**
  *  ViewUserReview is an async arrow function used to view a reviews photo
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch-  makes a request to the url provided + the variable loc_id and the variable rev_id, it is followed by a get request to the api which includes the token variable and content-type
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is set to the variable photoUrl and is outputted to the console and a ToastAndroid is shown to the user
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  ViewUserReview = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/photo", {
      method: 'get',
      headers: {
        "Content-Type": "image/jpeg",
        'X-Authorization': token
      },
    })
    .then((response) => {
        if(response.status === 200){
          return response
        }else if(response.status === 404){
          throw 'Not Found';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
          this.setState({
            photoUrl: responseJson.url
          })
          ToastAndroid.show('Found photo!', ToastAndroid.SHORT);
          console.log("Found photo: ", responseJson);

    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  render displays everything out to the user side
  *
  *  <SafeAreaView> - is used and it contains the current review selected and the image related to that review
  *  <Text> - is used to display the review from the previous screen using this.props.route.params
  *  <Image> - is used to display the review using the variable photoUrl
  *
  */
render(){

  const {revBody} = this.props.route.params;
  const {locName} = this.props.route.params;
  const {locTown} = this.props.route.params;
  const {overallRating} = this.props.route.params;

  return(
    <SafeAreaView  style ={styles.container}>
    <Text style = {styles.text}> Current Review: </Text>
    <Text style = {styles.locationText}>Review ID: {this.state.rev_id}{"\n"}{"\n"}{(locName)}, found in {(locTown)}{"\n"}{"\n"}Overall Rating: {(overallRating)}{"\n"}{"\n"}Review:{"\n"}{"\n"}{(revBody)}</Text>
    <Text style = {styles.text}> Photo: </Text>
    <Image
      style = {styles.imageSize}
      source = {{uri:this.state.photoUrl}}
    />
    </SafeAreaView>
  )
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
    fontSize: 25,
    marginBottom: 10
  },
  imageSize: {
    width : 250,
    height: 250
  },
  button: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  locationText: {
    color: 'black',
    fontSize: 15,
    padding: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    width: "100%"
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6F4E37',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    margin: 1,
    marginTop: 5,
    width:"100%",
    borderRadius:25,
    height:35
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'white',
    marginBottom: 40,
    textAlign:"center"
  }

});
export default ReviewPhoto;
