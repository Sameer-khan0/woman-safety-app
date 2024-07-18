import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// const baseURL = "https://b717-103-137-24-100.ngrok-free.app";
const baseURL = "https://women-saftey-app.vercel.app";

const Woman = { name: "", email: "", address: "", phone: "", id: "" };
const Alertid = { id: "" };
const GuardiansIds = []

const api = axios.create({
  baseURL,
});

const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("Wtoken", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

const CheckWomanToken = async () => {
  try {
    const token = await AsyncStorage.getItem('Wtoken');
    return token !== null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return false;
  }
}

// "name": "Kafeela",
//     "email": "Kafeela@gmail.com",
//     "password": "Kafeela",
//     "address": "shiday k dil main",
//     "phnumber": "1231231231",
//     "guardianId": "667bc41731fbcc196e398530"

const registerWoman = async (
  name,
  email,
  password,
  address,
  phnumber,
  guardianId,
  notificationToken
) => {
  try {
    const response = await api.post("/api/v1/women/register-women", {
      email,
      password,
      name,
      address,
      phnumber,
      guardianId,
      notificationToken
    });
    if (response.data.success) {
      const { user } = response.data.data;
      Woman.name = user.name;
      Woman.email = user.email;
      Woman.address = user.address;
      Woman.phone = user.phnumber;
      Woman.id = user._id;
      return true;
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/v1/women/login-women", {
      email,
      password,
    });
    if (response.data.success) {
      const { accessToken, user } = response.data.message;
      Woman.name = user.name;
      Woman.email = user.email;
      Woman.address = user.address;
      Woman.phone = user.phnumber;
      Woman.id = user._id;
      if (!accessToken) {
        return;
      }
      await storeToken(accessToken);
      return true;
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

const logout = async () => {
  const token = await AsyncStorage.getItem("Wtoken");
  try {
    if (!token) return false;
    await AsyncStorage.removeItem("Wtoken");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

const fetchWomanGuardians = async () => {
  const token = await AsyncStorage.getItem("Wtoken");
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await api.get("/api/v1/women/woman-guardian", {
      headers: headers,
    });
    const Guardiansid = response.data.message
    if(Guardiansid){
      for (let i=0;i<Guardiansid.length;i++){
        if(!GuardiansIds.includes(Guardiansid[i]._id)){
          GuardiansIds.push(Guardiansid[i]._id)
        }
    }}
    return response.data.message;
  } catch (error) {
    console.error(error);
  }
};

const SentGuardianAlert = async (latitude, longitude, guardianId) => {
  const token = await AsyncStorage.getItem("Wtoken");
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await api.post(
      "/api/v1/alerts/add-alert",
      {
        latitude,
        longitude,
        alerttype: "ambulance",
        guardianIds: GuardiansIds,
      },
      {
        headers: headers,
      }
    );
    const id=response.data.data.alertId
    Alertid.id = id;
    return response.data.success;
  } catch (error) {
    console.error(error);
  }
};

const fetchallGuardians = async () => {
  try {
    const response = await api.get("/api/v1/guardians/get-all-guardian");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const UpdateProfile = async (name, email, phnumber, address) => {
  const token = await AsyncStorage.getItem("Wtoken");
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const response = await api.patch(
      "/api/v1/women/update-profile",
      { name, email, address, phnumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : error.message;
  }
};

const AddGuardian = async (guardianId) => {
  try {
    const token = await AsyncStorage.getItem("Wtoken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.post(
      "/api/v1/women/add-guardian",
      { guardianId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("API Error:", error.response.data);
      throw error.response.data;
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

const DeleteAlert = async () => {
  try {
    console.log(Alertid.id);
    const token = await AsyncStorage.getItem("Wtoken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.delete(
      "/api/v1/alerts/delete-alert",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          alertId: Alertid.id
        }
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("API Error:", error.response.data);
      throw error.response.data;
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};


export {
  registerWoman,
  loginUser,
  UpdateProfile,
  logout,
  AddGuardian,
  fetchWomanGuardians,
  fetchallGuardians,
  SentGuardianAlert,
  DeleteAlert,
  CheckWomanToken,
  Woman,
};
