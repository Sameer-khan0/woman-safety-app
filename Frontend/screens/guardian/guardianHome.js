import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors, styles as globalStyles } from "../../globelStyle";
import Footer from "../../components/Footer";
import AlertComponent from "../../components/Alert";
import { Audio } from "expo-av";
import { checkAlertStatus, DeleteAlert, fetchGuardiansWomans,Guardian } from "../../Apis/GuardianApiHandler";

function HomeScreen() {
  const [Womens, setWomens] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("woman");
  const [Sound, setSound] = useState();
  const [Womandata, setWomandata] = useState(true);
  const [location, setLocation] = useState();

  useEffect(() => {
    const getWoman = async () => {
      try {
        const getWomans = await fetchGuardiansWomans();
        setWomens(getWomans)
      } catch (error) {
        console.error("Error fetching women:", error);
      }
    };

    getWoman();
  }, []);

  useEffect( () => {
    const fetchLocation = async () => {
      const isAlert = await checkAlertStatus();
      if (isAlert.data.data.alertId) {
        setWomandata(isAlert.data.data);
        await handelAlert(isAlert.data.data);
      } else setShowAlert(false)
    };
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/alert.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  };

  const handleResolve = async () => {
    await DeleteAlert();
    setShowAlert(false);
  };

  const handleGuardianCancel = () => {
    setShowAlert(false);
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const handelAlert = async (data) => {
    if (!data) return;
    setLocation({ latitude: data.latitude, longitude: data.longitude });
    setAlertType("guardian");
    await playSound();
    setShowAlert(true);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.bgDesign}></View>
      <View style={styles.container}>
        <View>
          {/* <TouchableOpacity onPress={handelAlert}>
        <Icon name="notifications" size={40} color="white" />
          </TouchableOpacity> */}
        <Text style={globalStyles.title}>Hello {Guardian && Guardian.name} 🤚</Text>
        {/* <TouchableOpacity  onPress={stopSound}>
        <Icon name="notifications" size={40} color="#900" />
        </TouchableOpacity> */}
        </View>
        <View style={styles.alertBox}>
          <View style={styles.alert}>
            <View style={styles.alertText}>
              <Image
                source={require("../../assets/shield.png")}
                alt="image"
              />
            </View>
          </View>
        </View>
        <View style={styles.guardianBox}>
          <Text style={styles.guardianTitle}> You are Guardian of :</Text>
          
          <FlatList
            data={Womens}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.guardianItem}>
                <View
                  style={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../../assets/woman.png")}
                    alt="logo"
                  />
                  <View
                    style={{
                      display: "flex",
                      paddingLeft: 10,
                      flexDirection: "column",
                    }}
                  >
                    <Text>{item.name || "Name"}</Text>
                    <Text>{item.email || "Email"}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
        {/* <TouchableOpacity onPress={handelAlert}>
          <Text>Start Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stopSound}>
          <Text>Stop Alert</Text>
        </TouchableOpacity> */}
      </View>
      {/* <Location /> */}
      {location && (
        <AlertComponent
          showAlert={showAlert}
          alertType={alertType}
          onResolve={handleResolve}
          location={location}
          womadata={Womandata}
          handleGuardianCancel={handleGuardianCancel}
        />
      )}
      <Footer pro="guardianaccount" hom="guardianhome" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  bgDesign: {
    position: "absolute",
    width: "100%",
    height: "25%",
    backgroundColor: colors.guardianPrimary,
    top: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  guarbox: {
    flex: 2,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  alert: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: colors.guardianPrimary,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  guardianBox: {
    flex: 7,
    justifyContent: "center",
    padding: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  guardianTitle: {
    textAlign: "start",
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
    marginBottom: 10,
  },
  guardianList: {
    width: "100%",
  },
  guardianItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  btnBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    width: 70,
    height: 70,
    borderRadius: 50,
    // borderWidth: 1,
    borderColor: "gray",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;
