import { StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from './screens/StartScreen'

import WomanRegister from "./screens/woman/Registration";
import Womanlogin from "./screens/woman/Login";
import WomanHome from './screens/woman/womanHome'
import WomanProfile from './screens/woman/UserAccount'

import GuardianRegistarion from "./screens/guardian/registraion";
import guardianlogin from "./screens/guardian/Login";
import GuardianHome from './screens/guardian/guardianHome'
import GuardianProfile from './screens/guardian/UserAccount'

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <>
    <StatusBar barStyle="dark-content" hidden={false} />
    <NavigationContainer initialRouteName="start">
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            // backgroundColor: "#3b82f6",
          },
          // headerTintColor: "#ffffff",
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="start"
          component={StartScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="womanreg"
          component={WomanRegister}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="womanlogin"
          component={Womanlogin}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="guardianreg"
          component={GuardianRegistarion}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="guardianlogin"
          component={guardianlogin}
        />
        <Stack.Screen
        options={{ headerShown: false }}
          name="womanhome"
          component={WomanHome}
        />
        <Stack.Screen
        options={{ headerShown: false }}
          name="womanaccount"
          component={WomanProfile}
        />
        <Stack.Screen
         options={{ headerShown: false }}
          name="guardianhome"
          component={GuardianHome}
        />
        <Stack.Screen
         options={{ headerShown: false }}
          name="guardianaccount"
          component={GuardianProfile}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}
