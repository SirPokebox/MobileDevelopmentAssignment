
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating, AirbnbRating } from 'react-native-ratings';

/** imports the class UserReviews */
import UserReviews from './UserReviews.js'

/** @description The class UpdateReviews displays the review the user selects from the previous screen and uses AirbnbRatings to update their review and a TextInput to update the review body, it also lets the user delete their review */
class UpdateReviews extends Component{

/** This.state constructor initialises the variabes/arrays: overall_rating, price_rating, quality_rating, clenliness_rating, review_body, revi_id, loc_id */
  constructor(props) {
    super(props);
    this.state={
      loc_id : "",
      rev_id: "",
      overall_rating: "",
      price_rating: "",
      quality_rating: "",
      clenliness_rating: "",
      review_body: "",
    }
  }

/** componentDidMount sets the state of loc_id and rev_id to the const locid and revid which are stored in this.props.route.params which have been passed over from the previous screen */
  componentDidMount(){
    const {revid} = this.props.route.params;
    const {locid} = this.props.route.params;
    this.setState({
      loc_id: locid,
      rev_id: revid
    });
  }

  /**
  *  UpdateUserReview is an async arrow function used to update a user review
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  * let updateReview_toServer - sets all the variables relevant to updating a review 
  *  return fetch -  makes a request to the url provided + the variable loc_id and the variabe rev_id, it is followed by a patch request to the api which includes the token variable and content-type
  *  body - is set to updateReview_toServer which is JSON.stringified
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user, they are then navigated to the UserReviews screen
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  UpdateUserReview = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    let updateReview_toServer = {
      overall_rating: parseInt(this.state.overall_rating),
      price_rating: parseInt(this.state.price_rating),
      quality_rating: parseInt(this.state.quality_rating),
      clenliness_rating: parseInt(this.state.clenliness_rating),
      review_body: this.state.review_body
    }
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id), {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        "X-Authorization": token
      },
      body: JSON.stringify(updateReview_toServer)
    })
    .then((response) => {
        if(response.status === 200){
          return response
        }else if(response.status === 400){
          throw 'Bad Request';
        }else if(response.status === 401){
          throw 'Unauthorised';
        }else if(response.status === 403){
          throw 'Forbidden';
        }else if(response.status === 404){
          throw 'Not Found';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
          ToastAndroid.show('Review Updated!', ToastAndroid.SHORT);
          console.log("Review Updated: ", responseJson);
          this.props.navigation.navigate("UserReviews");
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  DeleteUserReview is an async arrow function used to delete a user review
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch-  makes a request to the url provided + the variable loc_id and the variabe rev_id, it is followed by a delete request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user, they are then navigated to the UserReviews screen
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  DeleteUserReview = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id), {
      method: 'delete',
      headers: {
        "X-Authorization": token
      },
    })
    .then((response) => {
        if(response.status === 200){
          return response
        }else if(response.status === 400){
          throw 'Bad Request';
        }else if(response.status === 401){
          throw 'Unauthorised';
        }else if(response.status === 403){
          throw 'Forbidden';
        }else if(response.status === 404){
          throw 'Not Found';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
          ToastAndroid.show('Review Deleted!', ToastAndroid.SHORT);
          console.log("Deleted Updated: ", responseJson);
          this.props.navigation.navigate("UserReviews");
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  * overallRating, priceRating, qualityRating and clenlinessRating all set their corresponding AirbnbRating input values to the variabes: overall_rating, price_rating, quality_rating and clenliness_rating using this.setState
  */
  overallRating= (rating) =>{
    this.setState({overall_rating: rating.toString()})
  }
  priceRating = (rating) =>{
    this.setState({price_rating: rating.toString()})
  }
  qualityRating = (rating) =>{
    this.setState({quality_rating: rating.toString()})
  }
  clenlinessRating = (rating) =>{
    this.setState({clenliness_rating: rating.toString()})
  }

  /**
  *  render displays everything out to the user side
  *
  *  <SafeAreaView> - is used and it contains the AirbnbRatings
  *  <Text> - is used to display the review from the previous screen using this.props.route.params
  *  <AirbnbRating> - used to take user input for ratings, one for overallRating, priceRating, qualityRating and clenlinessRating
  *   <TouchableOpacity> - There are two, one calls the UpdateUserReview function and the other calls the DeleteUserReview function onpress
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
    <Text style ={styles.text}>Overall Rating:</Text>
    <AirbnbRating
      defaultRating={0}
      Count={5}
      Size={5}
      showRating={false}
      onFinishRating={this.overallRating}
    />
    <Text style ={styles.text}>Price Rating:</Text>
    <AirbnbRating
      defaultRating={0}
      Count={5}
      Size={5}
      showRating={false}
      onFinishRating={this.priceRating}
    />
    <Text style ={styles.text}>Quality Rating:</Text>
    <AirbnbRating
      defaultRating={0}
      Count={5}
      Size={5}
      showRating={false}
      onFinishRating={this.qualityRating}
    />
    <Text style ={styles.text}>Clenliness Rating:</Text>
    <AirbnbRating
      defaultRating={0}
      Count={5}
      Size={5}
      showRating={false}
      onFinishRating={this.clenlinessRating}
    />
    <TextInput
    placeholder="Review:"
    onChangeText={(review_body) => this.setState({review_body})}
    value={this.state.review_body}
    style={styles.input}
    />
    <TouchableOpacity
    style = {styles.button}
    onPress={() => {
    this.UpdateUserReview()
    }}
    >
    <Text style = {styles.text}>Update Review</Text>
    </TouchableOpacity>
    <TouchableOpacity
    style = {styles.button}
    onPress={() => {
    this.DeleteUserReview()
    }}
    >
    <Text style = {styles.text}>Delete Review</Text>
    </TouchableOpacity>
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
export default UpdateReviews;
