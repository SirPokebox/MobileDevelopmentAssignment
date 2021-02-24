import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, Image } from 'react-native'
import { RNCamera } from 'react-native-camera'
import AsyncStorage from '@react-native-async-storage/async-storage';

class Photo extends Component {

  constructor(props) {
    super(props);
    this.state={
      loc_id : "",
      rev_id: "",
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
          }}else if(response.status === 401){
            throw 'Unauthorised';
          }}else if(response.status === 404){
            throw 'Not Found';
          }}else if(response.status === 500){
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

export default Photo
