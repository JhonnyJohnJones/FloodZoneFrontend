import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import ProfileScreen from "../app/(tabs)/profile";
import MapScreen from "../app/(tabs)/index";
import MakeReport from "../app/(tabs)/make-report";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="home" component={MapScreen} />
      <Tab.Screen name="perfil" component={ProfileScreen} />
      <Tab.Screen name="make-report" component={MakeReport} />
    </Tab.Navigator>
  );
}
