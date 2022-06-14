import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import { BackHeading } from "../components/BackHeading";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
  addDoc,
  setDoc,
  DocumentData,
  updateDoc,
  arrayUnion,
  deleteDoc
} from "firebase/firestore";

import Toast from "react-native-root-toast";

import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {vh, vw} from 'react-native-expo-viewport-units';
import { Button } from "../components/Button";

export default function EditAsset({ route }) {
  const navigation = useNavigation();



  const [editMode, setEditMode] = useState(false);

  

  return (
    <View style={{flex: 1}}>
      {!editMode ? 
        <ShowItemScreen route={route} setEditMode={setEditMode}/>
      :
      <EditMode route={route} setEditMode={setEditMode}/>

    }
    </View>
    )
};



const ShowItemScreen = ({route, setEditMode}) => {
  const navigation = useNavigation();
  
  const image = route.params.image;
  const text = route.params.text;
  const stock = route.params.stock;
  const description = route.params.description;
  const db = route.params.db;
  const user = route.params.user;
  const docId = route.params.docId;
  
  return(
    <View style={styles.container}>

      <BackHeading />
      <Image style={styles.image} source={image} />
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          marginLeft: "5%",
        }}
      >
        <Text style={styles.title}>{text}</Text>
        <Text style={styles.description}>{description}</Text>

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "black" }}
          onPress={() => setEditMode(true)}
        >
          <Text
            style={{
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: "white",
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            +
          </Text>
          <Text style={{ color: "white" }}>Edit Asset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, marginTop: 10 }}
          onPress={async() => await deleteDoc(doc(db, "assets", docId))}
        >
          <Text
            style={{
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: "white",
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            -
          </Text>
          <Text style={{ color: "white" }}>Remove Asset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    marginTop: 0,
    // marginLeft: 10,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "50%",
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 7,
    minWidth: "80%",
    display: "flex",
    alignItems: "center",
    marginLeft: "10%",
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    // padding: 25,
    textAlign: "center",
    width: "80%",
  },
})


const EditMode = ({route, setEditMode}) => {
  const navigation = useNavigation();
  const image = route.params.image;
  const text = route.params.text;
  const stock = route.params.stock;
  const description = route.params.description;
  const db = route.params.db;
  const user = route.params.user;
  const docId = route.params.docId;

  const [textVal, setTextVal] = useState(text);
  const [descVal, setDescVal] = useState(description);
  const [stockVal, setStockVal] = useState(stock);

  const updateChanges = async()=>{
    const snapshotRef = await doc(db, "assets", docId);
    await updateDoc(snapshotRef, {
      name: textVal,
      description: descVal,
      stock: stockVal
    })

    if (Platform.OS === "ios") {
      Toast.show("Request Successful! we're taking you home ;)", {
        duration: Toast.durations.LONG,
        backgroundColor: "white",
        shadowColor: "black",
        textColor: "black",
        position: -50,
      });
    } else {
      ToastAndroid.show(
        "Request Successful! we're taking you home ;)",
        ToastAndroid.SHORT
      );
    }
    setTimeout(() => {
      navigation.navigate("MainScreen");
    }, 3000);
  }
  
  return(
    <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <BackHeading />
      <Text>Name:</Text>
      <TextInput style={editStyles.input} value={textVal} onChangeText={setTextVal}/>
      <Text>Description:</Text>
      <TextInput style={editStyles.input} value={descVal} onChangeText={setDescVal} multiline={true}/>
      <Text>Stock:</Text>
      <TextInput style={editStyles.input} value={stockVal} onChangeText={setStockVal}/>

      <Button text="Submit Changes" press={()=>updateChanges()} style={{borderRadius: 7}}/>
    </View>
  )
}

const editStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
    width: vw(100)
  },

  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    // padding: 25,
    textAlign: 'center',
    width: vw(80),
    borderRadius: 7
  },
  
});
