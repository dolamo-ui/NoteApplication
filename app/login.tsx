import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router"; // Link for navigation

type RootStackParamList = {
  Login: undefined;
  Notes: undefined;
  Register: undefined;
};

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, "Login">;

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

  const handleSubmit = () => {
    setTouched(true);
    if (!isValid) {
      Alert.alert(
        "Invalid credentials",
        "Please enter a valid email and a password of at least 6 characters."
      );
      return;
    }
    navigation.navigate("Notes");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome — Notes</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <FontAwesome
            name="envelope"
            size={18}
            color="#94a3b8"
            style={styles.icon}
          />
          <TextInput
            style={[
              styles.input,
              touched && !validateEmail(email) ? styles.inputError : undefined,
            ]}
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
        <View style={styles.passwordRow}>
          <View style={styles.inputRow}>
            <FontAwesome
              name="lock"
              size={18}
              color="#94a3b8"
              style={styles.icon}
            />
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                touched && password.length < 6 ? styles.inputError : undefined,
              ]}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(true)}
            />
          </View>
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => setSecure((s) => !s)}
            accessibilityLabel={secure ? "Show password" : "Hide password"}
          >
            <Text style={styles.toggleText}>{secure ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        </View>
        {touched && password.length < 6 && (
          <Text style={styles.errorText}>
            Password must be at least 6 characters.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Reset password", "Password reset flow not implemented.")
        }
      >
        <Text style={styles.forgot}>Forgot password?</Text>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { color: "#fff", fontSize: 22, marginBottom: 20, fontWeight: "600" },
  form: { width: "100%", marginBottom: 18 },
  label: { color: "#cbd5e1", fontSize: 13, marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0b1220",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff3e6c",
  },
  icon: { paddingHorizontal: 10 },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 12,
    borderColor: "#ff3e6c",
    paddingHorizontal: 10,
    fontSize: 15,
  },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1 },
  toggle: { paddingHorizontal: 10, paddingVertical: 8 },
  toggleText: { color: "#ff3e6c", fontWeight: "600" },
  button: {
    backgroundColor: "#ff3e6c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  forgot: { color: "#94a3b8", marginTop: 12 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 18 },
  small: { color: "#94a3b8" },
  link: { color: "#ff3e6c", fontWeight: "600" },
  errorText: { color: "#fb7185", marginTop: 6, fontSize: 13 },
  inputError: { borderColor: "#fb7185" },
});
