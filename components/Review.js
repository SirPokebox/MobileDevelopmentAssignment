import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Coffee extends Component{
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () =>{
    this.checkedLoggedIn();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  checkedLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Home');
    }
  };

  render(){
    const navigation = this.props.navigation;

    return(
      <View style ={styles.container}>
        <Text style = {styles.text}>Review Screen</Text>
        <Button
          title="Go To Home Page"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          title="Open up maps"
          onPress={() => navigation.navigate('Map View')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'forestgreen'
  },
  text: {
    color: 'white',
    fontSize: 25
  }
});

export default Coffee;
