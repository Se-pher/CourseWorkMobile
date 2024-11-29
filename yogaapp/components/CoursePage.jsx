import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const CourseItem = ({ item, onPress }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.courseContainer}>
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)}
        style={styles.headerContainer}
      >
        <Text style={styles.courseTitle}>{item.type}</Text>
        <Text>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.courseInfo}>Capacity: {item.capacity}</Text>
          <Text style={styles.courseInfo}>Day: {item.day}</Text>
          <Text style={styles.courseInfo}>Duration: {item.duration}</Text>
          <Text style={styles.courseInfo}>Time: {item.time}</Text>
          <Text style={styles.courseInfo}>Description: {item.description}</Text>
          <Text style={styles.courseInfo}>Price: {item.price}</Text>
          
          <TouchableOpacity
            onPress={() => onPress(item)}
            style={styles.viewDetailsButton}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const coursesRef = ref(database, 'courses');
    
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const coursesArray = Object.values(data);
        setCourses(coursesArray);
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleCoursePress = (course) => {
    navigation.navigate('ViewClassInstance', { 
      courseId: course.id,
      courseData: course
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>
        Courses List
      </Text>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CourseItem 
            item={item} 
            onPress={handleCoursePress}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  courseContainer: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  courseInfo: {
    fontSize: 16,
    marginVertical: 4,
    color: '#666',
  },
  viewDetailsButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CoursePage;