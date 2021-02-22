import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid, FlatList, ScrollView, SafeAreaView, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserProfile extends Component{
  constructor(props) {
    super(props);
    this.state={
      firstName: "",
      lastName: "",
      userEmail: "",
      first_name: "",
      last_name: "",
      email: "",
      password: ""

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

render(){
  const navigation = this.props.navigation;
  return(
    <SafeAreaView style={styles.container}>
      <Text style = {styles.pagetitle}>My Profile</Text>
      <Text style = {styles.locationText}>First Name: {this.state.firstName}{"\n"}Last Name: {this.state.lastName}{"\n"}Email: {this.state.userEmail}</Text>

        <Text style = {styles.text}>Update My Details</Text>
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
          onPress={() => navigation.navigate('Coffee')}
          >
        <Text style = {styles.text}>Return to home screen</Text>
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
    width: "100%"
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
    height:50

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
