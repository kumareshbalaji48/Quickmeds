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

const specialties = [
  {
    id: "1",
    title: "Ear, Nose & Throat",
    subtitle: "Specialists for ENT issues",
    icon: require("../../assets/medical.png"),
  },
  {
    id: "2",
    title: "Psychiatrist",
    subtitle: "Mental health professionals",
    icon: require("../../assets/brainstorm.png"),
  },
  {
    id: "3",
    title: "Dentist",
    subtitle: "Oral health specialists",
    icon: require("../../assets/tooth.png"),
  },
  {
    id: "4",
    title: "Dermato-venereologist",
    subtitle: "Dermato Venereologist specialists",
    icon: require("../../assets/8549874.png"),
  },
];

const AppointmentPage = ({ navigation }) => {
  const renderSpecialty = ({ item }) => (
    <TouchableOpacity
      style={styles.specialtyItem}
      onPress={() => handlePress(item)}
    >
      <Image source={item.icon} style={styles.specialtyIcon} />
      <View style={styles.specialtyTextContainer}>
        <Text style={styles.specialtyTitle}>{item.title}</Text>
        <Text style={styles.specialtySubtitle}>{item.subtitle}</Text>
      </View>
      <Icon name="chevron-forward" size={24} color="#ffffff" />
    </TouchableOpacity>
  );

  const handlePress = (item) => {
    switch (item.title) {
      case "Ear, Nose & Throat":
        navigation.navigate("ENT");
        break;
      case "Psychiatrist":
        navigation.navigate("Psychiatrist");
        break;
      case "Dentist":
        navigation.navigate("Dentist");
        break;
      case "Dermato-venereologist":
        navigation.navigate("Dermato");
        break;
      default:
        console.log("No matching department");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#ffffff" />
        <Text style={styles.headerTitle}>Book an Appointment</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={20}
            color="#a0a0a0"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Symptoms, Diseases..."
            placeholderTextColor="#a0a0a0"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Specialties List */}
      <Text style={styles.sectionTitle}>Medical Specialties</Text>
      <Text style={styles.sectionSubtitle}>
        Wide selection of doctor's specialties
      </Text>

      <FlatList
        data={specialties}
        renderItem={renderSpecialty}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* See More */}
      <TouchableOpacity style={styles.seeMoreButton}>
        <Text style={styles.seeMoreText}>See More</Text>
        <Icon name="chevron-forward" size={20} color="#4a90e2" />
      </TouchableOpacity>
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
    marginBottom: 24,
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
    height: 50,
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
    padding: 10,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: "#a0a0a0",
    fontSize: 14,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  specialtyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002A5C",
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  specialtyIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  specialtyTextContainer: {
    flex: 1,
  },
  specialtyTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  specialtySubtitle: {
    color: "#a0a0a0",
    fontSize: 14,
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  seeMoreText: {
    color: "#4a90e2",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
});

export default AppointmentPage;
