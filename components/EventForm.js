import React, { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles, stylesModal, stylesSchedule } from "../styles/CalendarStyle";
import { MESSAGE } from "../constants/messages";

const Separator = () => <View style={styles.separator} />;

const EventForm = ({
  title,
  setTitle,
  startDate,
  endDate,
  oneWeekLater,
  setStartDate,
  setEndDate,
  memo,
  setMemo,
  handleSubmit,
  handleDateChange,
  toggleModal,
}) => {
  const DatePicker = ({ value, isStartDate, minimumDate, maximumDate }) => (
    <DateTimePicker
      testID="dateTimePicker"
      value={value}
      mode="date"
      display="default"
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      onChange={(event, selectedDate) =>
        handleCustomDateChange(isStartDate, event, selectedDate)
      }
    />
  );

  const handleCustomDateChange = (isStartDate, event, selectedDate) => {
    if (selectedDate) {
      const selectedDateTime = selectedDate.getTime();

      if (isStartDate && selectedDateTime > endDate.getTime()) {
        Alert.alert(MESSAGE.INVALID_SEQ_DATE);
        return;
      }

      if (!isStartDate && selectedDateTime < startDate.getTime()) {
        Alert.alert(MESSAGE.INVALID_SEQ_DATE);
        return;
      }
      handleDateChange(isStartDate, event, selectedDate);
    }
  };

  return (
    <View style={stylesSchedule.scheduleContainer}>
      <View style={{ flex: 1, marginBottom: 5 }}>
        <TextInput
          style={styles.textInputStyle}
          placeholder="(필수) 제목"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <Separator />

      <View style={stylesSchedule.choosePeriodContainer}>
        <View style={{ ...stylesSchedule.choosePeriod, marginBottom: 8 }}>
          <Text style={{ ...styles.textInputStyle, borderWidth: 0 }}>
            시작일
          </Text>
          <DatePicker
            value={startDate}
            isStartDate={true}
            minimumDate={new Date()}
            maximumDate={oneWeekLater}
          />
        </View>

        <View style={stylesSchedule.choosePeriod}>
          <Text style={{ ...styles.textInputStyle, borderWidth: 0 }}>
            종료일
          </Text>
          <DatePicker
            value={endDate}
            isStartDate={false}
            minimumDate={new Date()}
            maximumDate={oneWeekLater}
          />
        </View>
      </View>

      <Separator />

      <View style={{ flex: 2 }}>
        <TextInput
          multiline
          textAlignVertical="top"
          style={{ ...styles.textInputStyle, height: "100%" }}
          placeholder="일정 / 메모를 입력해주세요…"
          value={memo}
          onChangeText={setMemo}
        />
      </View>

      <View style={stylesModal.btnContainer}>
        <TouchableOpacity style={styles.btnStyle} onPress={toggleModal}>
          <Text>닫기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle} onPress={handleSubmit}>
          <Text>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventForm;
