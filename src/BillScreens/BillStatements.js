import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Text, Divider, Button, Card, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  accent: "#0FEDED",
  blue: "#4F73DF",
  green: "#157A6E",
  red: "#B53737",
  cardBlue: "#293C7A",
  cardGreen: "#1C6034",
  cardRed: "#5A2E2E",
  cardOrange: "#D45C16",
  lightGray: "#1E2D44",
  black:"#1b1b32",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const TEMPORARY_BILL_REPORTS = [
  {
    id: 1,
    title: "Consultation",
    description: "General physician consultation fee.",
    date: "2024-12-20",
    amount: "3000 INR",
  },
  {
    id: 2,
    title: "Lab Tests",
    description: "Blood sugar and cholesterol tests.",
    date: "2024-12-15",
    amount: "1200 INR",
  },
  {
    id: 3,
    title: "Medication",
    description: "Prescribed medications for diabetes.",
    date: "2024-12-10",
    amount: "2500 INR",
  },
  {
    id: 4,
    title: "Follow-up Fee",
    description: "Follow-up visit fee for specialist.",
    date: "2024-12-05",
    amount: "700 INR",
  },
];

const BillStatements = () => {
  const [sortOrder, setSortOrder] = useState("newest");
  const [reports, setReports] = useState(TEMPORARY_BILL_REPORTS);
  const [balance, setBalance] = useState(0);
  const navigation = useNavigation();

  const fetchBalance = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        console.log("No user ID found. Please log in.");
        return;
      }
  
      const userDocRef = firestore()
        .collection("users")
        .doc("phone")
        .collection(uid)
        .doc("details");
  
      const userDoc = await userDocRef.get();
  
      if (userDoc.exists) {
        const userData = userDoc.data();
        setBalance(userData.availableBalance || 10000); 
      } else {
        console.log("No user details found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching balance: ", error);
    }
  };
  
  const deductBalance = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        console.log("No user ID found. Please log in.");
        return;
      }
  
      if (balance < 500) {
        console.log("Insufficient balance to deduct.");
        return;
      }
  
      
      const appointmentDocRef = firestore()
        .collection("appointments")
        .doc(uid); 
  
      const appointmentDoc = await appointmentDocRef.get();
  
      if (!appointmentDoc.exists) {
        console.log("No appointment found. Balance cannot be deducted.");
        return;
      }
  
      const newBalance = balance - 500;
      const userDocRef = firestore()
        .collection("users")
        .doc("phone")
        .collection(uid)
        .doc("details");
  
      await userDocRef.update({ availableBalance: newBalance });
      setBalance(newBalance); 
      console.log("Balance deducted successfully.");
    } catch (error) {
      console.error("Error deducting balance: ", error);
    }
  };
  

  useEffect(() => {
    fetchBalance();
  }, []);

  const sortReports = (order) => {
    const sorted = [...reports].sort((a, b) => {
      return order === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
    setSortOrder(order);
    setReports(sorted);
  };

  const renderReport = ({ item }) => (
    <Card style={styles.reportCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <IconButton
            icon="download"
            iconColor="#0FEDED"
            size={30}
            onPress={() => navigation.navigate("BillPdf")}
          />
        </View>
        <Text style={styles.reportDescription}>{item.description}</Text>
        <Text style={styles.reportDate}>
          Added Manually {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.reportAmount}>Amount: {item.amount}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <Text style={styles.header}>
        Bill Statements
        {"\n"}
        <Text style={styles.balanceText}>Current Balance: {balance} INR</Text>
      </Text>
      <View style={styles.sortContainer}>
        <Button
          mode={sortOrder === "newest" ? "contained" : "outlined"}
          buttonColor={sortOrder === "newest" ? "#0FEDED" : "#1C2D4C"}
          textColor={sortOrder === "newest" ? "#000" : "#fff"}
          onPress={() => sortReports("newest")}
        >
          Newest
        </Button>
        <Button
          mode={sortOrder === "oldest" ? "contained" : "outlined"}
          buttonColor={sortOrder === "oldest" ? "#0FEDED" : "#1C2D4C"}
          textColor={sortOrder === "oldest" ? "#000" : "#fff"}
          onPress={() => sortReports("oldest")}
        >
          Oldest
        </Button>
      </View>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReport}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  header: {
    color: "#0FEDED",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    paddingBottom: 14,
    fontFamily: "monospace",
    fontWeight: "bold",
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
  },
  balanceText: {
    fontSize: 16,
    color: COLORS.white,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    paddingBottom: 18,
  },
  reportCard: {
    backgroundColor: COLORS.cardBlue,
    borderRadius: 20,
    marginBottom: 20,
    padding: 5,
    borderColor: COLORS.transparentWhite,
    borderWidth: 0.7,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportTitle: {
    fontSize: 24,
    color: COLORS.accent,
    fontWeight:"600"
  },
  reportDescription: {
    color: COLORS.white,
    marginVertical: 3,
    fontSize: 15,
  },
  reportDate: {
    color: "#BBBBBB",
    fontSize: 12,
    marginTop: 6,
  },
  reportAmount: {
    color: COLORS.green,
    fontSize: 14,
    marginTop: 6,
  },
  divider: {
    backgroundColor: "#1C2D4C",
    height: 1,
  },
  deductButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default BillStatements;
