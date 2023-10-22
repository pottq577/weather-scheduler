import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Calender from "./components/Calendar";
import AddModal from "./components/btnModal/addSchedule";
import EditModal from "./components/btnModal/editSchedule";
import DeleteModal from "./components/btnModal/deleteSchedule";
import ListModal from "./components/btnModal/showScheduleList";
import { styles, stylesBtm, stylesCnt } from "./styles/AppStyle";

const ICONS = {
  ADD: require("./constants/icons/add.png"),
  EDIT: require("./constants/icons/edit.png"),
  DELETE: require("./constants/icons/delete.png"),
  LIST: require("./constants/icons/list.png"),
};

export default function App() {
  const [isAddVisible, setAddVisible] = useState(false);
  const [isEditVisible, setEditVisible] = useState(false);
  const [isDeleteVisible, setDeleteVisible] = useState(false);
  const [isListVisible, setListVisible] = useState(false);

  const buttons = [
    {
      icon: ICONS.ADD,
      action: () => setAddVisible(true),
    },
    {
      icon: ICONS.EDIT,
      action: () => setEditVisible(true),
    },
    {
      icon: ICONS.DELETE,
      action: () => setDeleteVisible(true),
    },
    {
      icon: ICONS.LIST,
      action: () => setListVisible(true),
    },
  ];

  const renderButtons = buttons.map((button, index) => (
    <Button key={index} icon={button.icon} action={button.action} />
  ));

  return (
    <View style={styles.container}>
      {/* 달력, 날씨 뷰 */}
      <View style={stylesCnt.container}>
        <Calender />
      </View>

      {/* 하단 뷰 */}
      <View style={stylesBtm.container}>{renderButtons}</View>

      {/* 버튼 모달 */}
      <>
        <AddModal
          isModalVisible={isAddVisible}
          toggleModal={() => setAddVisible(false)}
        />
        <EditModal
          isModalVisible={isEditVisible}
          toggleModal={() => setEditVisible(false)}
        />
        <DeleteModal
          isModalVisible={isDeleteVisible}
          toggleModal={() => setDeleteVisible(false)}
        />
        <ListModal
          isModalVisible={isListVisible}
          toggleModal={() => setListVisible(false)}
        />
      </>
    </View>
  );
}

const Button = ({ icon, action }) => {
  return (
    <TouchableOpacity onPress={action} style={stylesBtm.btnStyle}>
      <Image style={styles.icon} source={icon} />
    </TouchableOpacity>
  );
};
