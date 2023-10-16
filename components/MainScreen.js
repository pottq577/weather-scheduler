import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Image } from "react-native";

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator initialRouteName="지도">
      <Tab.Screen
        name="현재 파티"
        component={CurrentParty}
        options={{
          tabBarActiveTintColor: "purple",
          tabBarLabelStyle: { fontWeight: "bold" },
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                style={{
                  ...styles.imageStyle,
                  tintColor: focused ? "#8000FF" : "black",
                }}
                source={require("../assets/network.png")}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 24,
    height: 24,
  },
});

export default MainScreen;
