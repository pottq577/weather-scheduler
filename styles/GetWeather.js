import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = {
  container: {
    flex: 1,
    // backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "grey",
    // backgroundColor: "red",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
    // backgroundColor: "blue",
  },
  weather: {
    // backgroundColor: "violet",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  day: {
    // backgroundColor: "green",
    width: SCREEN_WIDTH,
    paddingHorizontal: 40,
    marginBottom: 50,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 60,
    // backgroundColor: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 25,
    fontWeight: "500",
  },
  tinyText: {
    fontSize: 15,
    marginTop: -5,
    fontWeight: "500",
  },
  text: {
    fontWeight: "500",
    color: "red",
  },
  range: {
    fontWeight: "500",
    fontSize: 12,
    color: "grey",
    paddingTop: 10,
  },
};

export { styles };
