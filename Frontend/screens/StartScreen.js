// HomeScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import styles from "./style/startScreen";
import { useNavigation } from "@react-navigation/native";
import Guardianimg from "../assets/guardian.png";
import Womanimg from "../assets/woman.png";

function HomeScreen() {
  const navigate = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.HeaderTitle}>Safe Woman</Text>
      <Image source={require("../assets/splash.png")} style={styles.image} />
      <Text style={styles.Titlestyle}>Select a Role</Text>
      <View style={styles.innercontaine}>
        <TouchableOpacity
          onPress={() => navigate.navigate("womanreg")}
          style={styles.box}
        >
          <Image source={require('../assets/woman.png')} alt="woman" />
          <Text style={styles.Textstyle}>woman</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate.navigate("guardianreg")}
          style={styles.box2}
        >
          <Image source={require('../assets/guardian.png')} alt="guardian" />
          <Text style={styles.Textstyle}>Guardian</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;
