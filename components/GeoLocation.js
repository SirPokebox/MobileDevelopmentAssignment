
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity, PermissionsAndroid, Button, ToastAndroid, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';

/** The async function requestLocationPermission requests the users permission to access their location */
async function requestLocationPermission() {
   try{
     const granted = await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
       {
         title: 'Location Permission',
         message:
         'This application requires access to your location',
         buttonNeutral: 'Remind Me Later',
         buttonNegative: 'Deny',
         buttonPositive: 'Allow'
       },
     );
     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       console.log('You have enabled location');
       return true;
     }else {
       console.log('Permissions denied');
       return false;
     }
   }catch (err) {
     console.warn(err);
   }
  }

/** @description The class UserLocation gets the users location and creates a MapView that shows where the user is on the map, it also plots markers of the coffee shops stored in the api */
class UserLocation extends Component{

/** This.state constructor initialises the variabes/arrays: locationPermission, latlon and locationData */
  constructor(props){
    super(props);
    this.state={
      locationPermission: false,
      latlon:{
        latitude: 0,
        longitude: 0
      },
      locationData: [],
      isLoading: true
    };
  }

/** componentDidMount calls the function this.getData() and this.findCoordinates() in the first render cycle */
  componentDidMount() {
    this.getData();
    this.findCoordinates();
    setTimeout(() => {
      this.setState({isLoading: false})
    }, 3000);
    };

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
          locationData : responseJson,
      })
          console.log("collected data!");
          console.log(this.state.locationData)
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

    /** findCoordinates checks if the user has enabled their location/given permission */
  findCoordinates = () => {
    if(!this.state.locationPermission){
      console.log('requesting permission');
      this.state.locationPermission = requestLocationPermission();
    }

    /** Geolocation.getCurrentPosition gets the users current location in coordinates and sets the latitude and longitude variables using setState
    *   if there is an error an alert box will be outputted to the user displaynig the error
    */
    Geolocation.getCurrentPosition(
      (position) => {
        const location = JSON.stringify(position);
        const longitude = JSON.stringify(position.coords.longitude);
        const latitude = JSON.stringify(position.coords.latitude);
        this.setState({latlon :{
          latitude : position.coords.latitude,
          longitude : position.coords.longitude
        }});
        console.log(location);
        console.log(longitude);
        console.log(latitude);
      },
      (error) => {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  }

  /**
  *  render displays everything out to the user side
  *
  *  <View> - is used and it contains the MapView
  *  <MapView> - renders the map using GoogleMaps api and is provided with latitude and longitude for the region 
  *  it also renders markers, one for the user location with a title and description and the other for coffee shops which has its name and town in the title/description
  */
  render(){

    const navigation = this.props.navigation;
    console.log(this.state.locationData)
    return(
      <View style ={styles.loadingScreen}>
      {
        this.state.isLoading ?
      <ActivityIndicator size="large" color="white"/>
      :
      <View style ={{flex : 1}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style = {{flex : 1}}
        region ={{
          latitude: this.state.latlon.latitude,
          longitude: this.state.latlon.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
      {this.state.locationData.map((marker, index) => (
        <Marker
          key={marker.location_id}
          coordinate={{"latitude" : parseFloat(marker.latitude), "longitude" : parseFloat(marker.longitude)}}
          title={marker.location_name}
          description={marker.location_town}
        />
      ))}
        <Marker
          coordinate={this.state.latlon}
          title = "Current Location"
          description = "User's Location"
        />
      </MapView>
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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'flex-end'
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
    map : {
      ...StyleSheet.abosoluteFillObject,
    }
  });
export default UserLocation;
