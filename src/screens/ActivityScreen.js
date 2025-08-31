import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const activitiesByCondition = {
  Clear: ['🌞 Go for a hike', '🚴‍♂️ Ride a bicycle', '🏖️ Visit the beach'],
  Clouds: ['☁️ Take a city walk', '🏛️ Visit a museum', '🍽️ Try a new café'],
  Rain: ['☔ Watch a movie', '📚 Read a book at home', '🏊‍♀️ Indoor swimming'],
  Snow: ['⛷️ Ski or snowboard', '☕ Enjoy hot cocoa', '🎿 Build a snowman'],
  Thunderstorm: ['🎮 Play indoor games', '🎧 Listen to music', '🍿 Watch Netflix'],
  Drizzle: ['🧥 Wear a raincoat & walk', '🛍️ Go shopping', '🍜 Eat warm food'],
  Mist: ['🧘 Practice meditation', '📸 Take misty photos', '☕ Relax in a café'],
};

export default function ActivityScreen() {
//   const { condition } = route.params || {};
    const [condition, setCondition] = useState('Clear')
    const activities = activitiesByCondition[condition] || [
      '🗺️ Explore local attractions',
      '🧘 Relax',
      '📸 Take photos',
    ];

  return (
    <LinearGradient colors={['#082371', '#3B5998', '#A9C9FF']} style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.appNameCard}>
          <Text style={styles.appName}>🌤️ WeatherMate</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Suggested Activities for {condition}</Text>

        {activities.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <Text style={styles.activityText}>{activity}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appNameCard: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#082371',
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: width * 0.85,
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  activityText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
