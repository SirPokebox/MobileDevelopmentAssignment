
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class SelectCoffee lets a user select what coffee shop they would like to view reviews for */
class SelectCoffee extends Component{

/** This.state constructor initialises the variabes/arrays: overall_rating, price_rating, quality_rating, clenliness_rating, review_body, locationData, loc_id, loc_name and ButtonState */
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
      loc_name: "",
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

  /**
  *  getData is an async arrow function used to gather all the information on the coffe shops
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch-  makes a request to the url provided, it is followed by a get request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response.json()
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is set to the variable locationData
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
        }else if(response.status === 401){
          throw 'Unauthorised';
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
  *  renderItem is an arrow function used to render a FlatList
  *
  *  the variables item and index are passed
  *  onpress() - sets the variables loc_id and loc_name
  *  within the <View> is a <TouchableOpacity> which displays the location_name and location_town of a coffee shop, when pressed it sets the state of loc_id to item.location_id and a ToastAndroid is displayed to the user
  * it also calls the this.DisableButtons() which sets the ButtonState variable to true, meaning the user cannot select multiple shops at once
  * 
  */
  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
        style = {styles.buttonLocation}
        onPress={() => {
          this.setState({loc_id : item.location_id, loc_name: item.location_name})
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
  DisableButtons = () => {
    this.setState({
      ButtonState: true,
    })
  }

  /**
  *  render displays everything out to the user side
  *
  *  <View> - is used and it contains the FlatList
  *  <FlatList> - displays the variable locationData which is passed to data and is sorted from smallest locaction_id to highest
  *  renderItem - calls the renderItem function to display the FlatList
  *  <TouchableOpacity> - is outside of the FlatList and navigates the user to CoffeeShop
  *
  */
  render(){
    console.log(this.state.loc_id);
    const navigation = this.props.navigation;
    return(
      <View style ={styles.loadingScreen}>
      {
        this.state.isLoading ?
      <ActivityIndicator size="large" color="white"/>
      :
      <View style ={styles.container}>
        <Text style = {styles.pagetitle}>View a Shop</Text>
        <FlatList
          data={this.state.locationData.sort((a, b) => {return a.location_id - b.location_id;})}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.locationData}
          />
          <View style = {styles.sideBysideButtons}>
          <ScrollView>
          <TouchableOpacity
            style = {styles.button}
            onPress={() => this.props.navigation.navigate('CoffeeShop', {locid: this.state.loc_id, locname: this.state.loc_name})}
            >
              <Text style = {styles.text}>View Selected</Text>
          </TouchableOpacity>
          </ScrollView>
          </View>
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
  sideBysideButtons:{
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-around'
  },
  locationText: {
    color: 'white',
    fontSize: 25,
    padding: 1
  },
  button: {
    marginTop: 40,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  textFav: {
    color: 'white',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  favButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    padding: 5,
    width:"50%",
    height:"100%",
    borderColor: 'white',
    borderWidth: 1
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
    marginTop: 20,
    marginBottom: 35,
    textAlign:"center"
  }
});


export default SelectCoffee;
