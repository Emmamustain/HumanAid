import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Image, Route } from "react-native";
import React, { useState, useEffect } from "react";
import {
  query,
  where,
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
import { BackHeading } from "../components/BackHeading";
import { ItemCard } from "../components/ItemCard";
import WheelChairImg from "../images/wheelchair.png";
import BedImg from "../images/bed.png";
import OxygenImg from "../images/oxygen.png";
import { useNavigation } from "@react-navigation/native";

export default function UserItems({ db, user }) {
  const navigation = useNavigation();

  const [results, setResults] = useState([]);

  const getResults = async () => {
    const Query = query(
      collection(db, "assets"),
      where("owner", "==", user.uid)
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

  let image = WheelChairImg;

  return (
    <View style={styles.container}>
      <BackHeading text={"Provided Assets"} mt={50} mb={30} />

      <ScrollView
        style={{ maxHeight: "84%" }}
        contentContainerStyle={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          flexGrow: 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        {results.map((doc, i) => (
          <ItemCard
            key={i}
            image={
              doc.data().image ? { uri: doc.data().image.toString() } : image
            }
            text={doc.data().name}
            stock={doc.data().stock}
            description={doc.data().description}
            index={i}
            onPress={() =>
              navigation.navigate("EditAsset", {
                db: db,
                docId: doc.id,
                user: user,
                image: doc.data().image
                  ? { uri: doc.data().image.toString() }
                  : image,
                text: doc.data().name,
                stock: doc.data().stock,
                description: doc.data().description,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "5%",
    marginTop: 0,
    width: "100%",
  },
});
