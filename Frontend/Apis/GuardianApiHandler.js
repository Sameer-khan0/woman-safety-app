import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// const baseURL = "https://b717-103-137-24-100.ngrok-free.app";
const baseURL = "https://women-saftey-app.vercel.app";

const Guardian = { name: "", email: "" };
const AlertId = { id: "" }


const CheckGuardianToken = async () => {
  try {
    const token = await AsyncStorage.getItem('Gtoken');
    console.log(token);
    return token !== null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return false;
  }
}


const api = axios.create({
  baseURL,
});

const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("Gtoken", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

const registerGuardian = async (name, email, password, notificationToken) => {
  try {
    const response = await api.post("/api/v1/guardians/register-guardian", {
      email,
      password,
      name,
      notificationToken
    });
    if (response.data.success) {
      const { guardian } = response.data.data;
      Guardian.name = guardian.name;
      Guardian.email = guardian.email;
      return true;
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/v1/guardians/login-guardian", {
      email,
      password,
    });
    if (response.data.success) {
      const { accessToken, user } = response.data.message;
      Guardian.name = user.name;
      Guardian.email = user.email;
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
  const token = await AsyncStorage.getItem("Gtoken");
  try {
    if (!token) return false;
    await AsyncStorage.removeItem("Gtoken");
    console.log("Token removed successfully");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

const fetchGuardiansWomans = async () => {
  const token = await AsyncStorage.getItem("Gtoken");
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await api.get("/api/v1/guardians/guardian-women", {
      headers: headers,
    });
    return response.data.message;
  } catch (error) {
    console.error(error);
  }
};

const UpdateProfile = async (name, email) => {
  const token = await AsyncStorage.getItem("Gtoken");
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const response = await api.patch(
      "/api/v1/guardians/update-guardian-profile",
      { name, email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const checkAlertStatus = async () => {
  try {
    const token = await AsyncStorage.getItem("Gtoken");
    if (!token) {
      throw new Error("No token found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await api.get("/api/v1/alerts/check-alert", {
      headers: headers,
    });

    if (response.status === 200) {
      AlertId.id = response.data.data.alertId
      return response;
    }
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
    const token = await AsyncStorage.getItem("Gtoken");
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
          alertId: AlertId.id
        }
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

export {
  registerGuardian,
  loginUser,
  UpdateProfile,
  logout,
  checkAlertStatus,
  DeleteAlert,
  fetchGuardiansWomans,
  CheckGuardianToken,
  Guardian,
};
