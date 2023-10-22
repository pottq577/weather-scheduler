import { View } from "react-native";
import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import GetWeather from "./getWeather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/CalendarStyle";
import eventBus from "../constants/EventBus";

const COLORS = ["blue", "red", "yello", "black", "pink"];

const generateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];

  while (start <= end) {
    const month = (start.getMonth() + 1).toString().padStart(2, "0");
    const date = start.getDate().toString().padStart(2, "0");
    dateArray.push(`${start.getFullYear()}-${month}-${date}`);
    start.setDate(start.getDate() + 1);
  }

  return dateArray;
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getMaxDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 6);
  return today.toISOString().split("T")[0];
};

export default function CalendarF() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [dateRagnes, setDateRanges] = useState([]);

  const loadStoredEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("eventsArray");
      if (storedEvents) {
        const eventsArray = JSON.parse(storedEvents);
        eventsArray.forEach((event) => {
          const { startDate, endDate } = event;
          const dateRange = generateDateRange(startDate, endDate);
          const newMarkedDates = dateRange.reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: "blue" };
            return acc;
          }, {});
          setMarkedDates((prev) => ({
            ...prev,
            ...newMarkedDates,
          }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMarkedDatesColor = (events) => {
    let colors = [];

    events.forEach((event, index) => {
      const color = COLORS[index % COLORS.length];
      colors.push(color);
    });

    return colors;
  };

  const updateMarkings = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("eventsArray");
      if (storedEvents) {
        const eventsArray = JSON.parse(storedEvents);
        const allMarkedDates = {};

        eventsArray.forEach((event, index) => {
          const { startDate, endDate } = event;
          const dateRange = generateDateRange(startDate, endDate);
          const colors = getMarkedDatesColor(eventsArray);

          const newMarkedDates = dateRange.reduce((acc, date) => {
            acc[date] = {
              marked: true,
              dotColor: colors[index],
            };
            return acc;
          }, {});

          Object.assign(allMarkedDates, newMarkedDates);
        });
        setMarkedDates(allMarkedDates);
      } else {
        setMarkedDates({});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDateRange = async () => {
    let allDateRanges = [];

    try {
      const storedEvents = await AsyncStorage.getItem("eventsArray");
      if (storedEvents) {
        const eventsArray = JSON.parse(storedEvents);

        allDateRanges = eventsArray.map((event) => {
          const { startDate, endDate } = event;
          return generateDateRange(startDate, endDate);
        });
      }
    } catch (error) {
      console.error(error);
    }

    return allDateRanges;
  };

  useEffect(() => {
    loadStoredEvents();
    eventBus.on("newEventAdded", updateMarkings);
    eventBus.on("eventDeleted", updateMarkings);
    eventBus.on("eventEdited", updateMarkings);

    return () => {
      eventBus.off("newEventAdded", updateMarkings);
      eventBus.off("eventDeleted", updateMarkings);
      eventBus.off("eventEdited", updateMarkings);
    };
  }, []);

  useEffect(() => {
    const fetchDateRanges = async () => {
      const ranges = await getDateRange();
      setDateRanges(ranges);
    };

    fetchDateRanges();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        markingType="simple"
        minDate={getTodayDate()}
        maxDate={getMaxDate()}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      <GetWeather
        selectedDate={selectedDate}
        dateRange={dateRagnes}
        setSelectedDate={setSelectedDate}
      />
    </View>
  );
}
