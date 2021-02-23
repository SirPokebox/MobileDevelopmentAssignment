import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, ToastAndroid, ScrollView, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

class FavouritePlace extends Component{
  constructor(props) {
    super(props);
    this.state={
      overall_rating: "",
      price_rating: "",
      quality_rating: "",
      clenliness_rating: "",
      review_body: "",
      locationData: [],
      loc_id: "",
      ButtonState: false
    }
  }

  componentDidMount(){
    this.getData();
  }

  getData = async () => {
    console.log("fetching location data now");
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/find", {
      method: 'get',
      headers: {
        "X-Authorization": token
      }
    })
    .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if(response.status === 400){
          throw 'Bad Request';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
          locationData: responseJson,
      })
          console.log("collected data!");
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

SelectFavouriteShop = async () => {
  let token = await AsyncStorage.getItem('@session_token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/favourite", {
    method: 'post',
    headers: {
      'X-Authorization': token
    },
  })
  .then((response) => {
      if(response.status === 200){
        return response
      }else if(response.status === 400){
        throw 'Bad Request';
      }else{
        throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
        ToastAndroid.show('You have favourited a shop!', ToastAndroid.SHORT);
        console.log(responseJson);
        this.props.navigation.navigate("UserProfile");
  })
  .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

UnfavouriteShop = async () => {
  let token = await AsyncStorage.getItem('@session_token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/favourite", {
    method: 'delete',
    headers: {
      'X-Authorization': token
    },
  })
  .then((response) => {
      if(response.status === 200){
        return response
      }else if(response.status === 400){
        throw 'Bad Request';
      }else{
        throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
        ToastAndroid.show('You have unfavourited a shop!', ToastAndroid.SHORT);
        console.log(responseJson);
        this.props.navigation.navigate("UserProfile");
  })
  .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}
  DisableButtons = () => {
    this.setState({
      ButtonState: true,
    })
  }
  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
        style = {styles.buttonLocation}
        onPress={() => {
          this.setState({loc_id : item.location_id})
          this.DisableButtons()
          ToastAndroid.show(item.location_name+" Selected!", ToastAndroid.SHORT);
        }}
        disabled = {this.state.ButtonState}
        >
        <Text style = {styles.locationText}>{item.location_name} found in {item.location_town} </Text>
        </TouchableOpacity>
      </View>
    )
  }
  render(){
    console.log(this.state.loc_id);
    const navigation = this.props.navigation;
    return(
      <View style ={styles.container}>
        <Text style = {styles.pagetitle}>Select Your Favourite Shop</Text>
        <FlatList
          data={this.state.locationData.sort((a, b) => {return a.location_id - b.location_id;})}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.locationData}
          />
          <View style = {styles.sideBysideButtons}>
          <TouchableOpacity
            style = {styles.favButton}
            onPress={() => this.SelectFavouriteShop()}
            >
              <Text style = {styles.textFav}>Favourite Selected</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style = {styles.favButton}
            onPress={() => this.UnfavouriteShop()}
            >
              <Text style = {styles.textFav}>Unfavourite Selected</Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity
            style = {styles.button}
            onPress={() => navigation.navigate('UserProfile')}
            >
              <Text style = {styles.text}>Return to my details</Text>
          </TouchableOpacity>
          </View>
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
    fontSize: 25
  },
  sideBysideButtons:{
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-around'
  },
  locationText: {
    color: 'white',
    fontSize: 25,
    padding: 1
  },
  button: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    width:"100%",
    borderRadius:25
  },
  textFav: {
    color: 'white',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  favButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    padding: 5,
    width:"50%",
    height:"100%",
    borderColor: 'white',
    borderWidth: 1
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
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6F4E37',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    margin: 1,
    marginTop: 5,
    width:"100%",
    borderRadius:25,
    height:35
  },
  inputReview: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6F4E37',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    margin: 1,
    marginTop: 5,
    width:"50%",
    borderRadius:25,
    height:50
  },
  pagetitle: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginTop: 20,
    marginBottom: 35,
    textAlign:"center"
  }
});


export default FavouritePlace;
