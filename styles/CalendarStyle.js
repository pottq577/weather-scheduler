import { StyleSheet } from "react-native";

const styles = {
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
    // backgroundColor: "blue",
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    padding: 10,
    borderColor: "gray",
  },
};

const stylesModal = {
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
};

const stylesSchedule = {
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
};

export { styles, stylesModal, stylesSchedule };
