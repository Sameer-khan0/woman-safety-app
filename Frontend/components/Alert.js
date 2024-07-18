import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  Linking,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles, colors } from "../globelStyle";
import * as Location from "expo-location";
import { Audio } from "expo-av";

const AlertComponent = ({ showAlert, alertType, onResolve, location,cancelWomanModel,handleGuardianCancel,womadata }) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      console.log(loc);
      setCurrentLocation(loc);
    })();
  }, []);
  

  const openGoogleMaps = () => {
    if (!location && !currentLocation) return;

    const latitude = alertType === "woman" ? currentLocation?.coords.latitude : location?.latitude;
    const longitude = alertType === "woman" ? currentLocation?.coords.longitude : location?.longitude;

    if (!latitude || !longitude) return;

    console.log(latitude, longitude);
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url)
      .then(() => {
        console.log("Google Maps Opened");
      })
      .catch((error) => {
        console.log("Something went wrong with Google Maps: " + error);
      });
  };


  const makeCall = () => {
      let phoneNumberFormatted = `tel:${womadata.phonenumber}`;
      Linking.openURL(phoneNumberFormatted);
  };
  
  const sendSMS = () => {
    const message = "i will be thare in some time"
    let phoneNumberFormatted = `sms:${womadata.phonenumber}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
    Linking.openURL(phoneNumberFormatted);
  };
  

  if (!showAlert) return null;

  return (
    <Modal transparent={true} visible={showAlert} animationType="slide">
      {alertType === "woman" ? (
        <View style={style.wcontainer}>
          <View style={style.innercon}>
            <MaterialIcons name="send" size={200} color="white" />
            <Text style={style.alertTexthead}>Alert is Sent</Text>
            <Text style={style.alertText}>
              You have sent a help request to your guardian. Stay calm, help is
              on the way. Keep your phone close and try to stay in a safe
              location. If you feel comfortable, alert those around you to your
              situation. If you resolve the problem, then press in down button
              i'm OK.
            </Text>
            <TouchableOpacity
              title="Resolve Alert"
              onPress={openGoogleMaps}
              style={style.yourlocation}
            >
              <MaterialIcons name="map" size={50} color="white" />
              <Text style={style.locbtncontent}>Your location in map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              title="Resolve Alert"
              onPress={onResolve}
              style={style.yourlocation}
            >
              <MaterialIcons
                name="sentiment-very-satisfied"
                size={50}
                color="white"
              />
              <Text style={style.locbtncontent}>Delete alert i'm ok</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            title="Resolve Alert"
            onPress={cancelWomanModel}
            style={style.resolvebtn}
          >
            <Text style={style.resolvebtntext}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.gcontainer}>
          <View style={style.innercon}>
            <MaterialIcons name="warning" size={200} color="white" />
            <Text style={[style.alertText,{textAlign:'center'}]}>
              Your ward has sent a help request. Please respond immediately.
            </Text>
            <TouchableOpacity
              title="Resolve Alert"
              onPress={makeCall}
              style={style.yourlocation}
            >
              <MaterialIcons name="call" size={50} color="white" />
              <Text style={style.locbtncontent}>Make Calls</Text>
            </TouchableOpacity>
            <TouchableOpacity
              title="Resolve Alert"
              onPress={sendSMS}
              style={style.yourlocation}
            >
              <MaterialIcons name="message" size={50} color="white" />
              <Text style={style.locbtncontent}>Make SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              title="Resolve Alert"
              onPress={openGoogleMaps}
              style={style.yourlocation}
            >
              <MaterialIcons name="map" size={50} color="white" />
              <Text style={style.locbtncontent}>location map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              title="Resolve Alert"
              onPress={onResolve}
              style={style.yourlocation}
            >
              <MaterialIcons
                name="sentiment-very-satisfied"
                size={50}
                color="white"
              />
              <Text style={style.locbtncontent}>Resolve Alert</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            title="Resolve Alert"
            onPress={handleGuardianCancel}
            style={style.resolvebtn}
          >
            <Text style={style.resolvebtntext}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

const style = StyleSheet.create({
  wcontainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.womanPrimary,
  },
  gcontainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "red",
  },
  resolvebtn: {
    width: 300,
    height: 50,
    backgroundColor: "white",
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  yourlocation: {
    marginTop: 20,
    width: 300,
    height: 70,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 50,
    paddingRight: 50,
    alignItems: "center",
  },
  locbtncontent: {
    margin: 10,
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  resolvebtntext: {
    margin: 10,
    fontSize: 15,
    color: colors.guardianPrimary,
    fontWeight: "bold",
  },
  innercon: {
    display: "flex",
    alignItems: "center",
  },
  alertText: {
    color: "white",
    textAlign: "justify",
  },
  alertTexthead: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    padding: 20,
  },
});

export default AlertComponent;
