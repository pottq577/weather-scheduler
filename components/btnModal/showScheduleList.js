import { useEffect, useState } from "react";
import { Text, ScrollView, View, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { stylesModal, stylesList } from "../../styles/Modal/ListStyle";
import eventBus from "../../constants/EventBus";
import moment from "moment";
import { MESSAGE } from "../../constants/messages";

export default function ScheduleList({ isModalVisible, toggleModal }) {
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    eventBus.on("newEventAdded", loadEvents);
    eventBus.on("eventDeleted", loadEvents);
    eventBus.on("eventEdited", loadEvents);
    loadEvents();

    return () => {
      // CleanUp
      eventBus.off("newEventAdded", loadEvents);
      eventBus.off("eventDeleted", loadEvents);
      eventBus.off("eventEdited", loadEvents);
    };
  }, []);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("eventsArray");
      console.log("Stored Events in showList: ", storedEvents);
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

  return (
    <Modal isVisible={isModalVisible}>
      {/* 모달 컨테이너 */}
      <View style={stylesModal.container}>
        {/* 헤더 텍스트 */}
        <Text style={stylesModal.headerFont}>일정 목록</Text>

        {/* 일정 목록 뷰 */}
        <ScrollView style={stylesList.sListContainer}>
          {savedEvents.map((event, index) => {
            return (
              <View key={index.toString()} style={stylesList.sList}>
                <View>
                  <Text style={stylesList.sListFontHeadr}>{event.title}</Text>
                  <Text style={stylesList.sListFont}>
                    {moment(event.startDate).format("YYYY-MM-DD")}
                  </Text>
                  <Text style={stylesList.sListFont}>
                    {moment(event.endDate).format("YYYY-MM-DD")}
                  </Text>
                  <Text style={{ marginTop: 7 }}>{event.memo}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* 버튼 뷰 */}
        <View style={stylesModal.btnContainer}>
          <TouchableOpacity style={stylesModal.btnStyle} onPress={toggleModal}>
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
