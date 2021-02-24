import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, Image } from 'react-native'
import { RNCamera } from 'reaact-native-camera'

class Camera extends Component {

  takePicture = async() => {
    if(this.camera){
      const options = {quality:0.5, base64:true}
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri);

      
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

export default Camera
