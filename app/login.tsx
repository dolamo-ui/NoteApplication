import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

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

  useEffect(() => {
    setIsValid(validateEmail(email) && password.length >= 6);
  }, [email, password]);

  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  const handleSubmit = async () => {
    setTouched(true);

    if (!isValid) {
      Alert.alert(
        "Invalid credentials",
        "Please enter a valid email and a password of at least 6 characters."
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

     
      <Text style={styles.label}>Email</Text>
      <View style={[styles.inputBox, touched && !validateEmail(email) ? styles.errorBorder : null]}>
        <FontAwesome name="envelope" style={styles.leftIcon} />
        <TextInput
          style={styles.inputField}
          placeholder="you@example.com"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched(true)}
        />
      </View>

      {touched && !validateEmail(email) && (
        <Text style={styles.errorText}>Enter a valid email address.</Text>
      )}

      
      <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
      <View style={[styles.inputBox, touched && password.length < 6 ? styles.errorBorder : null]}>
        <FontAwesome name="lock" style={styles.leftIcon} />

        <TextInput
          style={styles.inputField}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry={secure}
          value={password}
          onChangeText={setPassword}
          onBlur={() => setTouched(true)}
        />

        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Text style={styles.showBtn}>{secure ? "Show" : "Hide"}</Text>
        </TouchableOpacity>
      </View>

      {touched && password.length < 6 && (
        <Text style={styles.errorText}>
          Password must be at least 6 characters.
        </Text>
      )}

      
      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      
      <View style={styles.row}>
        <Text style={styles.small}>Don't have an account? </Text>
        <Link href="/Register" style={styles.link}>
          Sign Up
        </Link>
      </View>
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

  label: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 6,
  },

  inputBox: {
    position: "relative",
    width: "100%",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
   backgroundColor: "#1b2433", 
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ff3e6c",
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 45,
  },

  inputField: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },

  leftIcon: {
    position: "absolute",
    left: 14,
    fontSize: 18,
    color: "#fff",
  },

  showBtn: {
    position: "absolute",
    right: 1,
    top: -7,
    fontSize: 12,
    color: "#fff",
  },

  errorText: {
    color: "#fb7185",
    marginBottom: 10,
    fontSize: 13,
  },

  errorBorder: {
    borderColor: "#fb7185",
  },

  button: {
    backgroundColor: "#ff3e6c",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },

  small: {
    color: "#94a3b8",
  },

  link: {
    color: "#ff3e6c",
    fontWeight: "600",
  },
});
