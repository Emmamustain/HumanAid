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
} from "firebase/firestore";
import {Button} from '../components/Button'

import Toast from "react-native-root-toast";

import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ItemDetails({ route }) {
  const navigation = useNavigation();

  const image = route.params.image;
  const text = route.params.text;
  const stock = route.params.stock;
  const description = route.params.description;
  const db = route.params.db;
  const user = route.params.user;
  const docId = route.params.docId;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [tries, setTries] = useState(-1);

  async function handleRequest() {
    console.log(docId);
    if (phoneNumber.trim() !== "" && phoneNumber.length === 10) {
      setShowInput(false);
      const assetDataRef = doc(db, "assets", docId);
      await updateDoc(assetDataRef, {
        requests: arrayUnion({ id: user.uid, phone: phoneNumber }),
      });

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
    } else {
      setPhoneNumber("");
      setTries(tries + 1);
      setShowInput(true);
    }
  }

  return (
    <View style={styles.container}>
      {showInput ? (
        <View
          style={{
            position: "absolute",
            top: 200,
            zIndex: 5,
          }}
        >
          <View style={styles.inputContainer}>
            <Text style={{ paddingTop: 12 }}>Enter your phone number</Text>

            <TextInput
              style={styles.input}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              placeholder="Phone number"
              keyboardType="number-pad"
              borderRadius={7}
              onSubmitEditing={() => handleRequest()}
            />
            <Button text={"Submit"} style={{borderRadius:7, height: 50, marginTop:5}} press={()=>handleRequest()}/>
            {tries > 0 ? (
              <Text style={{ paddingBottom: 12, color: "red" }}>
                Enter a correct number!
              </Text>
            ) : (
              <></>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}

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
        <TouchableOpacity style={styles.button} onPress={() => handleRequest()}>
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
          <Text style={{ color: "white" }}>Request Asset</Text>
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
    backgroundColor: "black",
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
});
