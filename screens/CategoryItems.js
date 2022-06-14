import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, Route } from 'react-native';
import React, {useState, useEffect} from "react";
import {query, where, collection, getDoc, getDocs, doc, addDoc, setDoc, DocumentData, updateDoc, arrayUnion } from 'firebase/firestore';
import {BackHeading} from '../components/BackHeading';
import { ItemCard } from '../components/ItemCard';
import WheelChairImg from '../images/wheelchair.png'
import BedImg from '../images/bed.png'
import OxygenImg from '../images/oxygen.png'


export default function CategoryItems({route}) {


    const [results, setResults] = useState([]);

    const getResults = async() => {
        
            const Query = query(collection(route.params.db, "assets"), where("category", '==' , route.params.category.toLowerCase()));
            const querySnapshot = await getDocs(Query);
            
            let docsArray = []
            querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            docsArray.push(doc)
            });
        
            setResults(docsArray)

  }

  useEffect(()=>{
      getResults();
    //   console.log(route);
  },[route]);

  let image = WheelChairImg;

  switch (route.params.category.toLowerCase()) {
    case "beds":
      image = BedImg;
      break;
    case "oxygen":
      image = OxygenImg;
      break;
  
    default:
      break;
  }


  return (
    <View style={styles.container}>
      <BackHeading text={route.params.category.toUpperCase()} mt={50} mb={30}/>

      <ScrollView style={{maxHeight: "84%"}} contentContainerStyle={{display:"flex", flexDirection:"row", flexWrap: "wrap", flexGrow: 0, }} showsVerticalScrollIndicator={false}>
        {
            results.map((doc, i)=>
            <ItemCard key={i} user={route.params.user}  db={route.params.db} docId={doc.id} image={doc.data().image ? {uri: doc.data().image.toString()} : image} text={doc.data().name} stock={doc.data().stock} description={doc.data().description} index={i}/>
            )
        }
      </ScrollView>

    </View>
  );
}


const styles= StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '5%',
        marginTop: 0,
        width: '100%',
    },
})