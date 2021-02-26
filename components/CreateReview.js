
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating, AirbnbRating } from 'react-native-ratings';

/** @description The class MakeReview uses the AirbnbRatings for the user to input their ratings for a review, they can also type in their review using a TextInput */
class MakeReview extends Component{

  /** This.state constructor initialises the variabes/arrays: overall_rating, price_rating, quality_rating, clenliness_rating, review_body, locationData, loc_id, ButtonState */
  constructor(props) {
    super(props);
    this.state={
      overall_rating: "",
      price_rating: "",
      quality_rating: "",
      clenliness_rating: "",
      review_body: "",
      locationData: [],
      loc_id: "",
      ButtonState: false,
      isLoading: true
    }
  }

/** componentDidMount calls the function this.getData() in the first render cycle */
  componentDidMount(){
    this.getData();
    setTimeout(() => {
      this.setState({isLoading: false})
    }, 3000);
  }

/** ReviewValidation is an arrow function that checks the review body for the words tea, cake and pastry */
  ReviewValidation=()=> {
    const { review_body } = this.state
    if(review_body.includes("tea")){
      ToastAndroid.show('We do not like tea', ToastAndroid.SHORT);
      return false
    }else if(review_body.includes("cakes")){
      ToastAndroid.show('We do not like cake', ToastAndroid.SHORT);
      return false
    }else if(review_body.includes("cake")){
      ToastAndroid.show('We do not like cake', ToastAndroid.SHORT);
      return false
    }else if(review_body.includes("pastry")){
      ToastAndroid.show('We do not like pastry', ToastAndroid.SHORT);
      return false
    }else if(review_body.includes("pastries")){
      ToastAndroid.show('We do not like pastry', ToastAndroid.SHORT);
      return false
    }  
    this.submitReview()
  }
  
  /**
  *  getData is an async arrow function used to gather all location information
  *
  *  await AsyncStorage.getItem - retrieves the token and user id that is stored witihin async storage
  *  return fetch-  makes a request to the url provided, it is followed by a get request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response.json()
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is set to the variable locationData and console.logs the responseJSON and locationData
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  getData = async () => {
    console.log("fetching location data now");
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/find", {
      method: 'get',
      headers: {
        "X-Authorization": token
      }
    })
    .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if(response.status === 400){
          throw 'Bad Request';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
          locationData: responseJson,
      })
          console.log("collected data!");
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

  /**
  *  submitReview is an async arrow function used to submit a review
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch-  makes a request to the url provided + the variable loc_id, it is followed by a post request to the api which includes the token variable
  *  body - is set to post_toServer which is JSON.stringified
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user, they are then navigated to the Coffee screen
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
submitReview = async () => {
  let post_toServer = {
    overall_rating: parseInt(this.state.overall_rating),
    price_rating: parseInt(this.state.price_rating),
    quality_rating: parseInt(this.state.quality_rating),
    clenliness_rating: parseInt(this.state.clenliness_rating),
    review_body: this.state.review_body
  }
  let token = await AsyncStorage.getItem('@session_token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review", {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token
    },
    body: JSON.stringify(post_toServer)
  })
  .then((response) => {
      if(response.status === 201){
        return response
      }else if(response.status === 400){
        throw 'Bad Request';
      }else if(response.status === 401){
        throw 'Unauthorised';
      }else if(response.status === 404){
        throw 'Not Found';
      }else if(response.status === 500){
        throw 'Server Error';
      }else{
        throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
        ToastAndroid.show('Review Submitted!', ToastAndroid.SHORT);
        this.props.navigation.navigate("Coffee");
  })
  .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
  })


}

/** DisableButtons is an arrow function that sets ButtonState to true */
  DisableButtons = () => {
    this.setState({
      ButtonState: true
    })
  }

  /**
  *  renderItem is an arrow function used to render a FlatList
  *
  *  the variables item and index are passed
  *  <View> - contains the <Text> and <TouchableOpacity>
  *  <Text> - is used to display the information from the FlatList data
  *  <TouchableOpacity> - is used to show the location name and location town of a coffee shop
  */
  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
        style = {styles.buttonLocation}
        onPress={() => {
          this.setState({loc_id : item.location_id})
          this.DisableButtons()
          ToastAndroid.show(item.location_name+" Selected!", ToastAndroid.SHORT);
        }}
        disabled = {this.state.ButtonState}
        >
        <Text style = {styles.locationText}>{item.location_name} found in {item.location_town} </Text>
        </TouchableOpacity>
      </View>
    )
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
  *  <SafeAreaView> - is used and it contains their user details
  *  <Text> - is used to display the page title
  *  <FlatList> - displays the variable locationData which is passed to data and is sorted by location_id (1 to 5)
  *  <TextInput> - used for the user to input the review and changes the review_body state
  *  <AirbnbRating> - used to take user input for ratings, one for overallRating, priceRating, qualityRating and clenlinessRating
  *  <TouchableOpacity> - When pressed call the submitReview function
  */
  render(){
    const navigation = this.props.navigation;
    return(
      <View style ={styles.loadingScreen}>
      {
        this.state.isLoading ?
      <ActivityIndicator size="large" color="white"/>
      :
      <View style ={styles.container}>
        <Text style = {styles.pagetitle}>Create Review</Text>
        <FlatList
          data={this.state.locationData.sort((a, b) => {return a.location_id - b.location_id;})}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.locationData}
          />
          <ScrollView>
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
          this.ReviewValidation()
          }}
          >
          <Text style = {styles.text}>Submit Review</Text>
          </TouchableOpacity>
          </ScrollView>
          </View>
          }
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
  loadingScreen:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#6F4E37',
  },
  text: {
    color: 'white',
    fontSize: 25
  },
  locationText: {
    color: 'white',
    fontSize: 15,
    padding: 1
  },
  button: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  buttonLocation: {
    marginTop: 5,
    marginBottom: 5,
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
    marginTop: 5,
    width:"100%",
    borderRadius:25,
    height:35
  },
  inputReview: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6F4E37',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    margin: 1,
    marginTop: 5,
    width:"50%",
    borderRadius:25,
    height:50
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginBottom: 20,
    textAlign:"center"
  }
});


export default MakeReview;
