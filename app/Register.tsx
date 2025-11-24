import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IconInput from "@/components/IconInput";
import PrimaryButton from "@/components/PrimaryButton";
import RowLink from "@/components/RowLink";
import { FontAwesome } from "@expo/vector-icons";

interface User {
  email: string;
  username: string;
  password: string;
}

const USERS_KEY = "users_v1";
const LOGGED_IN_KEY = "loggedInUser_v1";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [secure, setSecure] = useState(true);

  const [emailErr, setEmailErr] = useState("");
  const [userErr, setUserErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const validate = () => {
    let ok = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailErr("Please enter a valid email.");
      ok = false;
    } else setEmailErr("");

    if (username.trim().length < 3) {
      setUserErr("Username must be 3+ characters.");
      ok = false;
    } else setUserErr("");

    if (password.length < 6) {
      setPassErr("Password must be at least 6 characters.");
      ok = false;
    } else setPassErr("");

    return ok;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const newUser: User = {
      email: email.trim(),
      username: username.trim(),
      password,
    };

    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = raw ? JSON.parse(raw) : [];

      const exists = users.find((u) => u.email === newUser.email);
      if (exists) {
        return Alert.alert("Email Taken", "This email is already registered.");
      }

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      await AsyncStorage.setItem(LOGGED_IN_KEY, JSON.stringify(newUser));

      
      window.location.href = "/Notes";

    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      
      <IconInput
        label="Email"
        placeholder="Enter email"
        icon="envelope"
        value={email}
        onChangeText={setEmail}
        error={emailErr}
      />

      
      <IconInput
        label="Username"
        placeholder="Enter username"
        icon="user"
        value={username}
        onChangeText={setUsername}
        error={userErr}
      />

      
      <IconInput
        label="Password"
        placeholder="Enter password"
        icon="lock"
        secure={secure}
        value={password}
        onChangeText={setPassword}
        error={passErr}
        rightElement={
          <TouchableOpacity onPress={() => setSecure((s) => !s)}>
            <Text style={styles.showBtn}>{secure ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        }
      />

     
      <PrimaryButton text="Register" onPress={handleRegister} />

     
      <RowLink text="Already have an account? " linkText="Login" href="/login" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1724",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  showBtn: {
    color: "#fff",
    fontSize: 12,
    marginRight: -39,
  },
});
