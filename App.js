import 'react-native-gesture-handler';


import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './components/Login.js'
import Register from './components/SignUp.js'
import Coffee from './components/Review.js'

const Stack = createStackNavigator();

class App extends Component{
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component ={Home}/>
          <Stack.Screen name="Register" component ={Register}/>
          <Stack.Screen name="Coffee" component ={Coffee}/>
        </Stack.Navigator>
      </NavigationContainer>
      );
  }
}
export default App;
