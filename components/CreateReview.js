import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating, AirbnbRating } from 'react-native-ratings';

class MakeReview extends Component{
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
      ButtonState: false
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

  DisableButtons = () => {
    this.setState({
      ButtonState: true
    })
  }
  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
        style = {styles.buttonLocation}
        onPress={() => {
          this.setState({loc_id : item.location_id})
          this.DisableButtons()
        }}
        disabled = {this.state.ButtonState}
        >
        <Text style = {styles.locationText}>{item.location_name} found in {item.location_town} </Text>
        </TouchableOpacity>
      </View>
    )
  }
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
  render(){
    const navigation = this.props.navigation;
    return(
      <View style ={styles.container}>
        <Text style = {styles.pagetitle}>Create Review</Text>
        <FlatList
          data={this.state.locationData.sort((a, b) => {return a.location_id - b.location_id;})}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.locationData}
          />
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
          this.submitReview()
          }}
          >
          <Text style = {styles.text}>Submit Review</Text>
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
