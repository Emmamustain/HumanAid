import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from '../components/Button';
import { BackHeading } from "../components/BackHeading"





//we add this to allow us to work with navigation
import { useNavigation } from '@react-navigation/native';

export default function Settings() {

  //we add this to get access to the navigation stack
  const navigation = useNavigation()

  //this is a function that lets us go back
  function GoBack(){
    navigation.goBack()
  } 

  return (
   
    <View style={styles.container}>
      <BackHeading text="Settings"/>
      <Button text='Change name of the profile' bold={false} white={false} style={{height: 50, color:'black', marginTop: 40, width:500,  borderWidth: 1,  backgroundColor:"white"}} press={()=>console.log(value)}/>
      <Button text='Change the adress' bold={false} white={false}  style={{height: 50, marginTop: -10, width:500,  borderWidth: 1, backgroundColor:"white"}} press={()=>console.log(value)}/>
      <Button text='Change phone number or add one' bold={false}  white={false} style={{height: 50, marginTop: -10, width:500, borderWidth: 1,backgroundColor:"white"}} press={()=>console.log(value)}/>
      <Button text='Log out' bold={false} white={false} style={{height: 50, marginTop: -10, width:500,  backgroundColor:"white",  borderWidth: 1}} press={()=>console.log(value)}/>
    </View>
  );
}


const styles= StyleSheet.create({
    container: {
      display:"flex",
      alignItems: 'center',
      // width: "50%",
      justifyContent: "center"
      // flexGrow: 0
    },
   
})