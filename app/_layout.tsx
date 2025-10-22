import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#080808ff",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "list";
          if (route.name === "index") iconName = "restaurant";
          else if (route.name === "edit") iconName = "add-circle";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Menu" }} />
      <Tabs.Screen name="edit" options={{ title: "Add Meal" }} />
    </Tabs>
  );
}
