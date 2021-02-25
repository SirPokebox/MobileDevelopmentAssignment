
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class Photo sets up the camera and the user can take a photo and submit it to their review they have made on the previous screen */
class Photo extends Component {

/** This.state constructor initialises the variabes: loc_id and rev_id */
  constructor(props) {
    super(props);
    this.state={
      loc_id : "",
      rev_id: "",
    }
  }

/** componentDidMount sets the state of loc_id and rev_id to the const locid and revid which are stored in this.props.route.params which have been passed over from the previous screen */
    componentDidMount(){
      const {revid} = this.props.route.params;
      const {locid} = this.props.route.params;
      this.setState({
        loc_id: locid,
        rev_id: revid
      });
    }

    /**
    *  tkaePicture is an async arrow function used to upload a photo
    *
    *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
    *  return fetch-  makes a request to the url provided + the variable loc_id and the variable rev_id, it is followed by a post request to the api which includes the token variable and content-type
    *  body - is set to data which is the photo uri
    *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
    *  otherwise the api will throw a server error which is handled with if/else if statements
    *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user, they are then navigated to the UserReviews screen
    *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
    *
    */
  takePicture = async() => {
    if(this.camera){
      const options = {quality:0.5, base64:true}
      const data = await this.camera.takePictureAsync(options);
      let token = await AsyncStorage.getItem('@session_token');
      console.log(data.uri);

      return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/photo", {
        method: 'post',
        headers: {
          "Content-Type": "image/jpeg",
          'X-Authorization': token
        },
        body: data
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
            ToastAndroid.show('Photo Uploaded!', ToastAndroid.SHORT);
            console.log(responseJson);
            this.props.navigation.navigate("UserReviews");
      })
      .catch((error) => {
          console.log(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
      })
      
    }
  }
  
  /**
  *  render displays everything out to the user side
  *
  *  <View> - is given flex: 1 and a 100% width
  *  <RNCamera> - renders the RNCamera
  *  <Button> - is used to call the this.takePicture function
  */
  render () {
    return (
      <View style={{flex: 1, width: '100%'}}>

        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.preview}
          captureAudio={false}
          />
        <Button title='Take Picture' onPress={() => { this.takePicture() }} />
      </View>

    )
  }
}

/**
*  styles is the name of the StyleSheet used to give the components their properties
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  capture: {
    flex: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  button: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width: '100%',
    borderRadius: 25
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6F4E37',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    margin: 5,
    marginTop: 8,
    width: '100%',
    borderRadius: 25,
    height: 50

  },
  text: {
    color: 'white',
    fontSize: 25
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center'
  }
})

export default Photo;
