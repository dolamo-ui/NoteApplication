import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

interface Props {
  text: string;
  linkText: string;
  href: string; 
}

export default function RowLink({ text, linkText, href }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.small}>{text}</Text>

      
      <Link href={href as any} style={styles.link}>
        {linkText}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
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
