import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

function Footer({ hom, pro }) {
  const navigation = useNavigation();
  
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate(hom)}
      >
        <Icon name="home-outline" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate(pro)}
      >
        <Icon name="person-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    width: "100%",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default Footer;
