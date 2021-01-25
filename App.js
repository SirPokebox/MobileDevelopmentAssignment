import 'react-native-gesture-handler';
import React from 'react';

import {NavigationContainer} from '@react-navigation-native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './Screens/Components/Login';
import SignUp from './Screens/Components/SignUp';

const Stack = createStackNavigator();

function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
    );
}
export default App;
