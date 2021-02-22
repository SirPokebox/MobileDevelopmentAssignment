import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserReviews from './UserReviews.js'
class UpdateReviews extends Component{

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

  componentDidMount(){
    const {revid} = this.props.route.params;
    const {locid} = this.props.route.params;
    this.setState({
      loc_id: locid,
      rev_id: revid
    });
  }
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

render(){

  const {revBody} = this.props.route.params;
  const {locName} = this.props.route.params;
  const {locTown} = this.props.route.params;
  const {overallRating} = this.props.route.params;

  return(
    <View  style ={styles.container}>
    <Text style = {styles.pagetitle}> Update My Review </Text>
    <Text style = {styles.text}> Current Review: </Text>
    <Text style = {styles.locationText}>Review ID: {this.state.rev_id}{"\n"}{"\n"}{(locName)}, found in {(locTown)}{"\n"}{"\n"}Overall Rating: {(overallRating)}{"\n"}{"\n"}Review:{"\n"}{"\n"}{(revBody)}</Text>
    <TextInput
    placeholder="Overall Rating/5"
    keyboardType = 'numeric'
    onChangeText={(overall_rating) => this.setState({overall_rating})}
    value={this.state.overall_rating}
    style={styles.input}
    />
    <TextInput
    placeholder="Price Rating/5"
    keyboardType = 'numeric'
    onChangeText={(price_rating) => this.setState({price_rating})}
    value={this.state.price_rating}
    style={styles.input}
    />
    <TextInput
    placeholder="Quality Rating/5"
    keyboardType = 'numeric'
    onChangeText={(quality_rating) => this.setState({quality_rating})}
    value={this.state.quality_rating}
    style={styles.input}
    />
    <TextInput
    placeholder="Clenliness Rating/5"
    keyboardType = 'numeric'
    onChangeText={(clenliness_rating) => this.setState({clenliness_rating})}
    value={this.state.clenliness_rating}
    style={styles.input}
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
    </View>
  )
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
