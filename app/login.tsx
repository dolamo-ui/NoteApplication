import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import IconInput from "@/components/IconInput";
import PrimaryButton from "@/components/PrimaryButton";
import RowLink from "@/components/RowLink";

type RootStackParamList = {
  Login: undefined;
  Notes: undefined;
  Register: undefined;
};

type LoginScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface User {
  email: string;
  username: string;
  password: string;
}

const USERS_KEY = "users_v1";
const LOGGED_IN_KEY = "loggedInUser_v1";

export default function Login() {
  const navigation = useNavigation<LoginScreenProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  
  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  useEffect(() => {
    setIsValid(validateEmail(email) && password.length >= 6);
  }, [email, password]);

  
  const handleSubmit = async () => {
    setTouched(true);

    if (!isValid) {
      Alert.alert(
        "Invalid credentials",
        "Please enter a valid email and a password with at least 6 characters."
      );
      return;
    }

    try {
      const rawUsers = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];

      if (users.length === 0) {
        Alert.alert("No Users Found", "Please create an account first.");
        return;
      }

      const matchedUser = users.find(
        (u) => u.email === email.trim() && u.password === password
      );

      if (matchedUser) {
        await AsyncStorage.setItem(
          LOGGED_IN_KEY,
          JSON.stringify(matchedUser)
        );
        Alert.alert("Success", "Logged in successfully!");

        navigation.navigate("Notes");
      } else {
        Alert.alert("Error", "Email or password is incorrect.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while logging in.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome — Notes</Text>

     
      <IconInput
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setTouched(true)}
        icon="envelope"
        error={
          touched && !validateEmail(email)
            ? "Enter a valid email address."
            : ""
        }
      />

      
      <IconInput
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        onBlur={() => setTouched(true)}
        secure={secure}
        icon="lock"
        error={
          touched && password.length < 6
            ? "Password must be at least 6 characters."
            : ""
        }
        rightElement={
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Text style={styles.showBtn}>{secure ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        }
      />

      
      <PrimaryButton text="Login" onPress={handleSubmit} disabled={!isValid} />

      
      <RowLink
        text="Don't have an account? "
        linkText="Sign Up"
        href="/Register"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1724",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 25,
  },
  showBtn: {
    color: "#fff",
    fontSize: 12,
    marginRight: -35,
  },
});
