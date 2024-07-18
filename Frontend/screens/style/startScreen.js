import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 200,
      height: 200,
    },
    innercontaine: {
      display: "flex",
      flexDirection: "row",
      width: "90%",
      paddingTop: "10%",
      justifyContent: "space-evenly",
    },
    box: {
      width: 150,
      height: 150,
      borderBlockColor: "black",
      borderWidth: 0.2,
      borderRadius: 5,
      shadowColor: 'gray',
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#894FE0'
    },
    box2: {
      width: 150,
      height: 150,
      borderBlockColor: "black",
      borderWidth: 0.2,
      borderRadius: 5,
      shadowColor: 'gray',
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#4F7EE0'
    },
    Textstyle: {
        fontSize: 15,
        color: 'white',
        paddingTop: 15,
        fontWeight: 'bold',
    },
    Titlestyle: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10
    },
    HeaderTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      paddingBottom: 30
    }
  });

export default styles