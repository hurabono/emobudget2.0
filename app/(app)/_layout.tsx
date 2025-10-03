import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F7DFE0",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 0,
          paddingTop:10
        },
        tabBarActiveTintColor: "#79758E",
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
