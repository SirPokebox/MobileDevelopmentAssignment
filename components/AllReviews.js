import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ViewAllReviews extends Component{
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
      locationRev: [],
      rev_id: "",
    }
  }

  componentDidMount(){
    this.getData();
  }

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
        }else if(response.status === 401){
          throw 'Unauthorised';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
      this.setState({
          locationData: responseJson,
          locationRev: responseJson[0]
      })
          console.log("collected data!");
          console.log(this.state.locationRev);
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
    return(
      <View style ={styles.container}>
        <Text style = {styles.pagetitle}>All Reviews</Text>
        <FlatList
          data={this.state.locationData}
          renderItem={({item}) => (
            <View>
            <Text style = {styles.CoffeeShopText}>{"\n"}{item.location_name}, found in {item.location_town}{"\n"}</Text>
            <FlatList
            data={this.state.locationRev.location_reviews.sort((a, b) => {return a.review_id - b.review_id;})}
            renderItem={({item}) =>(
              <View>
                <Text style = {styles.locationText}>Overall Rating: {item.review_overallrating}{"\n"}{"\n"}Review:{"\n"}{"\n"}{item.review_body}{"\n"}{"\n"}Likes: {item.likes}</Text>
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
            extraData={this.state.locationRev.location_reviews}
            />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.locationData}
          />
          <TouchableOpacity
            style = {styles.button}
            onPress={() => navigation.navigate('Coffee')}
            >
              <Text style = {styles.text}>Return Home</Text>
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
  sideBysideButtons:{
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-around'
  },
  textLike: {
    color: 'white',
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10
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
  text: {
    color: 'white',
    fontSize: 25
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
  CoffeeShopText: {
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
  button: {
    marginTop: 20,
    marginBottom: 20,
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


export default ViewAllReviews;
