// Registration.js
import React,{ useState ,useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useForm, Controller } from "react-hook-form";
import { colors } from "../../globelStyle";
import { useNavigation } from "@react-navigation/native";
import { registerGuardian , CheckGuardianToken  } from "../../Apis/GuardianApiHandler";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const WRegistration = () => {
  const [expoPushToken, setExpoPushToken] = useState("none");
  const [registerError,serRegisterError] = useState("")
  const [Registerbtnv,setRegisterbtnv] = useState("Register")
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
      const tokenExists = await CheckGuardianToken();
      if(tokenExists) return navigator.navigate("guardianhome");
    };

    checkToken();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setRegisterbtnv("Loading...")
    const isRegester = await registerGuardian(data.name,data.email,data.password,expoPushToken)
    setRegisterbtnv("Register")
    if(isRegester) return navigator.navigate("guardianlogin");
    else{
      Alert.alert("Invalid Email or Password or something went wrong try again ")
    }
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

      <TouchableOpacity
        style={styles.Registerbutton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>{Registerbtnv}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigator.navigate("guardianlogin")}
        style={styles.loginbutton}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>
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
  loginbutton: {
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray,
  },
  Registerbutton: {
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.guardianPrimary,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    color: "black",
  },
});

export default WRegistration;
