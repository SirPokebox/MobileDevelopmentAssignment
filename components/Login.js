import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

class Home extends Component{
  render(){
    const navigation = this.props.navigation;

    return(
      <View style ={styles.container}>
        <Text style = {styles.text}>Login Screen</Text>
        <Button
          title="Go To Register Page"
          onPress={() => navigation.navigate('Register')}
        />
        <Button
          title="Go To Review Page"
          onPress={() => navigation.navigate('Coffee')}
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

export default Home;
