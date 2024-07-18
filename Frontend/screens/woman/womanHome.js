import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors, styles as globalStyles } from "../../globelStyle";
import Footer from "../../components/Footer";
import AlertComponent from "../../components/Alert";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { fetchWomanGuardians ,fetchallGuardians, SentGuardianAlert,AddGuardian, DeleteAlert, Woman } from "../../Apis/WomanApiHandler";

function HomeScreen() {
  const [guardians, setGuardians] = useState([]);
  const [allGuardians, setallGuardians] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("woman");
  const [Sound, setSound] = useState();
  const [sendAlerttext, setAlerttext] = useState("Alert");
  const [location, setLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/send.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    (async () => {
      const womanGuardians = await fetchWomanGuardians()
      setGuardians(womanGuardians)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleResolve = async () => {
    await DeleteAlert()
    setShowAlert(false);
  };

  const cancelModel= () =>{
    setShowAlert(false)
  }

  const addGuardian = async (guardian) => {
    await AddGuardian(guardian._id)
    setGuardians([...guardians, guardian]);
    setModalVisible(false);
  };

  const handelSentAlert = async () => {
    setAlerttext("wait")
    try {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude
      const guardianid = guardians && guardians[0]._id
      const alertsend = await SentGuardianAlert(latitude,longitude,guardianid)
      if(!alertsend) return
      setAlertType("woman");
      await playSound();
      setShowAlert(true);
    } catch (error) {
      new error(error)
    } finally {
      setAlerttext("Alert")
    }
  };

  const removeGuardian = (index) => {
    setGuardians(guardians.filter((_, i) => i !== index));
  };

  const toggleModal = async () => {
    const allGuardians = await fetchallGuardians()
    setallGuardians(allGuardians.message)
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.bgDesign}></View>
      <View style={styles.container}>
        <Text style={globalStyles.title}>Hello {Woman && Woman.name} 🤚</Text>
        <View style={styles.alertBox}>
          <TouchableOpacity onPress={handelSentAlert} style={styles.alert}>
            <Text style={styles.alertText}>{sendAlerttext}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.guardianBox}>
          <Text style={styles.guardianTitle}>Your Guardians:</Text>
          <FlatList
            data={guardians}
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
                    source={require("../../assets/guardian.png")}
                    alt="logo"
                  />
                  <View
                    style={{
                      display: "flex",
                      paddingLeft: 10,
                      flexDirection: "column",
                    }}
                  >
                    <Text>{item.name}</Text>
                    <Text>{item.email}</Text>
                  </View>
                </View>
                <TouchableOpacity onLongPress={() => removeGuardian(index)}>
                  <Icon name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.btnBox}>
            <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
              <Text style={styles.addButtonText}>
                <Icon name="add-outline" size={40} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{ textAlign: "right", width: "100%" }}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={30} color="black" />
            </Text>
            <Text style={styles.modalTitle}>Add Guardian</Text>

            <ScrollView style={{width:'100%'}}>
            {allGuardians && allGuardians.map((e, index) => (
              <TouchableOpacity
                onPress={() => addGuardian(e)}
                key={index}
                style={styles.garitem}
              >
                <Image
                  source={require("../../assets/guardian.png")}
                  alt="logo"
                />
                <View
                  style={{
                    display: "flex",
                    paddingLeft: 10,
                    flexDirection: "column",
                  }}
                >
                  <Text>{e.name}</Text>
                  <Text>{e.email}</Text>
                </View>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        </View>
        </Modal>
        {/* <Location /> */}
      <AlertComponent
        showAlert={showAlert}
        alertType={alertType}
        onResolve={handleResolve}
        cancelWomanModel={cancelModel}
      />
      <Footer pro="womanaccount" hom="womanhome" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 16,
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
    backgroundColor: colors.womanPrimary,
    top: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  garitem: {
    width: "100%",
    display: "flex",
    padding: 5,
    marginTop: 5,
    gap: 5,
    flexDirection: "row",
    borderWidth: 0.1,
    borderRadius: 10,
    backgroundColor: "white"
  },
  alertBox: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  alert: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  alertText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
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
    width: 60,
    height: 60,
    borderRadius: 50,
    // borderWidth: 1,
    borderColor: "gray",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "100%",
    height: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
