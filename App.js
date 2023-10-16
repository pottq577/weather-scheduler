import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Calender from "./components/CalendarF";

export default function App() {
  return (
    <View style={styles.container}>
      {/* 달력, 날씨 뷰 */}
      <View style={stylesCnt.container}>
        <Calender></Calender>
      </View>
      {/* 하단 뷰 */}
      <View style={stylesBtm.container}>
        {/* 일정 추가 버튼 */}
        <TouchableOpacity style={stylesBtm.btnStyle}>
          <Image
            style={styles.icon}
            source={require("./assets/icons/add.png")}
          ></Image>
        </TouchableOpacity>
        {/* 일정 수정 버튼 */}
        <TouchableOpacity style={stylesBtm.btnStyle}>
          <Image
            style={styles.icon}
            source={require("./assets/icons/edit.png")}
          ></Image>
        </TouchableOpacity>
        {/* 일정 삭제 버튼 */}
        <TouchableOpacity style={stylesBtm.btnStyle}>
          <Image
            style={styles.icon}
            source={require("./assets/icons/delete.png")}
          ></Image>
        </TouchableOpacity>
        {/* 일정 목록 버튼 */}
        <TouchableOpacity style={stylesBtm.btnStyle}>
          <Image
            style={styles.icon}
            source={require("./assets/icons/list.png")}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  icon: {
    height: 40,
    width: 40,
    opacity: 0.3,
    tintColor: "blue",
  },
});

const stylesCnt = StyleSheet.create({
  container: {
    flex: 6,
    marginTop: 60,
  },
});

const stylesBtm = StyleSheet.create({
  container: {
    flex: 0.8,
    flexDirection: "row",
    borderWidth: 1,
    // backgroundColor: "blue",
  },
  btnStyle: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 7,
  },
});
