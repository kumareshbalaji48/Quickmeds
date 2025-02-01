import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, Card, ActivityIndicator, useTheme, Dialog, Portal } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';

const MakeAppointment = ({ navigation }) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const doctorsList = [
    { id: 'doc1', name: 'Dr. Santosh', specialization: 'ENT' },
    { id: 'doc2', name: 'Dr. Indira Varma', specialization: 'Cardiology' },
    { id: 'doc3', name: 'Dr. Kumaresh', specialization: 'Dermatology' },
    { id: 'doc4', name: 'Dr. Butti Bal', specialization: 'Orthopedics' },
    { id: 'doc5', name: 'Dr. Jhenny', specialization: 'Neurology' },
  ];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour !== 18) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const userId = 'patientUID'; // Replace with the actual user ID
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('appointments')
        .add({
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          doctorSpecialization: selectedDoctor.specialization,
          date: selectedDate.toISOString(),
          time: selectedTime,
          status: 'pending',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      navigation.navigate('AppointmentConfirmation', {
        doctorName: selectedDoctor.name,
        date: selectedDate.toLocaleDateString(),
        time: selectedTime,
      });
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1E1E2C', '#25253D']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Book Your Appointment
            </Text>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Doctor
            </Text>
            <View style={styles.doctorList}>
              {doctorsList.map((doctor) => (
                <TouchableOpacity
                  key={doctor.id}
                  style={[
                    styles.doctorButton,
                    selectedDoctor?.id === doctor.id && styles.selectedDoctor,
                  ]}
                  onPress={() => setSelectedDoctor(doctor)}
                >
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.specialtyText}>{doctor.specialization}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Date
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <MaterialCommunityIcons name="calendar" size={24} color="#fff" />
              <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
            </TouchableOpacity>

            <Portal>
              <Dialog visible={showDatePicker} onDismiss={() => setShowDatePicker(false)}>
                <Dialog.Content>
                  <DatePicker
                    date={selectedDate}
                    mode="date"
                    minimumDate={new Date()}
                    onDateChange={setSelectedDate}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setShowDatePicker(false)}>Done</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Time
            </Text>
            <View style={styles.timeGrid}>
              {generateTimeSlots().map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.selectedTimeButton,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={styles.timeText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleBooking}
          loading={loading}
          disabled={!selectedDoctor || !selectedTime}
          style={styles.bookButton}
          labelStyle={styles.buttonLabel}
        >
          Confirm Appointment
        </Button>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#292F4C',
  },
  sectionTitle: {
    color: '#fff',
    marginVertical: 10,
    fontWeight: '600',
  },
  doctorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  doctorButton: {
    backgroundColor: '#3A3F60',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    marginBottom: 10,
  },
  selectedDoctor: {
    backgroundColor: '#5A5FCF',
  },
  doctorName: {
    color: '#fff',
    fontWeight: '600',
  },
  specialtyText: {
    color: '#ccc',
    fontSize: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3F60',
    padding: 10,
    borderRadius: 8,
  },
  dateText: {
    color: '#fff',
    marginLeft: 10,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeButton: {
    backgroundColor: '#3A3F60',
    padding: 10,
    borderRadius: 8,
  },
  selectedTimeButton: {
    backgroundColor: '#5A5FCF',
  },
  timeText: {
    color: '#fff',
  },
  bookButton: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MakeAppointment;