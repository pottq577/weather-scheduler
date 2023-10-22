import React, { useState } from "react";
import { Pressable, Text, View, Alert, Keyboard } from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventForm from "../EventForm";
import eventBus from "../../constants/EventBus";
import { stylesModal } from "../../styles/Modal/AddStyle";
import { MESSAGE } from "../../constants/messages";

const oneWeekLater = new Date();
oneWeekLater.setDate(oneWeekLater.getDate() + 6);

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

export default function AddSchedule({ isModalVisible, toggleModal }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [memo, setMemo] = useState("");

  const resetState = () => {
    setTitle("");
    setStartDate(new Date());
    setEndDate(new Date());
    setMemo("");
  };

  const handleDateChange = (isStartDate, event, selectedDate) => {
    if (selectedDate) {
      const selectedTime = new Date(selectedDate).getTime();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      const oneWeekLaterTime = oneWeekLater.getTime();

      if (selectedTime < todayTime || selectedTime > oneWeekLaterTime) {
        Alert.alert(MESSAGE.INVALID_DATE);
        return;
      } else {
        if (isStartDate) {
          setStartDate(selectedDate);
        } else {
          setEndDate(oneWeekLater);
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

      const dateRange = generateDateRange(newEvent.startDate, newEvent.endDate);
      eventBus.emit("newEventDateRagne", dateRange);
      Alert.alert(MESSAGE.HEADER, MESSAGE.ADD_SUCCESS);
      resetState();
      toggleModal();
    } catch (error) {
      console.error(error);
      Alert.alert(MESSAGE.HEADER, MESSAGE.ADD_FAILED);
    } finally {
      resetState();
    }
  };

  return (
    <Modal isVisible={isModalVisible}>
      <Pressable onPress={Keyboard.dismiss} style={stylesModal.container}>
        <Text style={stylesModal.headerFont}>일정 추가</Text>
        <EventForm
          title={title}
          setTitle={setTitle}
          startDate={startDate}
          endDate={oneWeekLater}
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
  );
}
