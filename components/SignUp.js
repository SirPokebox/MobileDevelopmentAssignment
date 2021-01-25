import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

class Register extends Component{
  render(){
    const navigation = this.props.navigation;

    return(
      <View style={styles.container}>
        <Text style={styles.text}>SignUpScreen</Text>
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

export default Register;
