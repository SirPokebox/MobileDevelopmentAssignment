
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class FavouriteCoffee uses a FlatList to display the reviews on their favourite coffee shops */
class CoffeeShop extends Component{

/** This.state constructor initialises the variabes/arrays: locationData, loc_id, loc_name and isLoading */
  constructor(props) {
    super(props);
    this.state={
      locationData: [],
      loc_id: "",
      loc_name: "",
      isLoading: true
    }
  }

/** componentDidMount calls the function this.getData() in the first render cycle and sets the variables loc_id and loc_name that have been sent over */
  componentDidMount(){
    this.getData();
    setTimeout(() => {
      this.setState({isLoading: false})
    }, 3000);
    const {locid} = this.props.route.params;
    const {locname} = this.props.route.params;
    this.setState({
      loc_id: locid,
      loc_name: locname
    });
  }

  /**
  *  getData is an async arrow function used to gather all the information on the User
  *
  *  await AsyncStorage.getItem - retrieves the token and user id that is stored witihin async storage
  *  return fetch-  makes a request to the url provided + the variable loc_id, it is followed by a get request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response.json()
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is set to the variable locationData
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  getData = async () => {
    console.log("fetching location data now");
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + (this.state.loc_id), {
      method: 'get',
      headers: {
        "X-Authorization": token
      }
    })
    .then((response) => {
        if(response.status === 200){
          return response.json()
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
  *  render displays everything out to the user side
  *
  *  <SafeAreaView> - is used and it contains the FlatList and pagetitle
  *  <FlatList> - displays the variable locationData which is passed to data and is sorted from the most recent review the oldest
  *  <Text> - is used to display the FlatList data
  *  <TouchableOpacity> - Navigates the user back to the home screen Coffee
  *
  */
render(){
  const navigation = this.props.navigation;
  console.log(this.state.loc_id)
  return(
    <View style ={styles.loadingScreen}>
    {
      this.state.isLoading ?
    <ActivityIndicator size="large" color="white"/>
    :
    <SafeAreaView style={styles.container}>
      <Text style = {styles.reviewtitle}> {this.state.loc_name} </Text>
      <FlatList
        data={this.state.locationData.location_reviews.sort((a, b) => {return b.review_id - a.review_id;})}
        renderItem={({item}) => (
          <Text style = {styles.locationText}>Review ID: {item.review_id}{"\n"}{"\n"}Overall Rating: {item.overall_rating}{"\n"}Price Rating: {item.price_rating}{"\n"}Quality Rating: {item.quality_rating}{"\n"}Cleanliness Rating: {item.clenliness_rating}{"\n"}{"\n"}Review:{"\n"}{"\n"}{item.review_body}{"\n"}{"\n"}Likes: {item.likes}</Text>
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


export default CoffeeShop;
