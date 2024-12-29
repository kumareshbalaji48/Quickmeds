import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Text, Divider, Button, Card, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
const COLORS = {
    primary: "#020E22",
    white: "#FFFFFF",
    gray: "#2A2A2A",
    blue: "#4F73DF",
    green: "#157A6E",
    red: "#B53737",
    cardBlue: "#293C7A",
    cardGreen: "#1C6034",
    cardRed: "#5A2E2E",
    cardOrange: "#D45C16",
    lightGray: "#1E2D44",
    transparentWhite: "rgba(255, 255, 255, 0.7)", 
  };

  
const TEMPORARY_REPORTS = [
  {
    id: 1,
    title: "Blood Test",
    description: "Glucose: Elevated levels may indicate diabetes.",
    date: "2024-12-20",
  },
  {
    id: 2,
    title: "Urine Tests",
    description: "Color, and Odor: Abnormalities may indicate urinary tract infections or kidney disease.",
    date: "2024-06-10",
  },
  {
    id: 3,
    title: "Lipid Profile",
    description: "Triglycerides: Elevated levels may indicate increased cardiovascular risk.",
    date: "2024-10-18",
  },
  {
    id: 4,
    title: "Thyroid Tests",
    description: "T3 and T4: Abnormal levels may indicate thyroid dysfunction.",
    date: "2024-10-20",
  },
];

const Reports = () => {
  const [sortOrder, setSortOrder] = useState("newest");
  const [reports, setReports] = useState(TEMPORARY_REPORTS);
  const navigation = useNavigation();
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
            onPress={() => navigation.navigate("Test")}
          />
        </View>
        <Text style={styles.reportDescription}>{item.description}</Text>
        <Text style={styles.reportDate}>Added Manually {new Date(item.date).toLocaleDateString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} />
      <Text style={styles.header}>Analysis</Text>
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
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    paddingBottom:12,
    fontFamily:"monospace",
    fontWeight:"bold",
    borderBottomColor:COLORS.white,
    borderBottomWidth:1,
    
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent:"space-around",
    marginBottom: 30,
    borderBottomColor:COLORS.white,
    borderBottomWidth:1,
    paddingBottom:18,
  },
  reportCard: {
    backgroundColor: COLORS.cardBlue,
    borderRadius: 20,
    marginBottom: 20,
    padding:5,
    borderColor:COLORS.transparentWhite,
    borderWidth:0.70,
    

  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportTitle: {
    fontSize: 24,
    color: "#0FEDED",
    fontWeight: "bold",

  },
  reportDescription: {
    color: COLORS.white,
    marginVertical: 3,
    fontSize: 15,
  },
  reportDate: {
    color: "BBBBBB",
    fontSize: 12,
    marginTop: 6,
  },
  divider: {
    backgroundColor: "#1C2D4C",
    height: 1,
  },
});

export default Reports;
