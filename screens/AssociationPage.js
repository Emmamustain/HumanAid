import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { BackHeading } from '../components/BackHeading';
import { Button } from '../components/Button';
import { useState, useEffect } from 'react';

export default function AssociationPage({route}) {

    const name = route.params.name;
    const phone = route.params.phone;
    const email = route.params.email;
    const db = route.params.db;
    const user = route.params.user;

    const phoneNumber = phone ? phone : "+18423795338";

  const onPressCall = () => {
    const url =
      Platform.OS === "android"
        ? `tel:${phoneNumber}`
        : `telprompt:${phoneNumber}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        return Linking.openURL(url).catch(() => null);
      } else {
        alert(
          "Calls are not supported by this device!, phoneNumber is " +
            phoneNumber
        );
      }
    });
  };

    const [results, setResults] = useState([]);

  const getResults = async () => {
    const Query = query(
      collection(db, "assets"),
      where("owner", "==", name)
    );
    const querySnapshot = await getDocs(Query);

    let docsArray = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      docsArray.push(doc);
    });

    setResults(docsArray);
  };

  useEffect(() => {
    if (db && user) {
      getResults();
    }
    //   console.log(route);
  }, [db]);


  return (
    <View style={styles.container}>
        <BackHeading text={"Association Details"}/>
        <View style={{display: 'flex', flexDirection:"column", justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
          <View style={{display: 'flex', flexDirection:"row", justifyContent: 'space-around', alignItems: 'center', width: "90%"}}>
            <Text>Name: {name}</Text>
            <Text>Email: {email}</Text>
          </View>

          <Button text="Call Association" style={{maxWidth: 200, borderRadius: 7, }} icon="call" press={()=>onPressCall()}/>
        </View>
        <ScrollView>

          {results && results [0] ? <Text style={{marginTop: 10, marginLeft: 10}}>Items:</Text> : <Text style={{marginTop: 10, marginLeft: 10}}>No Items</Text>}

        {results.map((doc, i) => (
          <ItemCard key={i} user={route.params.user} db={route.params.db} docId={doc.id} image={doc.data().image ? {uri: doc.data().image.toString()} : WheelChairImg} text={doc.data().name} stock={doc.data().stock} description={doc.data().description} index={i}/>
        ))}
        </ScrollView>
    </View>
  );
}


const styles= StyleSheet.create({
    container: {
        flex:1
    },
})