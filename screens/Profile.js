import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import { useState, useEffect } from "react";
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
  onSnapshot,
} from "firebase/firestore";

import { BackHeading } from "../components/BackHeading";

export default function Profile({ db, user, userData, displayName, GLogOut }) {
  const photoURL =
    user && user.photoURL
      ? user.photoURL
      : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpwco.com.sg%2Fwp-content%2Fuploads%2F2020%2F05%2FGeneric-Profile-Placeholder-v3.png&f=1&nofb=1";
  const isAssociation = userData.isAssociation;

  const navigation = useNavigation();

  const [requests, setRequests] = useState([]);
  const [requestAmount, setRequestAmount] = useState(0);

  const getRequests = async () => {
    const Query = query(
      collection(db, "assets"),
      where("owner", "==", user.uid)
    );
    const unsubscribe = await onSnapshot(Query, (querySnapshot) => {
      let docsArray = [];
      querySnapshot.forEach((doc) => {
        //   console.log(doc.id, " => ", doc.data());
        docsArray.push(doc);
      });

      setRequests(docsArray);
    });
  };

  useEffect(() => {
    if (db && user) {
      getRequests();
    }
  }, [db]);

  useEffect(() => {
    if (requests) {
      let counter = 0;
      requests.map(
        (doc, i) =>
          doc.data().requests &&
          doc.data().requests.map((request, i) => counter++)
      );
      setRequestAmount(counter);
    }
  }, [requests]);

  return (
    <View style={styles.container}>
      <BackHeading text={"My Profile"} />

      <View style={styles.UserDataContainer}>
        <Image
          source={{ uri: photoURL.toString() }}
          style={{ height: 80, width: 80, borderRadius: 80 }}
        />
        <View style={{ marginLeft: 20 }}>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.accountType}>
            {isAssociation ? "Association Owner" : "Normal User"}
          </Text>
        </View>
        {/* <Icon
          name="edit"
          size={25}
          color="rgba(0,0,0,0.3)"
          style={{ marginLeft: 20 }}
        /> */}
      </View>

      { userData && userData.isAssociation &&
        <View>
            <Text style={{ color: "rgba(0,0,0,0.5)" }}>Dashboard</Text>
          <DashboardItem
            icon="appstore-o"
            bgc="#59A5BD"
            text="All Items"
            onPress={() => navigation.navigate("UserItems")}
          />
          <DashboardItem
            icon="exclamationcircleo"
            bgc="#FFD237"
            text="All Requests"
            data={requestAmount}
            onPress={() =>
              navigation.navigate("AllRequests", {
                requests: requests,
                db: db,
                offerer: user.uid,
              })
            }
          />
          <DashboardItem
            icon="appstore-o"
            bgc="#59BD7D"
            text="Fulfilled Requests"
            data={
              userData.requestsFulfilled ? userData.requestsFulfilled.length : 0
            }
            onPress={() =>
              navigation.navigate("FulfilledRequests", {
                requests: userData.requestsFulfilled,
              })
            }
          />
          {/* <DashboardItem icon="appstore-o" bgc="black" text="Something else" /> */}
        </View>
}
      <Text style={{ color: "rgba(0,0,0,0.5)", marginTop: userData.isAssociation ? 30 : 0, marginLeft: userData.isAssociation ? 0 : 30  }}>
        My Account
      </Text>
      {/* <Text style={{ fontWeight: "bold", marginTop: 10, color: "#437BFE" }}>
        Switch to Another Account
      </Text> */}
      <Text
        style={{ fontWeight: "bold", marginTop: 10, color: "#FF6F41", marginLeft: userData.isAssociation ? 0 : 30 }}
        onPress={() => GLogOut(() => navigation.navigate("Welcome"))}
      >
        Log Out
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: "5%",
    // paddingRight: "5%",
  },
  UserDataContainer: {
    // marginTop: 10,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  displayName: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

function DashboardItem({
  icon,
  bgc = "black",
  text,
  onPress,
  color = "white",
  data,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...dashboardItemStyles.container,
          justifyContent: "space-between",
          width: !data ? "90%" : "87.5%",
        }}
      >
        <View style={dashboardItemStyles.container}>
          <Icon
            name={icon}
            size={20}
            color={color}
            style={{ padding: 10, backgroundColor: bgc, borderRadius: 120 }}
          />
          <Text style={dashboardItemStyles.text}>{text}</Text>
        </View>
        {!data ? (
          <Icon name="arrowright" size={15} color="gray" />
        ) : (
          <View style={dashboardItemStyles.dataContainer}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "white",
                paddingRight: 5,
              }}
            >
              {data}
            </Text>
            <Icon name="arrowright" size={15} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const dashboardItemStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 10,
  },
  text: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  dataContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    backgroundColor: "#3871FF",
    borderRadius: 80,
  },
});
