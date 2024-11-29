import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';

const ViewClassInstance = ({ route }) => {
  const { courseData } = route.params;
  const [classInstances, setClassInstances] = useState([]);
  const [searchDay, setSearchDay] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [filteredInstances, setFilteredInstances] = useState([]);

  useEffect(() => {
    const classInstancesRef = ref(database, 'class_instances');
    
    const unsubscribe = onValue(classInstancesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Thay đổi từ sqliteId sang courseId
        const classArray = Object.values(data).filter(
          classItem => classItem.courseId.toString() === courseData.id.toString()
        );
        setClassInstances(classArray);
        setFilteredInstances(classArray);
      }
    });
  
    return () => unsubscribe();
  }, [courseData.id]);

  useEffect(() => {
    filterClasses();
  }, [searchDay, searchTime, classInstances]);

  const filterClasses = () => {
    let filtered = [...classInstances];

    if (searchDay) {
      filtered = filtered.filter(item => 
        item.courseDay.toLowerCase().includes(searchDay.toLowerCase())
      );
    }

    if (searchTime) {
      filtered = filtered.filter(item => 
        item.courseTime.includes(searchTime)
      );
    }

    setFilteredInstances(filtered);
  };

  const handleBookClass = async (classItem) => {
    // Check if class is full
    if (classItem.currentBookings >= classItem.courseCapacity) {
      Alert.alert('Class Full', 'Sorry, this class is already at full capacity.');
      return;
    }

    try {
      const classRef = ref(database, `class_instances/${classItem.id}`);
      const newBookingCount = (classItem.currentBookings || 0) + 1;
      
      await update(classRef, {
        currentBookings: newBookingCount
      });

      Alert.alert(
        'Success', 
        'Class booked successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to book class. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderClassInstance = ({ item }) => (
    <View style={styles.classContainer}>
      <Text style={styles.classTitle}>{item.classDate}</Text>
      <View style={styles.classDetails}>
        <Text style={styles.teacherText}>Teacher: {item.teacher}</Text>
        {item.comments && (
          <Text style={styles.commentText}>{item.comments}</Text>
        )}
        <View style={styles.bookingInfo}>
          <Text style={styles.capacityText}>
            Available: {item.courseCapacity - (item.currentBookings || 0)} / {item.courseCapacity}
          </Text>
          <TouchableOpacity 
            style={[
              styles.bookButton,
              (item.currentBookings >= item.courseCapacity) && styles.bookButtonDisabled
            ]}
            onPress={() => handleBookClass(item)}
            disabled={item.currentBookings >= item.courseCapacity}
          >
            <Text style={styles.bookButtonText}>
              {item.currentBookings >= item.courseCapacity ? 'Full' : 'Book Class'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Classes</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by day (e.g., Monday)"
          value={searchDay}
          onChangeText={setSearchDay}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by time (e.g., 10:00)"
          value={searchTime}
          onChangeText={setSearchTime}
        />
      </View>

      {filteredInstances.length > 0 ? (
        <FlatList
          data={filteredInstances}
          keyExtractor={(item) => item.id}
          renderItem={renderClassInstance}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noClasses}>No classes available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  classContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  classDetails: {
    marginLeft: 8,
  },
  teacherText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  commentText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  capacityText: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  noClasses: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ViewClassInstance;