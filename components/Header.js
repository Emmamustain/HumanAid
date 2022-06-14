import { useNavigation } from "@react-navigation/native";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

//Don't forget to change the name of the function
export default function Header({ title }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Icon
        name="menu"
        size={30}
        color="black"
        onPress={() => navigation.openDrawer()}
      />
      <Text style={styles.title}>{title}</Text>
      <Icon
        name="person-circle"
        size={30}
        color="black"
        onPress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 80,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
});
