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
import Icon from "react-native-vector-icons/Ionicons";
import { logout, UpdateProfile, Woman } from "../../Apis/WomanApiHandler";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(Woman.name || "Jhon");
  const [email, setEmail] = useState(Woman.email || "woman@example.com");
  const [phone, setPhone] = useState(Woman.phone || "+111 111 111");
  const [address, setAddress] = useState(Woman.address || "123 Guardian Ave, Guardian City");

  const handleLogout = async () => {
    await logout();
    navigation.navigate("start");
  };

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleProfileUpdate = async () => {
    const updateProfile = await UpdateProfile(name, email, phone, address);
    setModalVisible(false);
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
                source={require("../../assets/woman.png")}
                size={80}
              />
              <View style={{ marginLeft: 20 }}>
                <Title
                  style={[styles.title, { marginTop: 15, marginBottom: 5, textAlign: 'center' }]}
                >
                  {name}
                </Title>
                <Caption style={[styles.caption,{textAlign:'center'}]}>{email}</Caption>
              </View>
            </View>
          </View>

          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Text style={{ color: "#777777", marginRight: 8 }}>Email:</Text>
              <Text style={{ color: "#777777" }}>{email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: "#777777", marginRight: 8 }}>Phone:</Text>
              <Text style={{ color: "#777777" }}>{phone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: "#777777", marginRight: 8 }}>Address:</Text>
              <Text style={{ color: "#777777" }}>{address}</Text>
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
                  onPress={() => setModalVisible(false)}
                  style={{
                    textAlign: "right",
                    width: "100%",
                    paddingBottom: "10%",
                  }}
                >
                  <Text style={{ textAlign: "right" }}>
                    <Icon name="close" size={30} color="black" />
                  </Text>
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
                <TextInput
                  placeholder="Enter Phone"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                />
                <TextInput
                  placeholder="Enter Address"
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
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
      <Footer pro="womanaccount" hom="womanhome" />
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
    backgroundColor: colors.womanPrimary,
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
  row: {
    flexDirection: "row",
    marginBottom: 10,
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
