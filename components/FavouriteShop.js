import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FavouriteCoffee extends Component{
  constructor(props) {
    super(props);
    this.state={
      userInfo: [],
      userReviews: [],
      favouriteCoffee: [],
    }
  }

  componentDidMount(){
    this.getData();
  }

  getData = async () => {
    console.log("fetching user data now");
    let token = await AsyncStorage.getItem('@session_token');
    let userID = await AsyncStorage.getItem('id');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + (userID), {
      method: 'get',
      headers: {
        "X-Authorization": token
      }
    })
    .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if(response.status === 401){
          ToastAndroid.show("No user logged in!", ToastAndroid.SHORT);
          this.props.navigation.navigate('Home');
          throw 'Unauthorised';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
          favouriteCoffee: responseJson.favourite_locations,
      })
          console.log("collected data!");
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

  renderItem = ({ item, index }) => {
    return (
      <View>
        <Text style = {styles.locationText}>{"\n"}{"\n"}{item.location_name}, found in {item.location_town}{"\n"}{"\n"}
        Average Rating: {item.avg_overall_rating}{"\n"}{"\n"}
        Reviews:{"\n"}{"\n"}{item.location_reviews.review_id}{"\n"}
        {item.location_reviews.review_body}{"\n"}
        </Text>
      </View>
    )
  }
render(){
  const navigation = this.props.navigation;
  console.log(this.state.favouriteCoffee)
  return(
    <SafeAreaView style={styles.container}>
      <Text style = {styles.reviewtitle}> My FavouriteShop </Text>
      <FlatList
        data={this.state.favouriteCoffee}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state.favouriteCoffee}
        />
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('Coffee')}
          >
            <Text style = {styles.text}>Return Home</Text>
        </TouchableOpacity>
        </SafeAreaView>

  );
}

}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6F4E37',
    paddingHorizontal: 10
  },
  text: {
    color: 'white',
    fontSize: 25,
    margin: 5,
    marginBottom: 20
  },
  locationText: {
    color: 'black',
    fontSize: 15,
    padding: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    margin: 5
  },
  buttonLocation: {
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  button: {
    marginTop: 10,
    marginBottom:10,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginBottom: 40,
    textAlign:"center"
  },
  reviewtitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    marginTop: 40,
    marginBottom: 60,
    textAlign:"center"
  }
});


export default FavouriteCoffee;
