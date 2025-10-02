import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FBCBC9",
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 8,
          paddingTop:8
        },
        tabBarActiveTintColor: "#040305",
        tabBarInactiveTintColor: "#8F8AA6",
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddImportantExpenseScreen"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="TransactionsScreen"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="PlaidLinkScreen"
        options={{
          href: null, 
        }}
      />

      <Tabs.Screen
        name="AccountSelectionScreen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
