import React from "react";
import { View, Text, TextInput, StyleSheet} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface IconInputProps {
    label: string;
    placeholder: string;
    value:string;
    onChangeText: (text: string) => void;
    onBlur?: ()=> void;
    icon: keyof typeof FontAwesome.glyphMap;
    secure?: boolean;
    error?: string;
    rightElement?: React.ReactNode;
}

export default function IconInput({
    label,
    placeholder,
    value,
    onChangeText,
    onBlur,
    icon,
    secure,
    error,
    rightElement,
}: IconInputProps) {
    return (
      <>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputBox, error ? styles.errorBorder : null]}>
         <FontAwesome name={icon} style={styles.leftIcon} />


         <TextInput
           style={styles.inputField}
           placeholder={placeholder}
           placeholderTextColor="#94a3b8"
           secureTextEntry={secure}
           value={value}
           onChangeText={onChangeText}
           onBlur={onBlur}
           autoCapitalize="none"
           />
           {rightElement}

      </View>
       
       {error && <Text style={styles.errorText}>{error}</Text>}
    </>
    );
}

const styles = StyleSheet.create({
    label: {
      color:"#cdb5e1",
      fontSize: 14,
      marginBottom: 6,
    },
    inputBox: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1b2433",
      borderRadius: 30,
      borderWidth: 2,
      borderColor: "#ff3e6c",
      paddingVertical: 12,
      paddingLeft: 40,
      paddingRight: 45,
      marginBottom:10,
    },
    leftIcon: {
      position:"absolute",
      left: 14,
      fontSize: 18,
      color: "#fff",
    },
    inputField: {
        flex: 1,
        color: "#fff",
        fontSize:15,
    },
    errorBorder: {
        borderColor: "#fb7185",
    },
    errorText: {
        color: "#fb7185",
        fontSize: 13,
        marginBottom: 10,
    },
});