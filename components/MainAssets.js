import { StatusBar } from 'expo-status-bar';
import { getDocs, collection} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import WheelChairImg from '../images/wheelchair.png'
import { ItemCard } from './ItemCard';

export default function MainAssets({db, user}) {
    
    const [results, setResults] = useState([]);

    const getResults = async() => {
            const querySnapshot  = await getDocs(collection(db, "assets"));
            let docsArray = []
            querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            docsArray.push(doc)
            });
        
            setResults(docsArray)
  }

  useEffect(()=>{
      getResults();
  },[]);


  return (
    <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>
        {results &&
            results.map((doc, i)=>
            <ItemCard key={i} user={user} db={db} docId={doc.id} style={{maxWidth: 200, minWidth: 200, height: 300}} image={doc.data().image ? {uri: doc.data().image.toString()} : WheelChairImg} text={doc.data().name} stock={doc.data().stock} description={doc.data().description} index={i}/>             
            )
        }
    </ScrollView>
  );
}


const styles= StyleSheet.create({
    container: {
        flex:1,
        marginLeft: "5%",
        marginTop: 10
    },
})


const itemCardStyles= StyleSheet.create({
    container: {
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 200,
        borderRadius: 10,
        width: 150,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10
        // alignItems: "center"
    },
    title: {
        fontWeight: "700",
        fontSize: 14,
        marginTop: 5,
        
    },
    stock: {
        fontWeight: "normal",
        fontSize: 9,
    }
})