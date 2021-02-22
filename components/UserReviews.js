import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserReviews extends Component{
  constructor(props) {
    super(props);
    this.state={
      userInfo: [],
      userReviews: [],
      favouriteCoffee: []
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
          userReviews: responseJson.reviews,
      })
          console.log("collected data!");
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

  renderItem = ({ item, index }) => {
    const navigation = this.props.navigation;
    return (
      <View>
        <Text style = {styles.locationText}>Review ID: {item.review.review_id}{"\n"}{"\n"}{item.location.location_name}, found in {item.location.location_town}{"\n"}{"\n"}Overall Rating: {item.review.overall_rating}{"\n"}{"\n"}Review:{"\n"}{"\n"}{item.review.review_body}</Text>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => this.props.navigation.navigate('UpdateReviews', {revid: item.review.review_id, locid: item.location.location_id, revBody: item.review.review_body, locName: item.location.location_name, locTown: item.location.location_name, overallRating: item.review.overall_rating})}
          >
            <Text style = {styles.text}>Update Review</Text>
        </TouchableOpacity>
      </View>
    )
  }
render(){
  const navigation = this.props.navigation;
  return(
    <SafeAreaView style={styles.container}>
      <Text style = {styles.reviewtitle}> My Reviews </Text>
      <FlatList
        data={this.state.userReviews.sort((a, b) => {return b.review.review_id - a.review.review_id;})}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state.userReviews}
        />
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('UserProfile')}
          >
            <Text style = {styles.text}>Return to my details</Text>
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
  text: {
    color: 'white',
    fontSize: 25,
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
    marginTop: 10,
    marginBottom:10,
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
