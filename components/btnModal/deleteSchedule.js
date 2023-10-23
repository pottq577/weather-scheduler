import { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  styles,
  stylesModal,
  stylesList,
} from "../../styles/Modal/DeleteStyle";
import eventBus from "../../constants/EventBus";
import { MESSAGE } from "../../constants/messages";
import moment from "moment";

const ICONS = {
  TRASH: require("../../constants/icons/trash.png"),
};

export default function DeleteSchedule({ isModalVisible, toggleModal }) {
  const [savedEvents, setSavedEvents] = useState([]);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("eventsArray");
      console.log("Stored Events in delList", savedEvents);
      if (storedEvents !== null) {
        setSavedEvents(JSON.parse(storedEvents));
      } else {
        setSavedEvents([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(MESSAGE.HEADER, MESSAGE.LOAD_FAILED);
    }
  };

  useEffect(() => {
    loadEvents();
    eventBus.on("newEventAdded", loadEvents);
    eventBus.on("eventDeleted", loadEvents);
    eventBus.on("eventEdited", loadEvents);

    return () => {
      // CleanUp
      eventBus.off("newEventAdded", loadEvents);
      eventBus.off("eventDeleted", loadEvents);
      eventBus.off("eventEdited", loadEvents);
    };
  }, []);

  // 일정 한 개만 삭제
  const deleteEvent = async (index) => {
    const updatedEvents = [...savedEvents];
    updatedEvents.splice(index, 1);

    try {
      await AsyncStorage.setItem("eventsArray", JSON.stringify(updatedEvents));
      setSavedEvents(updatedEvents);
      eventBus.emit("eventDeleted");
      console.log("Emitting eventDeleted after deleting events");
      Alert.alert(MESSAGE.HEADER, MESSAGE.DELETE_EVENT);
    } catch (error) {
      console.error(error);
      Alert.alert(MESSAGE.HEADER, MESSAGE.DELETE_FAILED);
    }
  };

  // 모든 일정 삭제
  const deleteAllEvent = async () => {
    try {
      await AsyncStorage.removeItem("eventsArray");
      setSavedEvents([]);
      eventBus.emit("eventDeleted");
      console.log("Emitting eventDeleted after deleting all events");
      Alert.alert(MESSAGE.HEADER, MESSAGE.DELETE_ALL_EVENT);
    } catch (error) {
      $;
      console.error(error);
      Alert.alert(MESSAGE.HEADER, MESSAGE.DELETE_FAILED);
    }
  };

  return (
    <Modal isVisible={isModalVisible}>
      {/* 모달 컨테이너 */}
      <View style={stylesModal.container}>
        {/* 헤더 텍스트 */}
        <Text style={stylesModal.headerFont}>일정 삭제</Text>

        {/* 일정 목록 뷰 */}
        <ScrollView style={stylesList.sListContainer}>
          {savedEvents.map((event, index) => {
            return (
              <View key={index.toString()} style={stylesList.sList}>
                <View>
                  <Text style={stylesList.sListFontHeader}>{event.title}</Text>
                  <Text style={stylesList.sListFont}>
                    {moment(event.startDate).format("YYYY-MM-DD")}
                  </Text>
                  <Text style={stylesList.sListFont}>
                    {moment(event.endDate).format("YYYY-MM-DD")}
                  </Text>
                  <Text style={{ marginTop: 7 }}>{event.memo}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteEvent(index)}>
                  <Image style={styles.trashIcon} source={ICONS.TRASH}></Image>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* 버튼 뷰 */}
        <View style={stylesModal.btnContainer}>
          <TouchableOpacity
            style={stylesModal.deleteBtnStyle}
            onPress={() => {
              Alert.alert(
                MESSAGE.DELETE_ALL_HEADER,
                MESSAGE.DELETE_ALL,
                [
                  {
                    text: "취소",
                    onPress: () => console.log("취소되었습니다"),
                    style: "cancel",
                  },
                  {
                    text: "확인",
                    onPress: deleteAllEvent,
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Text style={{ color: "white" }}>전체 삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesModal.btnStyle} onPress={toggleModal}>
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
