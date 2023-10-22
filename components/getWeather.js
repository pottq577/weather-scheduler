import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";
import { styles } from "../styles/GetWeather";
import API from "../constants/API_KEY";

const API_KEY = API;

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function getWeather({
  selectedDate,
  dateRange,
  setSelectedDate,
}) {
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

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const pageIndex = Math.round(offsetX / SCREEN_WIDTH);

    if (days[pageIndex]) {
      const selectedDay = days[pageIndex];
      const date = new Date(selectedDay.dt * 1000);
      const dateString = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      setSelectedDate(dateString);
    }
  };

  useEffect(() => {
    getWeather();
  }, [selectedDate]);

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
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {days.length === 0 ? (
          // 날씨 정보를 불러오는 중일 때 인디케이터 출력
          <View style={{ ...styles.day, alignItems: "center" }}>
            {/* 로딩 인디케이터 */}
            <ActivityIndicator color="blue" size="large" />
          </View>
        ) : (
          days.map((day, index) => {
            return (
              <View key={index} style={styles.day}>
                <View style={styles.weather}>
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Fontisto
                    name={icons[day.weather[0].main]}
                    size={70}
                  ></Fontisto>
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>
                  {day.weather[0].description}
                </Text>
                <Text style={styles.range}>
                  {parseFloat(day.temp.min).toFixed(1)}°C {" ~ "}
                  {parseFloat(day.temp.max).toFixed(1)}°C
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
