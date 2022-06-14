import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import {vh, vw} from 'react-native-expo-viewport-units';
import React, {useState, useEffect} from "react";

import lander from '../images/lander.png'

import { Button } from '../components/Button';

//we add this to allow us to work with navigation
import { useNavigation } from '@react-navigation/native';

export default function Welcome({Glogin, user}) {

  //we add this to get access to the navigation stack
  const navigation = useNavigation()

  
  
  const [signedIn, SetSignedIn] = useState(user ? true : false);
  
  useEffect(()=>{
    SetSignedIn(user ? true : false);
  },[user])
  
  //let's us connect with a google account then sends us to the mainscreen page
  const handleGoogleAuth = async() => {
    try{
      let isConnected = await Glogin();
      console.log("isConnected: " + isConnected);
    }
    catch{
      SetSignedIn(false);
      console.log("Error");
    }
  };


  function handleWelcomeBtn() {
    navigation.navigate("MainScreen");
  }


  return (
    <View style={styles.container}>
      <Image source={lander} style={{height: 200}}/>
      <View style={{width: vw(100), display:'flex', alignItems: 'center'}}>
        <Text style={styles.title}>Fastest Way to {"\n"} Get Your Medical Needs</Text>
        <Text style={styles.description}>Search and find Medical assets in the shortest time possible through one of our many associates</Text>
        {!signedIn ? 
          <Button icon="logo-google" text='Connect With Google' style={{borderRadius:5,height:50 }} press={()=>handleGoogleAuth()}/>
          :
          <Button text='Explore our platform' style={{borderRadius:5,height:50 }} press={()=>handleWelcomeBtn()}/>
        }
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: vw(100)
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  description:{
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    width: vw(90)

  }
});
