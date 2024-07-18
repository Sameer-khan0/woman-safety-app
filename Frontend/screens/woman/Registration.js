// Registration.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Styles, colors } from "../../globelStyle";
import { useNavigation } from "@react-navigation/native";
import {
  registerWoman,
  fetchallGuardians,
  CheckWomanToken,
} from "../../Apis/WomanApiHandler";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Registration = () => {
  const [expoPushToken, setExpoPushToken] = useState("none");
  const [registerError, serRegisterError] = useState("");
  const [Registerbtnv, setRegisterbtnv] = useState("Register");
  const [dataFound, setdataFound] = useState("Fetching...");
  const [guardians, setGuardians] = useState([]);
  const [guardian, setGuardian] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [seleted, setSelected] = useState(false);
  const navigator = useNavigation();

  
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;
        setExpoPushToken(token);
      } catch (error) {
        console.error('Error getting push token:', error);
        alert('Failed to get push token for push notification!');
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const tokenExists = await CheckWomanToken();
      if (tokenExists) return navigator.navigate("womanhome");
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      const fetchGuardians = async () => {
        try {
          const guardians = await fetchallGuardians();
          if (guardians && guardians.message.length > 0) {
            setGuardians(guardians.message);
          } else {
            ToastNotifier.
            setGuardians([]);
            setdataFound("No Guardian found");
          }
        } catch (error) {
          console.error("Error fetching guardians:", error);
          setdataFound("Error fetching guardians");
        }
      };

      fetchGuardians();
    }
  }, [isModalVisible]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setRegisterbtnv("Loading...");
    const isRegester = await registerWoman(
      data.name,
      data.email,
      data.password,
      data.address,
      data.phoneNumber,
      guardian._id,
      expoPushToken
    );
    setRegisterbtnv("Register");
    if (isRegester) return navigator.navigate("womanlogin");
    else{
      Alert.alert("Invalid Email or Password or something went wrong try again ")
    }
  };

  const selectGuardian = (guardian) => {
    setGuardian(guardian);
    setSelected(true);
    setIsModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Controller
        control={control}
        name="address"
        rules={{ required: "Address is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.address && (
        <Text style={styles.error}>{errors.address.message}</Text>
      )}

      <Controller
        control={control}
        name="phoneNumber"
        rules={{ required: "Phone number is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={onChange}
            value={value}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phoneNumber && (
        <Text style={styles.error}>{errors.phoneNumber.message}</Text>
      )}

      <Controller
        control={control}
        name="guardian"
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={{ color: seleted ? "green" : "black" }}>
              {guardian ? guardian.name : "Select Guardian"}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Guardian</Text>
          {guardians.length > 0 ? (
            <FlatList
              data={guardians}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectGuardian(item)}
                >
                  <View>
                    <Image
                      source={require("../../assets/guardian.png")}
                      alt="image"
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 17 }}>{item.name}</Text>
                    <Text style={{ fontSize: 13 }}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={{ height: "80%" }}>
              <Text>{dataFound}</Text>
            </View>
          )}
          <Button title="Close" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={styles.registerButton}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {Registerbtnv}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigator.navigate("womanlogin")}
        style={styles.loginButton}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>
      {registerError && <Text style={styles.error}>{registerError}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  pickerButtonText: {
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  modeview: {
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
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 18,
  },
  registerButton: {
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.womanPrimary,
  },
  loginButton: {
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray,
  },
});

export default Registration;
