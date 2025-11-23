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
import { Link } from "expo-router"; // Expo Router Link

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

 
  const [secure, setSecure] = useState(true);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validateUsername = (username: string) => username.trim().length >= 3;
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

    const newUser: User = { email: email.trim(), username: username.trim(), password };

    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = raw ? JSON.parse(raw) : [];

      const exists = users.find((u) => u.email === newUser.email);
      if (exists) {
        return Alert.alert("Email Taken", "This email is already registered.");
      }

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
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
    isPassword = false
  ) => (
    <View
      style={[
        styles.inputBox,
        (isPassword && passwordError) ||
        (!isPassword && ((placeholder === "Email" && emailError) || (placeholder === "Username" && usernameError)))
          ? styles.errorBorder
          : null,
      ]}
    >
      <Icon name={iconName} size={18} style={styles.leftIcon} />
      <TextInput
        style={styles.inputField}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword ? secure : false}
        autoCapitalize="none"
      />

      {isPassword && (
        <TouchableOpacity
          onPress={() => setSecure((s) => !s)}
          activeOpacity={0.8}
          style={styles.showBtnWrap}
        >
          <Text style={styles.showBtnText}>{secure ? "Show" : "Hide"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      
      <Text style={styles.label}>Email</Text>
      {renderInput("envelope", "Email", email, setEmail)}
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      
      <Text style={[styles.label, { marginTop: 8 }]}>Username</Text>
      {renderInput("user", "Username", username, setUsername)}
      {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

      
      <Text style={[styles.label, { marginTop: 8 }]}>Password</Text>
      {renderInput("lock", "Password", password, setPassword, true)}
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      
      <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.9}>
        <Text style={styles.buttonText}>
          <Icon name="user-plus" size={16} color="#fff" />  Register
        </Text>
      </TouchableOpacity>

      
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
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },

  
  label: {
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 6,
  },

  
  inputBox: {
    position: "relative",
    width: "100%",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b2433", // visible box background
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ff3e6c",
    paddingVertical: 12,
    paddingLeft: 44, 
    paddingRight: 50,
    height: 50,
  },
  leftIcon: {
    position: "absolute",
    left: 14,
    fontSize: 18,
    color: "#fff",
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    padding: 0,
    margin: 0,
  },

 
  showBtnWrap: {
    position: "absolute",
    right: 7,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  showBtnText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },

 
  error: {
    color: "#fb7185",
    marginBottom: 8,
    fontSize: 13,
  },
  errorBorder: {
    borderColor: "#fb7185",
  },

 
  button: {
    backgroundColor: "#ff3e6c",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  small: {
    color: "#94a3b8",
    fontSize: 14,
  },
  link: {
    color: "#ff3e6c",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
});
