import { Text, View, Pressable, Keyboard, Alert } from "react-native";
import Modal from "react-native-modal";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import GetWeather from "./getWeather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles, stylesModal } from "../styles/CalendarStyle";
import eventBus from "../constants/EventBus";
import EventForm from "./EventForm";
import { MESSAGE } from "../constants/messages";

const oneWeekLater = new Date();
oneWeekLater.setDate(oneWeekLater.getDate() + 6);

export default function CalendarF() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  const resetState = () => {
    setTitle("");
    setStartDate(new Date());
    setEndDate(new Date());
    setMemo("");
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (!isModalVisible) {
      resetState();
    }
  };

  const handleDateChange = (isStartDate, event, selectedDate) => {
    if (selectedDate) {
      const selectedTime = new Date(selectedDate).getTime();

      const today = new Date();
      today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정
      const todayTime = today.getTime();
      const oneWeekLaterTime = oneWeekLater.getTime();

      if (selectedTime < todayTime || selectedTime >= oneWeekLaterTime) {
        Alert.alert(MESSAGE.INVALID_DATE);
        return;
      } else {
        if (isStartDate) {
          setStartDate(selectedDate);
        } else {
          setEndDate(selectedDate);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(MESSAGE.INPUT_TITLE);
      return;
    }
    const newEvent = {
      title,
      startDate,
      endDate,
      memo,
    };
    try {
      const storedEvents = await AsyncStorage.getItem("eventsArray");
      const updatedEventsArray = storedEvents ? JSON.parse(storedEvents) : [];
      updatedEventsArray.push(newEvent);
      await AsyncStorage.setItem(
        "eventsArray",
        JSON.stringify(updatedEventsArray)
      );
      eventBus.emit("newEventAdded", newEvent);
      toggleModal();
      Alert.alert(MESSAGE.HEADER, MESSAGE.ADD_SUCCESS);
      resetState();
    } catch (error) {
      console.error(error);
      Alert.alert(MESSAGE.HEADER, MESSAGE.ADD_FAILED);
    } finally {
      resetState();
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        minDate={today.toISOString().split("T")[0]}
        maxDate={
          new Date(today.setDate(today.getDate() + 6))
            .toISOString()
            .split("T")[0]
        }
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          toggleModal();
        }}
      />

      <Modal isVisible={isModalVisible}>
        <Pressable onPress={Keyboard.dismiss} style={stylesModal.container}>
          <Text style={stylesModal.headerFont}>일정 등록</Text>
          <EventForm
            title={title}
            setTitle={setTitle}
            startDate={startDate}
            endDate={endDate}
            oneWeekLater={oneWeekLater}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            memo={memo}
            setMemo={setMemo}
            handleSubmit={handleSubmit}
            handleDateChange={handleDateChange}
            toggleModal={toggleModal}
          />
        </Pressable>
      </Modal>

      {selectedDate && <GetWeather selectedDate={selectedDate} />}
    </View>
  );
}
