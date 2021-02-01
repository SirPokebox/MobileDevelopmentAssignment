import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
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
    if (JSON.parse(value) == null) {
        console.log("test");
        this.props.navigation.navigate('Coffee');
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
