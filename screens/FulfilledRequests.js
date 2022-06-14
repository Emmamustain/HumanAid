import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { BackHeading } from "../components/BackHeading";

export default function FulfilledRequests({ route }) {
  return (
    <View style={styles.container}>
      <BackHeading text="Fulfilled Requests" />
      {route &&
        route.params.requests &&
        route.params.requests.map((request, i) => (
          <View
            style={{ margin: 10, borderWidth: 2, padding: 10, borderRadius: 7 }}
            key={i}
          >
            <Text>asset: {request.asset}</Text>
            <Text>user: {request.user}</Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "95%",
  },
});
