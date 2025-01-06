import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const doctors = [
  {
    id: "1",
    name: "Dr. Patricia Ahoy",
    specialty: "Psychiatrist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor1.png"),
  },
  {
    id: "2",
    name: "Dr. Stone Gaze",
    specialty: "Psychiatrist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor2.png"),
  },
  {
    id: "3",
    name: "Dr. Wahyu",
    specialty: "Psychiatrist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor3.png"),
  },
  {
    id: "4",
    name: "Dr. Reza Razor",
    specialty: "Psychiatrist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor4.png"),
  },
  {
    id: "5",
    name: "Dr. Jacky Cun",
    specialty: "Psychiatrist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor5.png"),
  },
];

const DepartmentPage = ({ navigation }) => {
  const renderDoctor = ({ item }) => (
    <TouchableOpacity style={styles.doctorItem}>
      <Image source={item.image} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <Text style={styles.doctorPrice}>{item.price}</Text>
      </View>
      <View style={styles.doctorRatingContainer}>
        <Icon name="star" size={16} color="#FFA500" />
        <Text style={styles.doctorRating}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Psychiatrists</Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={20}
            color="#a0a0a0"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search Doctor"
            placeholderTextColor="#a0a0a0"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Filters Row */}

      {/* Doctors List */}
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002A5C",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    padding: 8,
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002A5C",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterText: {
    color: "#ffffff",
    fontSize: 14,
    marginRight: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  doctorItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002A5C",
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  doctorSpecialty: {
    color: "#a0a0a0",
    fontSize: 14,
  },
  doctorPrice: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  doctorRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorRating: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 4,
  },
});

export default DepartmentPage;
