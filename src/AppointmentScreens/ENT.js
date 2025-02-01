import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Card, Text, Searchbar, ActivityIndicator, useTheme, Avatar } from 'react-native-paper';

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#4F73DF",
  green: "#157A6E",
  red: "#B53737",
  accent: "#0FEDED",
  cardBlue: "#293C7A",
  cardGreen: "#084C2E",
  cardRed: "#7A271A",
  cardOrange: "#772917",
  lightGray: "#1E2D44",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const doctors = [
  {
    id: "1",
    name: "Dr. Santosh",
    specialty: "Ear, Nose & Throat specialist",
    price: "IDR. 120.000",
    rating: 4.5,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Dr. Indira Varma",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 4,
    image: require("../../assets/doctor2.png"),
    isAvailable: false,
  },
  {
    id: "3",
    name: "Dr. Kumaresh",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 2.5,
    image: require("../../assets/doctor3.png"),
    isAvailable: true,
  },
  {
    id: "4",
    name: "Dr. Butti Bal",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor4.png"),
    isAvailable: true,
  },
  {
    id: "5",
    name: "Dr. Jhenny",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 3,
    image: require("../../assets/doctor5.png"),
    isAvailable: false,
  },
];

const ENT = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each doctor item
  const renderDoctor = ({ item }) => (
    <Card
      style={[styles.card, { backgroundColor: COLORS.gray }]}
      onPress={() => navigation.navigate('Makeappointment')}
    >
      <Card.Content style={styles.cardContent}>
        <Avatar.Image 
          size={48} 
          source={item.image || require("../../assets/doctor4.png")} 
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text variant="titleMedium" style={styles.doctorName}>
            {item.name}
          </Text>
          <Text variant="bodyMedium" style={styles.specialization}>
            {item.specialty}
          </Text>
          <Text variant="bodySmall" style={styles.price}>
            Price: {item.price}
          </Text>
          <Text variant="bodySmall" style={styles.rating}>
            Rating: {item.rating} ⭐
          </Text>
          <Text 
            variant="bodySmall" 
            style={[styles.availability, { color: item.isAvailable ? 'green' : 'red' }]}
          >
            {item.isAvailable ? 'Available' : 'Not Available'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="ENT Department" />
        <Appbar.Action icon="hospital-building" />
      </Appbar.Header>

      <Searchbar
        placeholder="Search doctors..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        elevation={2}
      />

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
            No matches found for "{searchQuery}"
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  searchBar: {
    margin: 16,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    backgroundColor:COLORS.blue,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  avatar: {
    backgroundColor: '#e3f2fd',
  },
  infoContainer: {
    flex: 1,
  },
  doctorName: {
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 16,
  },
  specialization: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    color: '#888',
  },
  rating: {
    fontSize: 12,
    color: '#888',
  },
  availability: {
    fontSize: 12,
  
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});

export default ENT;
