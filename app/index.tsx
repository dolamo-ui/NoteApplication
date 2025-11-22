import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // fixed import
import Login from "./login";
import Register from "./Register";
import Notes from "./Notes";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }} // <- correctly placed
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Notes" component={Notes} />
    </Stack.Navigator>
  );
}
