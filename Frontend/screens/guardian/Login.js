// Registration.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useForm, Controller } from "react-hook-form";
import { Styles,colors } from "../../globelStyle";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../Apis/GuardianApiHandler";

const Login = () => {
  const [loginbtnv,setloginbtnv] = useState("Login")
  const navigator = useNavigation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setloginbtnv('Loading...')
    const isLogin = await loginUser(data.email,data.password)
    setloginbtnv('Login')
    if(isLogin) return navigator.navigate("guardianhome");
    else{
      Alert.alert("Invalid Email or Password or something went wrong try again ")
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>

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
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.Loginbutton}>
        <Text style={{color:'white',fontWeight:"bold"}}>{loginbtnv}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigator.navigate('guardianreg')} style={styles.registerbtn}>
        <Text style={{color:'white',fontWeight:"bold"}}>Register</Text>
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
  registerbtn: {
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray,
  },
  Loginbutton: {
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.guardianPrimary,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    color: "black",
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    color: "black",
  }
});

export default Login;
