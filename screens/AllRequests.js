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

export default function AllRequests({ route }) {
  let image = WheelChairImg;

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BackHeading text={"All Requests"} mt={50} mb={30} />

      <ScrollView
        style={{ maxHeight: "84%" }}
        contentContainerStyle={{
          display: "flex",
          // flexDirection: "row",
          flexWrap: "wrap",
          flexGrow: 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        {route &&
          route.params.requests.map(
            (doc, i) =>
              doc.data().requests &&
              doc.data().requests.map((request, i) => (
                <ItemCard
                  key={i}
                  image={
                    doc.data().image
                      ? { uri: doc.data().image.toString() }
                      : image
                  }
                  text={doc.data().name}
                  stock={doc.data().stock}
                  description={doc.data().description}
                  index={i}
                  fullW={true}
                  onPress={() =>
                    navigation.navigate("ApproveRequests", {
                      user: request.id,
                      phone: request.phone,
                      db: route.params.db,
                      asset: doc.id,
                      offerer: route.params.offerer,
                    })
                  }
                />
              ))
          )}
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
