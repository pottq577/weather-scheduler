import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles, stylesModal, stylesList } from "../../styles/Modal/EditStyle";
import eventBus from "../../constants/EventBus";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MESSAGE } from "../../constants/messages";

const ICONS = {
  SAVE: require("../../constants/icons/save.png"),
  MODIFY: require("../../constants/icons/modify.png"),
};

const oneWeekLater = new Date();
oneWeekLater.setDate(oneWeekLater.getDate() + 6);

export default function EditSchedule({ isModalVisible, toggleModal }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState({});
  const [editedEvent, setEditedEvent] = useState({});
  const [editingDateType, setEditingDateType] = useState(""); // start or end

  const validateDate = (selectedDate) => {
    const selectedTime = selectedDate.getTime();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const oneWeekLaterTime = oneWeekLater.getTime();

    const isStartDateValid =
      editingDateType !== "start" || selectedTime >= todayTime;
    const isEndDateValid =
      editingDateType !== "end" ||
      (selectedTime >= todayTime && selectedTime <= oneWeekLaterTime);

    return isStartDateValid && isEndDateValid;
  };

  const onDateChanged = (event, selectedDate, type, index) => {
    if (!selectedDate) return;

    const currentEvent = editedEvent[index] || savedEvents[index];
    let startDate = new Date(currentEvent.startDate);
    let endDate = new Date(currentEvent.endDate);

    if (type === "start") {
      startDate = selectedDate;
    } else {
      endDate = selectedDate;
    }

    if (startDate > endDate) {
      Alert.alert(MESSAGE.HEADER, MESSAGE.INVALID_SEQ_DATE);
      return;
    }

    if (validateDate(selectedDate)) {
      setEditedEvent((prev) => {
        const updated = {
          ...prev,
          [index]: {
            ...prev[index],
            [type === "start" ? "startDate" : "endDate"]:
              selectedDate.toISOString(),
          },
        };
        return updated;
      });
    } else {
      Alert.alert(MESSAGE.INVALID_DATE);
    }
  };

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("eventsArray");
      console.log("Stored Events in editList", savedEvents);
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

  const handleEditEvent = async (index) => {
    const updatedEvents = [...savedEvents];
    updatedEvents[index] = {
      ...updatedEvents[index],
      ...editedEvent[index],
    };

    try {
      await AsyncStorage.setItem("eventsArray", JSON.stringify(updatedEvents));
      setSavedEvents(updatedEvents);
      eventBus.emit("eventEdited");
    } catch (error) {
      console.error(error);
      Alert.alert(MESSAGE.HEADER, MESSAGE.EDIT_FAILED);
    }
    // 해당 이벤트의 수정 모드 해제
    setEditingEvent((prev) => ({ ...prev, [index]: false }));
  };

  const handleCloseModal = () => {
    const isEditing = Object.values(editingEvent).some((edit) => edit);

    if (isEditing) {
      Alert.alert(MESSAGE.HEADER, MESSAGE.CLOSE_EVENT, [
        {
          text: "계속 편집",
          style: "cancel",
        },
        {
          text: "닫기",
          onPress: () => {
            toggleModal();
            setEditingEvent({});
            setEditedEvent({});
          },
        },
      ]);
    } else {
      toggleModal();
      setEditingEvent({});
      setEditedEvent({});
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

  const RenderEventList = ({ event }) => {
    return (
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
    );
  };

  const RenderIcon = ({ isEditing, onIconPress }) => (
    <TouchableOpacity onPress={onIconPress}>
      <Image
        style={styles.trashIcon}
        source={isEditing ? ICONS.SAVE : ICONS.MODIFY}
      ></Image>
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={isModalVisible}>
      {/* 모달 컨테이너 */}
      <View style={stylesModal.container}>
        {/* 헤더 텍스트 */}
        <Text style={stylesModal.headerFont}>일정 수정</Text>

        {/* 일정 목록 컨테이너 */}
        <ScrollView style={stylesList.sListContainer}>
          {savedEvents.map((event, index) => (
            <View key={index.toString()} style={stylesList.sList}>
              {editingEvent[index] ? (
                // 일정 수정 뷰
                <View>
                  <TextInput
                    defaultValue={event.title ?? ""}
                    style={stylesList.sListFontHeader}
                    onChangeText={(text) =>
                      setEditedEvent((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], title: text },
                      }))
                    }
                  />
                  {/* DateTimePicker 뷰 */}
                  <View style={stylesList.datePickerView}>
                    <DateTimePicker
                      value={
                        new Date(
                          editedEvent[index]?.startDate ?? event.startDate
                        )
                      }
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      maximumDate={oneWeekLater}
                      onChange={(event, selectedDate) =>
                        onDateChanged(event, selectedDate, "start", index)
                      }
                    />
                    <DateTimePicker
                      value={
                        new Date(editedEvent[index]?.endDate ?? event.endDate)
                      }
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      maximumDate={oneWeekLater}
                      onChange={(event, selectedDate) =>
                        onDateChanged(event, selectedDate, "end", index)
                      }
                    />
                  </View>

                  <TextInput
                    defaultValue={event.memo}
                    style={stylesList.sListFont}
                    onChangeText={(text) =>
                      setEditedEvent((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], memo: text },
                      }))
                    }
                  />
                </View>
              ) : (
                // 일정 목록 뷰
                <RenderEventList event={event} />
              )}
              {/* 수정, 저장 아이콘 */}
              <RenderIcon
                isEditing={editingEvent[index]}
                onIconPress={() => {
                  if (editingEvent[index]) {
                    handleEditEvent(index);
                  } else {
                    setEditingEvent((prev) => ({ ...prev, [index]: true }));
                    setEditedEvent((prev) => ({ ...prev, [index]: event }));
                  }
                }}
              />
            </View>
          ))}
        </ScrollView>

        {/* 버튼 뷰 */}
        <View style={stylesModal.btnContainer}>
          <TouchableOpacity
            style={stylesModal.btnStyle}
            onPress={handleCloseModal}
          >
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
