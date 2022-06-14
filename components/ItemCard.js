import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export function ItemCard({
  image,
  text,
  stock,
  bgc,
  index,
  description,
  db,
  user,
  docId,
  fullW,
  onPress,
  style
}) {
  const navigation = useNavigation();

  const colors = ["#EBF1F4", "#EDEBF4", "#F3EBF4", "#F4EBED", "lavender"];

  let bgColor = colors[index ? index % 5 : 0];

  function handlePress() {
    navigation.navigate("ItemDetails", {
      db: db,
      docId: docId,
      user: user,
      image: image,
      text: text,
      stock: stock,
      description: description,
    });
  }

  return (
    <TouchableOpacity
      style={{
        ...itemCardStyles.container,
        backgroundColor: bgc ? bgc : "white",
        width: "90%",
        maxWidth: fullW ? "100%" : "45%",
        ...style
      }}
      onPress={onPress ? onPress : handlePress}
    >
      <View>
        <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Image
            source={image}
            style={{ borderRadius: 10, minHeight: 170, width: "100%",}}
          />
        </View>
        <Text style={itemCardStyles.title}>{text}</Text>
        <Text style={itemCardStyles.stock}>Available: {stock}</Text>
        {/* <Text style={{...itemCardStyles.stock, marginTop: 5}}>{description}</Text> */}
      </View>
    </TouchableOpacity>
  );
}

const itemCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 220,
    borderRadius: 10,
    // width: 150,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    minWidth: "45%",
    // marginLeft: "10%",
    // alignItems: "center"
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    // paddingLeft: 10,
  },
  stock: {
    fontWeight: "normal",
    fontSize: 8,
    marginBottom: 5,
    // paddingLeft: 10,
  },
});
