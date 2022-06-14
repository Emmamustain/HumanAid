import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

//Don't forget to change the name of the function
export default function SearchBar({db}) {
    const [search, onChangeSearch] = useState("");

    const navigation = useNavigation();

    function handleSearchFunction(){
      navigation.navigate('Search', {db: db, value: search});
    }


  return (
    <View style={styles.container}>
      <Icon name="search" size={25} color="gray"/>
      <TextInput
            style={styles.input}
            onChangeText={onChangeSearch}
            placeholder="Find a medical Asset"
            value={search}
            onSubmitEditing={handleSearchFunction}
          />
    </View>
  );
}


const styles= StyleSheet.create({
    container: {
        flex:1,
        height: 60,
        maxHeight: 60,
        width: "95%",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 7,
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: 10
    },
    input:{
        paddingLeft: 10,
        fontSize: 16,
    }
})