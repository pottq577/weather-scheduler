import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import GetWeather from "./getWeather";
import DateTimePicker from "@react-native-community/datetimepicker";

const Separator = () => <View style={styles.separator} />;

export default function CalendarF() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const today = new Date();

  // DateTimePicker의 날짜 선택 기간 제한
  const handleDateChange = (event, pickerDate) => {
    const selectedPicker = new Date(pickerDate);
    selectedPicker.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    const maxDate = new Date(weekLater);
    if (selectedPicker < minDate || selectedPicker > maxDate) {
      alert("오늘을 기준으로 일주일 내의 날짜를 선택해주세요.");
      // console.log("outranged");
      return;
    } else {
      setPickerDate(pickerDate);
      // console.log("pass");
    }
  };

  // yyyy-mm-dd 형식 변환
  function getFormattedDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  // 오늘로부터 일주일 후의 날짜를 계산합니다.
  let weekLater = new Date();
  weekLater.setDate(today.getDate() + 6);

  const [selectedDate, setSelectedDate] = useState(
    getFormattedDate(new Date())
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {/* 달력 뷰 */}
      <View style={styles.container}>
        {/* 달력 컴포넌트 */}
        <Calendar
          markingType={"custom"}
          minDate={getFormattedDate(new Date())}
          maxDate={getFormattedDate(weekLater)}
          onDayPress={(day) => {
            console.log("선택한 날짜:", day.dateString);
            setSelectedDate(day.dateString); // 선택된 날짜를 상태로 저장
            toggleModal(); // 모달 화면 열기
          }}
        />
        {/* 모달 화면 */}
        <Modal isVisible={isModalVisible}>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
            }}
            style={stylesModal.container}
          >
            {/* 헤더 텍스트 */}
            <Text style={stylesModal.headerFont}>일정 등록</Text>

            {/* 일정, 기간 입력 컨테이너 */}
            <View style={stylesSchedule.scheduleContainer}>
              {/* 일정 제목 입력 뷰 */}
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="(필수) 제목"
                ></TextInput>
              </View>

              <Separator />

              {/* 기간 입력 뷰 */}
              <View style={stylesSchedule.choosePeriodContainer}>
                {/* 시작일 선택 뷰 */}
                <View
                  style={{ ...stylesSchedule.choosePeriod, marginBottom: 8 }}
                >
                  <Text style={{ ...styles.textInputStyle, borderWidth: 0 }}>
                    시작일
                  </Text>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date(selectedDate)}
                    mode={"date"}
                    display="default"
                    onChange={handleDateChange}
                  />
                </View>
                {/* 종료일 선택 뷰 */}
                <View style={stylesSchedule.choosePeriod}>
                  <Text style={{ ...styles.textInputStyle, borderWidth: 0 }}>
                    종료일
                  </Text>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={weekLater}
                    mode={"date"}
                    display="default"
                    onChange={handleDateChange}
                  />
                </View>
              </View>

              <Separator />

              {/* 상세 일정 / 메모 입력 뷰 */}
              <View style={{ flex: 2 }}>
                <TextInput
                  multiline={true}
                  textAlignVertical="top"
                  placeholder="일정 / 메모를 입력해주세요…"
                  style={{ ...styles.textInputStyle, height: "100%" }}
                ></TextInput>
              </View>
            </View>

            {/* 버튼 컨테이너 */}
            <View style={stylesModal.btnContainer}>
              <TouchableOpacity style={styles.btnStyle} onPress={toggleModal}>
                <Text>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnStyle} onPress={toggleModal}>
                <Text>등록</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>

      {/* 날씨 뷰 */}
      <View style={styles.container}>
        {selectedDate && <GetWeather selectedDate={selectedDate}></GetWeather>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btnStyle: {
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: "gray",
  },
});

const stylesModal = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    height: 400,
  },
  headerFont: {
    // backgroundColor: "blue",
    fontSize: 28,
    fontWeight: "bold",
    flex: 0.8,
  },
  btnContainer: {
    // backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 7,
    marginTop: 10,
  },
});

const stylesSchedule = StyleSheet.create({
  scheduleContainer: {
    // backgroundColor: "tomato",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    flex: 4,
  },
  choosePeriodContainer: {
    flex: 2,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "grey",
  },
  choosePeriod: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
});
