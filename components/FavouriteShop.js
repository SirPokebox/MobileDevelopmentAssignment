
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class FavouriteCoffee uses a FlatList to display the reviews on their favourite coffee shops */
class FavouriteCoffee extends Component{

/** This.state constructor initialises the variabes/arrays: favouriteCoffee, favouriteReviews, loc_id and rev_id */
  constructor(props) {
    super(props);
    this.state={
      favouriteCoffee: [],
      favouriteReviews: [],
      loc_id: "",
      rev_id: "",
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
  *  .then((responseJson) - then the request retrieved from the server is set to the variables favouriteCoffee and favouriteReviews
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
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
          favouriteCoffee: responseJson.favourite_locations,
          favouriteReviews: responseJson.favourite_locations[0]
      })
          console.log("collected data!");
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

  /**
  *  LikeUserReview is an async arrow function used to like a user review
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch-  makes a request to the url provided + the variable loc_id and the variabe rev_id, it is followed by a post request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  LikeUserReview = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    console.log(this.state.rev_id);
    console.log(this.state.loc_id);
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/like", {
      method: 'post',
      headers: {
        "X-Authorization": token
      },
    })
    .then((response) => {
        if(response.status === 200){
          return response
        }else if(response.status === 400){
          throw 'Bad Request';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
          ToastAndroid.show('Review Liked!', ToastAndroid.SHORT);
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  DislikeUserReview is an async arrow function used to unlike a user review
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch-  makes a request to the url provided + the variable loc_id and the variabe rev_id, it is followed by a delete request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  DislikeUserReview = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    console.log(this.state.rev_id);
    console.log(this.state.loc_id);
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/like", {
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
          ToastAndroid.show('Review Disliked!', ToastAndroid.SHORT);
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  render displays everything out to the user side
  *
  *  <SafeAreaView> - is used and it contains two FlatLists (nested FlatList)
  *  <FlatList> - displays the variable favouriteCoffee and favouriteReviews which is passed to data and is sorted from the most liked to least liked
  *  <Text> - is used to display the FlatList data
  *  <TouchableOpacity> - there are three, one likes the review and calls the LikeUserReview function and sets the variables rev_id and loc_id, the same goes for unliking a review except it calls the DislikeUserReview function
  *  the third one navigates the user back to the home screen Coffee
  *
  */
render(){
  const navigation = this.props.navigation;
  console.log(this.state.favouriteCoffee)
  console.log(this.state.favouriteReviews)
  return(
    <View style ={styles.loadingScreen}>
    {
      this.state.isLoading ?
    <ActivityIndicator size="large" color="white"/>
    :
    <SafeAreaView style={styles.container}>
      <Text style = {styles.reviewtitle}> My Favourite Shop </Text>
      <FlatList
        data={this.state.favouriteCoffee}
        renderItem={({item}) => (
          <View>
          <Text style = {styles.favouriteText}>{"\n"}{item.location_name}, found in {item.location_town}{"\n"}</Text>
          <FlatList
          data={this.state.favouriteReviews.location_reviews.sort((a, b) => {return b.likes - a.likes;})}
          renderItem={({item}) =>(
            <View>
              <Text style = {styles.locationText}>Review ID: {item.review_id}{"\n"}{"\n"}Review:{"\n"}{"\n"}{item.review_body}{"\n"}{"\n"}Likes: {item.likes}</Text>
            <View style = {styles.sideBysideButtons}>
            <TouchableOpacity
              style = {styles.buttonLike}
              onPress={() => this.LikeUserReview(this.setState({rev_id: item.review_id, loc_id: item.review_location_id}))}
              >
                <Text style = {styles.textLike}>Like Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style = {styles.buttonLike}
              onPress={() =>  this.DislikeUserReview(this.setState({rev_id: item.review_id, loc_id: item.review_location_id}))}
              >
                <Text style = {styles.textLike}>Dislike Review</Text>
            </TouchableOpacity>
            </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.favouriteReviews.location_reviews}
          />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state.favouriteCoffee}
        />
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('Coffee')}
          >
            <Text style = {styles.text}>Return Home</Text>
        </TouchableOpacity>
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
    margin: 5,
    marginBottom: 20,
    textAlign: 'center'
  },
  textLike: {
    color: 'white',
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10
  },
  locationText: {
    color: 'black',
    fontSize: 15,
    padding: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    margin: 5
  },
  favouriteText: {
    color: 'black',
    fontSize: 15,
    padding: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    fontWeight: 'bold',
    textAlign: 'center'
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
    marginTop: 10,
    marginBottom:10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  buttonLike: {
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


export default FavouriteCoffee;
