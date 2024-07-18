import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Footer from "../../components/Footer";
import { colors } from "../../globelStyle";
import { Guardian, logout } from "../../Apis/GuardianApiHandler";
import { UpdateProfile } from "../../Apis/GuardianApiHandler";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const ProfileScreen = () => {
  const navigater = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(Guardian.name || "Guardian");
  const [email, setEmail] = useState(Guardian.email || "guardian@example.com");

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handelCloseModel = () => {
    setModalVisible(false);
  };

  const handleProfileUpdate = async () => {
    const updatepro = await UpdateProfile(name, email);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    await logout();
    navigater.navigate("start");
  };

  return (
    <>
      <View style={styles.bgDesign}></View>
      <View style={styles.container}>
        <View style={styles.innercon}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "column",
                marginTop: 15,
                alignItems: "center",
              }}
            >
              <Avatar.Image
                source={require("../../assets/guardian.png")}
                size={80}
              />
              <View style={{ marginLeft: 20 }}>
                <Title
                  style={[
                    styles.title,
                    { textAlign: "center", marginTop: 15, marginBottom: 5 },
                  ]}
                >
                  {name}
                </Title>
                <Caption style={[styles.caption,{textAlign:'center'}]}>{email}</Caption>
              </View>
            </View>
          </View>

          <TouchableRipple onPress={handleEditProfile}>
            <View style={styles.button}>
              <Text>Edit Profile</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={handleLogout}>
            <View style={styles.button}>
              <Text>Logout</Text>
            </View>
          </TouchableRipple>

          {/* Modal for editing profile */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                onPress={handelCloseModel}
                  style={{
                    textAlign: "right",
                    width: "100%",
                    paddingBottom: "10%",
                  }}
                >
                  <Text style={{textAlign:'right'}}><Icon name="close" size={30} color="black" /></Text>
                </TouchableOpacity>
                <Text>Edit Profile</Text>
                <TextInput
                  placeholder="Enter Name"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  placeholder="Enter Email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colors.guardianPrimary },
                  ]}
                  onPress={handleProfileUpdate}
                >
                  <Text style={styles.textStyle}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <Footer pro="guardianaccount" hom="guardianhome" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "start",
    alignItems: "center",
    position: "relative",
  },
  innercon: {
    marginTop: 80,
    width: "90%",
    borderRadius: 30,
    padding: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
  userInfoSection: {
    paddingRight: 10,
    marginBottom: 25,
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  button: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  // Modal styles
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderBottomWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProfileScreen;
