import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from './Button';
import gay from '../images/gay.png'
import { useNavigation } from '@react-navigation/native';
//Don't forget to change the name of the function
export default function Hero({isAssociation}) {

    const navigation = useNavigation();

    const handlePress = ()=>{
        if(isAssociation){
            navigation.navigate("OfferAsset")
        }
        else{
            alert("Only Associations can contribute! Register as one through the menu!")
        }
    }

  return (
    <View style={styles.container}>
        <View style={{width: "55%", }}>
            <Text style={styles.text}>Have Something to contribute?</Text>
            <Button text="Offer Asset" style={styles.button} fs={12} press={()=>handlePress()}/>
        </View>
        <Image source={gay} style={styles.image}/>
    </View>
  );
}


const styles= StyleSheet.create({
    container: {
            flex:1,
            maxHeight: 200,
            borderRadius: 7,
            width: "95%",
            backgroundColor: '#ECF2F8',
            flexDirection: "row",
            alignItems: 'center',
            paddingLeft: 10,
            marginTop: 10,
            justifyContent: 'space-between',
            padding: 20, 
            
        },
    button: {
        borderRadius: 5,
        width: "50%",
        height: 45,
        backgroundColor:"black",
        
    },
    text:{
        fontSize: 22,
        fontWeight: "bold",
    },
    image:{
        width: "40%",
        height: "100%",
        borderRadius:20,
        
        
    }
})