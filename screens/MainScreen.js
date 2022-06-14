import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import "react-native-gesture-handler";

import Settings from "./Settings";
import Profile from "./Profile";
import Try from "./Try";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import MostRequested from "../components/MostRequested";
import { Button } from "../components/Button";

//we add this to allow us to work with navigation
import { useNavigation } from "@react-navigation/native";

//this is for the hamburger menu functionality on the top left
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainAssets from "../components/MainAssets";
const Drawer = createDrawerNavigator();

export default function MainScreen({
  userData,
  displayName,
  db,
  user,
  GLogOut,
}) {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Home"
        children={() => (
          <MainContent
            userData={userData}
            displayName={displayName}
            db={db}
            user={user}
          />
        )}
      />
      <Drawer.Screen
        name="Profile"
        children={() => (
          <Profile
            user={user}
            userData={userData}
            displayName={displayName}
            db={db}
            GLogOut={GLogOut}
          />
        )}
      />
      {/* <Drawer.Screen name="Settings" component={Settings} /> */}
      {userData && !userData.isAssociation ? (
        <Drawer.Screen
          name="Register Association"
          children={() => <Try db={db} user={user} />}
        />
      ) : (
        <Drawer.Screen
          name="Remove Association"
          children={() => <Try db={db} user={user} />}
        />
      )}
    </Drawer.Navigator>
  );
}

function MainContent({ userData, displayName, db, user }) {
  //we add this to get access to the navigation stack
  const navigation = useNavigation();

  //this is a function that lets us go back i used it in Parametre.js
  function GoBack() {
    navigation.goBack();
  }
  //to get the phone screen size and make sure when the phone keyboard shows up it doesnt squish everything else
  const windowHeight = useWindowDimensions().height;

  return (
    <View style={{ ...styles.container, minHeight: Math.round(windowHeight) }}>
      <Header title={userData !== undefined ? userData.name : displayName} />
      <ScrollView
        style={{
          maxWidth: "100%",
          width: "100%",
          maxHeight: "87%",
          height: "87%",
        }}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar db={db} />
        <Categories db={db} user={user} />
        <Hero isAssociation={userData ? userData.isAssociation : false}/>
        {/* <View style={{ width: "90%", marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Most Requested
          </Text>
        </View>
        <MostRequested /> */}

        <View style={{ width: "90%", marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Assets
          </Text>
        </View>
        <MainAssets db={db} user={user}/>
        {/* <Button text="Go Back" press={()=>GoBack()}/> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
