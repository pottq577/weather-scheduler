const styles = {
  trashIcon: {
    width: 25,
    height: 25,
    opacity: 0.5,
  },
};

const stylesModal = {
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    height: 565,
  },
  headerFont: {
    // backgroundColor: "blue",
    fontSize: 28,
    fontWeight: "bold",
    flex: 0.2,
  },
  btnContainer: {
    // backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 7,
    marginTop: 10,
  },
  btnStyle: {
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
  },
  deleteBtnStyle: {
    backgroundColor: "#cc3300",
    borderColor: "red",
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
  },
};

const stylesList = {
  sListContainer: {
    // backgroundColor: "green",
    flex: 1,
    padding: 13,
    borderWidth: 1,
    borderRadius: 5,
  },
  sList: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sListFontHeader: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 7,
  },
  sListFont: {
    fontSize: 14,
    fontWeight: "600",
    // color: "grey",
    opacity: 0.5,
  },
  datePickerView: {
    height: 75,
    justifyContent: "space-between",
    marginLeft: -15,
    alignItems: "center",
    marginBottom: 7,
  },
};

export { styles, stylesModal, stylesList };
