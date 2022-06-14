import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

//we add this to allow us to work with navigation
import { useNavigation } from '@react-navigation/native';

export default function Parametre() {

  //we add this to get access to the navigation stack
  const navigation = useNavigation()

  //this is a function that lets us go back
  function GoBack(){
    navigation.goBack()
  } 


  return (
    <TouchableOpacity onPress={()=>GoBack()}>
      <View style={styles.container}>
      <Icon name="chevron-back" size={30} color="black" style={{position: 'absolute', left: 5 }}/>
      <Text style={styles.title}>Parametres</Text>
      </View>
    </TouchableOpacity>
  );
}


const styles= StyleSheet.create({
    container: {
        flex:1,
        maxHeight: 80,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: 'center',
        width: "95%",
        alignItems: "center",
    },
    title:{
        marginTop:-20,
        padding: 70,
        fontSize: 15,
        textAlign: 'center',
        color: "black",
        fontWeight:'bold'
        
    },
   
})