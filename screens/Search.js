import React, { Dispatch, useEffect, useRef, useState } from 'react';
import {Image, StyleSheet, Text, TextInput, View, ScrollView, Route} from 'react-native';
import { vh,vw } from 'react-native-expo-viewport-units';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import { BackHeading } from '../components/BackHeading';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { ItemCard } from '../components/ItemCard';

import WheelChairImg from '../images/wheelchair.png'
import BedImg from '../images/bed.png'
import OxygenImg from '../images/oxygen.png'
import { TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const Search= ({route}) => {

    const navigation = useNavigation();

    const value = route ? route.params.value : "";
    const [search, onChangeSearch] = useState(value);

    const [results, setResults] = useState();
    const [associations, setAssociations] = useState(undefined);

    const getResults = async() => {
        const Query = query(collection(route.params.db, "assets"), where("nameAsArray", "array-contains", search.trim().toLowerCase()));
        const querySnapshot = await getDocs(Query);
    
        let docsArray = []
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        docsArray.push(doc)
        });
        setResults(docsArray)
    
  }

const getAssociations = async() => {
    const Query = query(collection(route.params.db, "associations"), where("nameAsArray", "array-contains", search.trim().toLowerCase()));
    const querySnapshot = await getDocs(Query);

    let docsArray = []
    querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    docsArray.push(doc)
    });
    setAssociations(docsArray)

}

  useEffect(()=>{
      getResults();
      getAssociations();
      console.log(associations)
  },[search]);

    return(
        <View style={styles.container}>
            

            <BackHeading text="Search" mt={1}/>
            <SearchBar search={search} onChangeSearch={onChangeSearch}/>

            { results && results[0] &&
            <ScrollView style={{maxHeight: vh(70.8), width: "100%", marginLeft: "7.5%"}} showsVerticalScrollIndicator={false} contentContainerStyle={{display:"flex", flexDirection:"row", flexWrap: "wrap", flexGrow: 0, }}>
                { results ? results.map((doc, i) => 
                    <ItemCard key={i} user={route.params.user} db={route.params.db} docId={doc.id} image={doc.data().image ? {uri: doc.data().image.toString()} : WheelChairImg} text={doc.data().name} stock={doc.data().stock} description={doc.data().description} index={i}/>             

                    )
                : <View></View>
                }
            </ScrollView>}

            

            {associations && associations[0] && <Text style={{alignSelf:"flex-start", marginLeft:15}}>Associations:</Text>}

            <ScrollView style={{maxHeight: vh(70.8), width: "100%", marginLeft: "7.5%"}} showsVerticalScrollIndicator={false} contentContainerStyle={{display:"flex", flexDirection:"row", flexWrap: "wrap", flexGrow: 0, }}>
                { associations ? associations.map((doc, i) => 
                    <TouchableHighlight key={i} style={{padding: 20, backgroundColor: '#fff', borderRadius: 7, marginTop: 10, borderColor:"black", borderWidth:1, zIndex:9}} onPress={()=>navigation.navigate("AssociationPage", {name:doc.data().name,phone:doc.data().phone,email:doc.data().email, db: route.params.db, user: route.params.user})}>
                        <Text>{doc.data().name}</Text>
                     </TouchableHighlight>
                    )
                : <View></View>
                }
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        top: 70
    },
    filtersContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginTop: 5,
        paddingLeft: "7%",
        
    },
    filterText: {
        fontSize: 17,
        color: "rgba(0,0,0,0.6)"
    },
});



const SearchBar = ({search ,onChangeSearch}) =>{
    
    const textRef = useRef();
    
    // useEffect(()=>{
    //     setTimeout(() => textRef.current.focus(), 10)
    // },[textRef])

    return(
        <View style={searchBarStyles.container}>
            <MIcon name="search" size={30} color="black"/>
            <TextInput ref={textRef} autoFocus={true} value={search} onChangeText={onChangeSearch} style={searchBarStyles.input} placeholder={'Search...'} placeholderTextColor = "rgba(0,0,0,0.6)"></TextInput>
        </View>
    );

}


const searchBarStyles = StyleSheet.create({
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
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    input:{
        fontSize: 21,
        width: '70%',
        color: 'black',
        letterSpacing: 0.5,
        paddingLeft: 10,
        
    },
});

