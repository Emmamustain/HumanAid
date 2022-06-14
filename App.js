import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { LogBox } from "react-native";

import { enableScreens } from "react-native-screens";
enableScreens();
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import Welcome from "./screens/Welcome";
import Reg from "./screens/Reg";
import Try from "./screens/Try";
import MainScreen from "./screens/MainScreen";
import Settings from "./screens/Settings";
import FulfilledRequests from "./screens/FulfilledRequests";

import { initializeApp } from "firebase/app";
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
  onSnapshot,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithCredential,
  getAuth,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import Constants from "expo-constants"; //So we can read app.json extra
import * as Google from "expo-google-app-auth"; //google auth libraries
import OfferAsset from "./screens/OfferAsset";
import CategoryItems from "./screens/CategoryItems";
import { Search } from "./screens/Search";
import ItemDetails from "./screens/ItemDetails";
import UserItems from "./screens/UserItems";
import AllRequests from "./screens/AllRequests";
import ApproveRequests from "./screens/ApproveRequests";
import EditAsset from "./screens/EditAsset";
import AssociationPage from "./screens/AssociationPage";

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(["Setting a timer", "AsyncStorage", "Non-serializable"]);
  });

  const firebaseConfig = {
    apiKey: "AIzaSyCzqGBPpgPxynSHMzsiGCBVZggYfxq1Xmg",
    authDomain: "association-app-ea7e3.firebaseapp.com",
    projectId: "association-app-ea7e3",
    storageBucket: "association-app-ea7e3.appspot.com",
    messagingSenderId: "403019091549",
    appId: "1:403019091549:web:7573638da8a07f228b47b4",
    measurementId: "G-2151SQM0LB",
  };

  const Firebase = initializeApp(firebaseConfig);

  const db = getFirestore(Firebase);

  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        console.log("no user");
        setUser(undefined);
      }
    });
    handleUserAfterAuth();
  }, [user]);

  const handleUserAfterAuth = async () => {
    if (user) {
      const docSnap = await onSnapshot(
        doc(db, "users", user.uid),
        async (doc) => {
          if (doc) {
            setUserData(doc.data());
            console.log("Document data:", doc.data());
            if (doc.data().service_provider) {
              setServiceOwned(doc.data().service_owned);
            }
          } else {
            console.log("No user document found!");
            const docRef = await setDoc(doc(db, "users", user.uid), {
              name: user.displayName,
              isAssociation: false,
            }).then((doc) => {
              console.log("Document Written");
              setUserData(doc.data());
            });
          }
        }
      );
    } else {
      console.log("No user to search for!");
    }
  };

  const Glogin = async () => {
    try {
      //await GoogleSignIn.askForPlayServicesAsync();
      const result = await Google.logInAsync({
        //return an object with result token and user
        iosClientId: Constants.manifest.extra.IOS_KEY, //From app.json
        androidClientId: Constants.manifest.extra.ANDROID_KEY, //From app.json
        // iosStandaloneAppClientId: Constants.manifest.extra.IOS_KEY,
        androidStandaloneAppClientId:
          Constants.manifest.extra.ANDROID_KEY_STANDALONE,
      });
      if (result.type === "success") {
        // console.log(result);
        setIsLoading(true);
        const credential = GoogleAuthProvider.credential(
          //Set the tokens to Firebase
          result.idToken,
          result.accessToken
        );
        const auth = getAuth();

        signInWithCredential(auth, credential)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });

        return true;
      } else {
        return false;
        //CANCEL
      }
    } catch ({ message }) {
      alert("login: Error:" + message);
      return false;
    }
  };

  const GLogOut = (onSuccess) => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        onSuccess();
        console.log("logged out");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Welcome"
            children={() => <Welcome Glogin={Glogin} user={user} />}
          />
         
          <Stack.Screen
            name="MainScreen"
            children={() => (
              <MainScreen
                db={db}
                userData={userData}
                user={user}
                displayName={user ? user.displayName : "New User"}
                GLogOut={GLogOut}
              />
            )}
          />
          <Stack.Screen name="Settings" children={() => <Settings />} />
          <Stack.Screen
            name="OfferAsset"
            children={() => <OfferAsset db={db} user={user} />}
          />
          <Stack.Screen name="CategoryItems" component={CategoryItems} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="AssociationPage" component={AssociationPage} />
          <Stack.Screen name="ItemDetails" component={ItemDetails} />
          <Stack.Screen
            name="UserItems"
            children={() => <UserItems db={db} user={user} />}
          />
          <Stack.Screen name="AllRequests" component={AllRequests} />
          <Stack.Screen
            name="FulfilledRequests"
            component={FulfilledRequests}
          />
          <Stack.Screen name="ApproveRequests" component={ApproveRequests} />
          <Stack.Screen name="EditAsset" component={EditAsset} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
