import React, { useState } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router"; // ✅ Expo Router Link

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Notes: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface User {
  email: string;
  username: string;
  password: string;
}

const USERS_KEY = "users_v1";
const LOGGED_IN_KEY = "loggedInUser_v1";

const Register = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validateUsername = (username: string) => username.length >= 3;
  const validatePassword = (password: string) => password.length >= 6;

  const handleRegister = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      valid = false;
    } else setEmailError("");

    if (!validateUsername(username)) {
      setUsernameError("Username must be at least 3 characters.");
      valid = false;
    } else setUsernameError("");

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else setPasswordError("");

    if (!valid) return;

    const newUser: User = { email, username, password };

    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = raw ? JSON.parse(raw) : [];

      const exists = users.find((u) => u.email === email.trim());
      if (exists) {
        return Alert.alert("Email Taken", "This email is already registered.");
      }

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify([...users, newUser])
      );
      await AsyncStorage.setItem(LOGGED_IN_KEY, JSON.stringify(newUser));
      navigation.navigate("Notes");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while saving your account.");
    }
  };

  const renderInput = (
    iconName: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry = false
  ) => (
    <View style={styles.inputContainer}>
      <Icon name={iconName} size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.inputWithIcon}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Email */}
      {renderInput("envelope", "Email", email, setEmail)}
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      {/* Username */}
      {renderInput("user", "Username", username, setUsername)}
      {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

      {/* Password */}
      {renderInput("lock", "Password", password, setPassword, true)}
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
          <Icon name="user-plus" size={18} color="#fff" /> Register
        </Text>
      </TouchableOpacity>

      {/* REGISTER LINK using Expo Router */}
      <View style={styles.row}>
        <Text style={styles.small}>Already have an account? </Text>
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0f1724",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#ff3e6c",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  small: {
    color: "#fff",
    fontSize: 14,
  },
  link: {
    color: "#ff3e6c",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
});
