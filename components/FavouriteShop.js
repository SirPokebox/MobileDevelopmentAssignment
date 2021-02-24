import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FavouriteCoffee extends Component{
  constructor(props) {
    super(props);
    this.state={
      userInfo: [],
      userReviews: [],
      favouriteCoffee: [],
      favouriteReviews: [],
      loc_id: "",
      rev_id: "",
    }
  }

  componentDidMount(){
    this.getData();
  }

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

render(){
  const navigation = this.props.navigation;
  console.log(this.state.favouriteCoffee)
  console.log(this.state.favouriteReviews)
  return(
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
