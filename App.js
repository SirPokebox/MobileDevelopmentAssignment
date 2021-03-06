
/** The following imports are required for this screen to function properly */
import 'react-native-gesture-handler'

import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './components/Login.js'
import Register from './components/SignUp.js'
import Coffee from './components/Review.js'
import UserLocation from './components/GeoLocation.js'
import MakeReview from './components/CreateReview.js'
import UserProfile from './components/User.js'
import UserReviews from './components/UserReviews.js'
import FavouriteCoffee from './components/FavouriteShop.js'
import UpdateReviews from './components/UpdateReview.js'
import ViewAllReviews from './components/AllReviews.js'
import FavouritePlace from './components/SelectFavourite.js'
import Photo from './components/Camera.js'
import ReviewPhoto from './components/ViewPhoto.js'
import SelectCoffee from './components/SelectLocation.js'
import CoffeeShop from './components/LocationReview.js'

/** Creates the stack navigator */
const Stack = createStackNavigator()

/** @description The class App creates the stack navigator */
class App extends Component {
  render () {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name='Home' component={Home} />
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen options={{ headerShown: false }} name='Coffee' component={Coffee} />
          <Stack.Screen name='Map View' component={UserLocation} />
          <Stack.Screen name='MakeReview' component={MakeReview} />
          <Stack.Screen options={{ headerShown: false }} name='UserProfile' component={UserProfile} />
          <Stack.Screen name='UserReviews' component={UserReviews} />
          <Stack.Screen options={{ headerShown: false }} name='FavouriteCoffee' component={FavouriteCoffee} />
          <Stack.Screen options={{ headerShown: false }} name='ViewAllReviews' component={ViewAllReviews} />
          <Stack.Screen name='UpdateReviews' component={UpdateReviews} />
          <Stack.Screen options={{ headerShown: false }} name='FavouritePlace' component={FavouritePlace} />
          <Stack.Screen name='Photo' component={Photo} />
          <Stack.Screen name='ReviewPhoto' component={ReviewPhoto} />
          <Stack.Screen name='SelectCoffee' component={SelectCoffee} />
          <Stack.Screen name='CoffeeShop' component={CoffeeShop} />

        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
export default App
