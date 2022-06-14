import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export function Button({
  text,
  icon,
  press,
  style,
  fs = 14,
  white = true,
  bold = true,
  lf = 0,
}) {
  return (
    <TouchableHighlight
      style={{ ...styles.container, ...style }}
      onPress={press}
    >
      <View>
        {icon ? (
          <Icon
            name={icon}
            color="white"
            size={20}
            style={{ position: "absolute", left: -30 }}
          />
        ) : (
          <View />
        )}
        <Text
          style={{
            color: white ? "white" : "black",
            fontWeight: bold ? "bold" : "normal",
            marginLeft: lf,
            fontSize: fs,
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "90%",
    backgroundColor: "#3F7FB8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
