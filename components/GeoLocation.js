import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity, PermissionsAndroid, Button} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';


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
class UserLocation extends Component{
  componentDidMount() {
    this.findCoordinates();
    this.getData();
    };

  constructor(props){
    super(props);
    this.state={
      location : null,
      locationPermission: false,
      latlon:{
        latitude: 0,
        longitude: 0
      },
      locationData: [],
    };
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

  findCoordinates = () => {
    if(!this.state.locationPermission){
      console.log('requesting permission');
      this.state.locationPermission = requestLocationPermission();
    }

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
  render(){
    const navigation = this.props.navigation;

    return(
      <View style ={{flex : 1}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style = {{flex : 1}}
        region ={{
          latitude: this.state.latlon.latitude,
          longitude: this.state.latlon.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        <Marker
          coordinate={this.state.latlon}
          title = "Current Location"
          description = "User's Location"
        />
      </MapView>
      </View>
    );
  }

}

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
    text: {
      color: 'white',
      fontSize: 25
    },
    map : {
      ...StyleSheet.abosoluteFillObject,
    }
  });
export default UserLocation;
