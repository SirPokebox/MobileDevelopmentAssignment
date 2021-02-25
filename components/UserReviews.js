
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, SafeAreaView, ActivityIndicator, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class UserReviews gets every review that the user has created and outputs them in a FlatList, the user also has the option to view, add or delete any of their photos attached to a review they have made as well as update their review */

class UserReviews extends Component{

/** This.state constructor initialises the variabes/arrays: userReviews, favouriteCoffee, rev_id and loc_id */
  constructor(props) {
    super(props);
    this.state={
      userReviews: [],
      favouriteCoffee: [],
      rev_id: "",
      loc_id: "",
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

/**
*  getData is an async arrow function used to gather all the information on the User
*
*  await AsyncStorage.getItem - retrieves the token and user id that is stored witihin async storage
*  return fetch-  makes a request to the url provided + the variable userID, it is followed by a get request to the api which includes the token variable
*  .then((response) - if there is a response from the api and it is a 200 status code then it will return response.json()
*  otherwise the api will throw a server error which is handled with if/else if statements
*  .then((responseJson) - then the request retrieved from the server is set to the variable userReviews
*  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
*
*/
  getData = async () => {
    console.log("fetching user data now");
    let token = await AsyncStorage.getItem('@session_token');
    let userID = await AsyncStorage.getItem('id');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + (userID), {
      method: 'get',
      headers: {
        "X-Authorization": token
      }
    })
    .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if(response.status === 401){
          ToastAndroid.show("No user logged in!", ToastAndroid.SHORT);
          this.props.navigation.navigate('Home');
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
      console.log(responseJson);
      this.setState({
          userReviews: responseJson.reviews,
      })
          console.log("collected data!");
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

  /**
  *  DeletePhoto is an async arrow function used to delete a photo on a review
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch - makes a request to the url provided + the variable loc_id and rev_id, it is followed by a delete request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user and they are navigated to a different screen
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  DeletePhoto = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/photo", {
      method: 'delete',
      headers: {
        'X-Authorization': token
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
          ToastAndroid.show('Photo Deleted!', ToastAndroid.SHORT);
          console.log(responseJson);
          this.props.navigation.navigate("UserProfile");
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  render displays everything out to the user side
  *
  *  <SafeAreaView> - is used and it contains the FlatList
  *  <FlatList> - displays the variable userReviews which is passed to data and is sorted from the latest review to the oldest using the review_id
  *  <Text> - is used to display the FlatList data
  *  <TouchableOpacity> - is under each review, it also navigates to the screen UpdateReviews and takes variabes across using this.props
  *  There are four <TouchableOpacity> each unique, one lets the user view a photo attached to a review, one adds a photo to a review, one deletes a photo on a review and the other takes them to update their review
  *
  */
render(){
  const navigation = this.props.navigation;
  return(
    <View style ={styles.loadingScreen}>
    {
      this.state.isLoading ?
    <ActivityIndicator size="large" color="white"/>
    :
    <SafeAreaView style={styles.container}>
      <Text style = {styles.reviewtitle}> My Reviews </Text>
      <FlatList
        data={this.state.userReviews.sort((a, b) => {return b.review.review_id - a.review.review_id;})}
        renderItem={({item}) => (
          <View style ={styles.container}>
            <Text style = {styles.locationText}>Review ID: {item.review.review_id}{"\n"}{"\n"}{item.location.location_name}, found in {item.location.location_town}{"\n"}{"\n"}Overall Rating: {item.review.overall_rating}{"\n"}{"\n"}Review:{"\n"}{"\n"}{item.review.review_body}</Text>
            <TouchableOpacity
              style = {styles.button}
              onPress={() => this.props.navigation.navigate('UpdateReviews', {revid: item.review.review_id, locid: item.location.location_id, revBody: item.review.review_body, locName: item.location.location_name, locTown: item.location.location_town, overallRating: item.review.overall_rating})}
              >
              <Text style = {styles.text}>Update Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style = {styles.button}
              onPress={() => this.props.navigation.navigate('ReviewPhoto', {revid: item.review.review_id, locid: item.location.location_id, revBody: item.review.review_body, locName: item.location.location_name, locTown: item.location.location_town, overallRating: item.review.overall_rating})}
              >
              <Text style = {styles.text}>View Photo</Text>
            </TouchableOpacity>
            <View style = {styles.sideBysideButtons}>
            <TouchableOpacity
              style = {styles.buttonSidebySide}
              onPress={() => this.props.navigation.navigate('Photo', {revid: item.review.review_id, locid: item.location.location_id, revBody: item.review.review_body, locName: item.location.location_name, locTown: item.location.location_name, overallRating: item.review.overall_rating})}
              >
              <Text style = {styles.textLike}>Add Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style = {styles.buttonSidebySide}
              onPress={() => {
                this.setState({loc_id : item.location.location_id, rev_id: item.review.review_id})
                this.DeletePhoto()
              }}
              >
              <Text style = {styles.textLike}>Delete Photo</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state.userReviews}
        />
        </SafeAreaView>
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
  sideBysideButtons:{
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-around'
  },
  text: {
    color: 'white',
    fontSize: 25,
    textAlign: "center",
  },
  textLike: {
    color: 'white',
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10
  },
  buttonSidebySide: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    padding: 5,
    width:"50%",
    height:"75%",
    borderWidth: 1,
    borderColor: 'white'
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
  buttonLocation: {
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  button: {
    marginBottom:10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25,
    height: 50
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginBottom: 40,
    textAlign:"center"
  },
  reviewtitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    marginTop: 40,
    marginBottom: 60,
    textAlign:"center"
  }
});


export default UserReviews;
