import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Alert,
  ToastAndroid,
} from "react-native";
import { BackHeading } from "../components/BackHeading";
import { Button } from "../components/Button";
import {
  getDoc,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";

export default function ApproveRequests({ route }) {
  const navigation = useNavigation();

  const [userData, setUserData] = useState([]);

  const getUserData = async () => {
    const docSnap = await getDoc(
      doc(route.params.db, "users", route.params.user)
    );
    setUserData(docSnap.data());
    console.log("Document data:", docSnap.data());
  };

  useEffect(() => {
    getUserData();
  }, []);

  const phoneNumber = route.params.phone ? route.params.phone : "+18423795338";

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

  const Approve = async () => {
    Alert.alert("Accept Request?", "Do you want to Accept Request?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => honorRequest() },
    ]);

    const honorRequest = async () => {
      const assetDataRef = doc(route.params.db, "assets", route.params.asset);
      //Here We Remove 1 from The Stock of the asset and remove the request
      await updateDoc(assetDataRef, {
        stock: increment(-1),
        requests: arrayRemove({
          id: route.params.user,
          phone: route.params.phone,
        }),
      });

      const offererDataRef = doc(
        route.params.db,
        "users",
        route.params.offerer
      );
      //Here We add this request to our fulfilledRequests on the association DB document
      await updateDoc(offererDataRef, {
        requestsFulfilled: arrayUnion({
          user: route.params.user,
          asset: route.params.asset,
        }),
      });

      if (Platform.OS === "ios") {
        Toast.show("Approval Successful! we're taking you home ;)", {
          duration: Toast.durations.LONG,
          backgroundColor: "white",
          shadowColor: "black",
          textColor: "black",
          position: -50,
        });
      } else {
        ToastAndroid.show(
          "Approval Successful! we're taking you home ;)",
          ToastAndroid.SHORT
        );
      }
      setTimeout(() => {
        navigation.navigate("MainScreen");
      }, 3000);
    };
  };

  const Refuse = () => {
    Alert.alert(
      "Remove Request?",
      "Do you want to remove this from requests?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => removeRequest() },
      ]
    );

    const removeRequest = async () => {
      const assetDataRef = doc(route.params.db, "assets", route.params.asset);
      //Here We Remove the request
      await updateDoc(assetDataRef, {
        requests: arrayRemove({
          id: route.params.user,
          phone: route.params.phone,
        }),
      });
    };
  };

  return (
    <View style={styles.container}>
      <BackHeading text="Approve Requests" pos="absolute" />

      <View style={{ marginTop: 100 }}>
        <Text style={{ fontSize: 20, marginTop: 20 }}>
          User: {userData.name}
        </Text>
        <Text style={{ fontSize: 20 }}>
          {userData.phone ? "Phone: " + route.params.phone : ""}
        </Text>
        <Button
          icon="call"
          text="Call Phone"
          style={{
            // backgroundColor: "green",
            padding: 10,
            minWidth: "70.5%",
            // marginLeft: 5,
            borderRadius: 7,
          }}
          press={() => onPressCall()}
        />
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "5%",
        }}
      >
        <Button
          text="Refuse"
          style={{
            backgroundColor: "red",
            padding: 10,
            width: "46.5%",
            marginRight: 5,
            borderRadius: 7,
          }}
          press={() => Refuse()}
        />
        <Button
          text="Approve"
          style={{
            backgroundColor: "green",
            padding: 10,
            width: "46.5%",
            marginLeft: 5,
            borderRadius: 7,
          }}
          press={() => Approve()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    width: "95%",
  },
});
