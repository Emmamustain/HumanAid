import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'
import { BackHeading } from '../components/BackHeading';

const Reg = ({title="Registration"}) => {
   return (
      <View style = {styles.container}>
          
          <BackHeading mt={20}/>

            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.text}>
              please enter the right information to confirm your request
            </Text>
      
      </View>
   )
}
export default Reg;

const styles = StyleSheet.create ({
  container: {
    // alignItems: 'center',
    marginTop: 30,
    padding: 20
    
 },
 title: {
  fontSize: 30,
  textAlign: 'center',
  fontWeight: 'bold',
  color: "black",
},
text: {
  marginTop:20,
  fontSize: 15,
  textAlign: 'center',
  fontWeight: 'normal',
  color: "gray",
},

  
})