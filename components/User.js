
/** The following imports are required for this screen to function properly */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ToastAndroid, SafeAreaView, TextInput, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** @description The class UserProfile displays the users account details and lets them update them if needed, they can also navigate to update their reviews, update their favourite shop or return to the home screen */
class UserProfile extends Component{

  /** This.state constructor initialises the variabes: first_name, last_name, firstName, lastName, userEmail, email and password */
  constructor(props) {
    super(props);
    this.state={
      firstName: "",
      lastName: "",
      userEmail: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      isLoading: true

    }
  }

/** componentDidMount calls the function this.getData() in the first render cycle */
  componentDidMount(){
    this.getData();
    setTimeout(() => {
      this.setState({isLoading: false})
    }, 3000);
  }

  /**
  *  getData is an async arrow function used to gather all the information on the user
  *
  *  await AsyncStorage.getItem - retrieves the token that is stored witihin async storage
  *  return fetch-  makes a request to the url provided, it is followed by a get request to the api which includes the token variable
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response.json()
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is set to the variable firstName, lastName and userEmail
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
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
        }else if(response.status === 404){
          throw 'Not Found';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
      this.setState({
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          userEmail: responseJson.email

      })
          console.log("collected data!");
          console.log(this.state.firstName);
          console.log(this.state.lastName);
          console.log(this.state.userEmail);
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    });
  }

  /**
  *  UpdateAccount is an async arrow function used to update a user review
  *
  *  await AsyncStorage.getItem - retrieves the token and userID that is stored witihin async storage
  * let update_toServer - sets all the variables relevant to updating account details
  *  return fetch -  makes a request to the url provided + the variable userID, it is followed by a patch request to the api which includes the token variable and content-type
  *  body - is set to update_toServer which is JSON.stringified
  *  .then((response) - if there is a response from the api and it is a 200 status code then it will return response
  *  otherwise the api will throw a server error which is handled with if/else if statements
  *  .then((responseJson) - then the request retrieved from the server is outputted to the console and a ToastAndroid is shown to the user, they are then navigated to the Coffee screen
  *  .catch((error) - catches any errors that are not related to the server and outputs them via a ToastAndroid
  *
  */
  UpdateAccount = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    let userID = await AsyncStorage.getItem('id');
    let update_toServer = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    }
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" +(userID), {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        "X-Authorization": token
      },
      body: JSON.stringify(update_toServer)
    })
    .then((response) => {
        if(response.status === 200){
          return response
        }else if(response.status === 400){
          throw 'Bad Request';
        }else if(response.status === 401){
          throw 'Unauthorised';
        }else if(response.status === 403){
          throw 'Forbidden';
        }else if(response.status === 404){
          throw 'Not Found';
        }else if(response.status === 500){
          throw 'Server Error';
        }else{
          throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
          ToastAndroid.show('Account Updated Successfully!', ToastAndroid.SHORT);
          console.log("Account Updated: ", responseJson);
          this.props.navigation.navigate("Coffee");
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  /**
  *  render displays everything out to the user side
  *
  *  <SafeAreaView> - is used and it contains their user details
  *  <Text> - is used to display the page title
  *  <TextInput> - used for the user to input their details and changes the state of: first_name, last_name, email and password
  *  <TouchableOpacity> - When pressed will take them to a different screen (UserReviews, FavouritePlace or Coffee) or update their account details
  */
render(){
  const navigation = this.props.navigation;
  return( 
      <View style ={styles.loadingScreen}>
      {
        this.state.isLoading ?
      <ActivityIndicator size="large" color="white"/>
      :
      <SafeAreaView style={styles.container}>
      <Text style = {styles.pagetitle}>My Profile</Text>
      <Text style = {styles.locationText}>First Name: {this.state.firstName}{"\n"}Last Name: {this.state.lastName}{"\n"}Email: {this.state.userEmail}</Text>

        <Text style = {styles.text}>Insert New Details:</Text>
        <TextInput
        placeholder="first name"
        onChangeText={(first_name) => this.setState({first_name})}
        value={this.state.first_name}
        style={styles.input}
        />
        <TextInput
        placeholder="last name"
        onChangeText={(last_name) => this.setState({last_name})}
        value={this.state.last_name}
        style={styles.input}
        />
        <TextInput
        placeholder="email address"
        onChangeText={(email) => this.setState({email})}
        value={this.state.email}
        style={styles.input}
        />
        <TextInput
        placeholder="password"
        onChangeText={(password) => this.setState({password})}
        value={this.state.password}
        style={styles.input}
        />
        <TouchableOpacity
          style = {styles.button}
          onPress={() => this.UpdateAccount()}
          >
        <Text style = {styles.text}>Update My Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('UserReviews')}
          >
        <Text style = {styles.text}>View My Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('FavouritePlace')}
          >
        <Text style = {styles.text}>Select My Favourite Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.button}
          onPress={() => navigation.navigate('Coffee')}
          >
        <Text style = {styles.text}>Return to home screen</Text>
        </TouchableOpacity>
      </SafeAreaView>
      }
      </View>

  );
}

}

/**
*  styles is the name of the StyleSheet used to give the components their properties
*/
const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6F4E37',
    paddingHorizontal: 10
  },
  loadingScreen:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#6F4E37',
  },
  text: {
    color: 'white',
    fontSize: 25
  },
  locationText: {
    color: 'black',
    fontSize: 15,
    padding: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    width: "100%",
    textAlign: 'center'
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
    height:40

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
    marginBottom: 10,
    textAlign:"center"
  }
});


export default UserProfile;
