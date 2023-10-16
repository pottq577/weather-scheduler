import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "3b25e4f9b711556032344fe13a633314";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function getWeather({ selectedDate }) {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, [selectedDate]);
  const today = new Date();
  const todayString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      {/* 현재 위치의 시 단위 위치 표시 뷰*/}
      <View style={styles.city}>
        <Text style={styles.text}>{selectedDate}</Text>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      {/* 날씨 표시 뷰 */}
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          // 날씨 정보를 불러오는 중일 때 인디케이터 출력
          <View style={{ ...styles.day, alignItems: "center" }}>
            {/* 로딩 인디케이터 */}
            <ActivityIndicator
              color="blue"
              size="large"
              style={{ marginTop: 150 }}
            ></ActivityIndicator>
          </View>
        ) : (
          days.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const dateString = `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`;
            if (dateString === selectedDate) {
              return (
                <View key={index} style={styles.day}>
                  <View style={styles.weather}>
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}
                    </Text>
                    <Fontisto
                      name={icons[day.weather[0].main]}
                      size={60}
                    ></Fontisto>
                  </View>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>
                    {day.weather[0].description}
                  </Text>
                </View>
              );
            }
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "grey",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
  },
  weather: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "violet",
    justifyContent: "space-between",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 40,
    backgroundColor: "green",
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 60,
  },
  description: {
    marginTop: -10,
    fontSize: 25,
    fontWeight: "500",
  },
  tinyText: {
    fontSize: 15,
    marginTop: -5,
    fontWeight: "500",
  },
});
