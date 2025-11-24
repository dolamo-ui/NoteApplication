import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
    text: string;
    disabled?: boolean;
    onPress: () => void;
}

export default function PrimaryButton({ text, disabled, onPress}: Props) {
    return (
      <TouchableOpacity
         onPress={onPress}
         style={[styles.button, disabled && styles.disabled]}
         disabled={disabled}
        >
         
          <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
   button: {
     backgroundColor: "#ff3e6c",
     paddingVertical: 14,
     width: "100%",
     borderRadius: 30,
     alignItems: "center",
     marginTop: 10,
   },
   disabled: {
      opacity: 0.5,
   },
   buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
   }
});