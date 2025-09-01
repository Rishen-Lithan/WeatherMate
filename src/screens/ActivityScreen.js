import React, { useState, useEffect } from 'react';
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

import { useNavigation } from '@react-navigation/native';

export default function ActivityScreen({ route }) {
  const { prediction } = route.params || {};
  const [suggestedActivities, setSuggestedActivities] = useState([]);

  const navigation = useNavigation();

  // console.log('prediction : ', prediction);

  // Activity conditions lookup table
  const activityConditions = {
    Swimming: {
      minTemp: 24,
      maxPrecipitation: 2,
      maxWindSpeed: 15,
      maxWindGust: 20,
      weatherCode: ['clear', 'partly cloudy'],
      otherConditions: 'Calm waters, no storm'
    },
    Sunbathing: {
      minTemp: 25,
      maxPrecipitation: 0,
      maxWindSpeed: 15,
      maxWindGust: null,
      weatherCode: ['clear', 'partly cloudy'],
      otherConditions: 'UV Index > 3 (moderate or higher)'
    },
    Surfing: {
      minTemp: null,
      maxPrecipitation: 0,
      maxWindSpeed: 25,
      maxWindGust: null,
      weatherCode: ['clear', 'slightly cloudy'],
      otherConditions: 'Wave Height > 0.5m, offshore winds'
    },
    Boating: {
      minTemp: null,
      maxPrecipitation: 0,
      maxWindSpeed: 20,
      maxWindGust: null,
      weatherCode: ['clear', 'slightly cloudy'],
      otherConditions: 'Wave Height < 0.5m'
    },
    Fishing: {
      minTemp: 15,
      maxPrecipitation: 0,
      maxWindSpeed: 15,
      maxWindGust: null,
      weatherCode: ['clear', 'slightly cloudy'],
      otherConditions: 'Wave height < 0.5m'
    },
    'Beach Sports': {
      minTemp: 20,
      maxPrecipitation: 0,
      maxWindSpeed: 15,
      maxWindGust: null,
      weatherCode: ['clear', 'slightly cloudy'],
      otherConditions: null
    }
  };

  // Function to check if an activity is suitable based on current weather
  const checkActivitySuitability = (activity, conditions, weather) => {
    // Check temperature
    if (conditions.minTemp && weather.temperature < conditions.minTemp) {
      return false;
    }

    // Check wind speed
    if (conditions.maxWindSpeed && weather.wind_speed > conditions.maxWindSpeed) {
      return false;
    }

    // Check wind gust
    if (conditions.maxWindGust && weather.wind_gust > conditions.maxWindGust) {
      return false;
    }
    
    return true;
  };

  // Get activity emoji
  const getActivityEmoji = (activity) => {
    const emojis = {
      'Swimming': '🏊‍♂️',
      'Sunbathing': '☀️',
      'Surfing': '🏄‍♂️',
      'Boating': '⛵',
      'Fishing': '🎣',
      'Beach Sports': '🏐'
    };
    return emojis[activity] || '🌊';
  };

  // Get activity recommendation reason
  const getRecommendationReason = (activity, weather) => {
    switch (activity) {
      case 'Swimming':
        return `Perfect temperature at ${weather.temperature.toFixed(1)}°C and calm winds`;
      case 'Sunbathing':
        return `Ideal conditions with ${weather.temperature.toFixed(1)}°C and light winds`;
      case 'Fishing':
        return `Good temperature and calm winds at ${weather.wind_speed.toFixed(1)} km/h`;
      case 'Beach Sports':
        return `Great weather with moderate winds for outdoor activities`;
      case 'Boating':
        return `Safe wind conditions at ${weather.wind_speed.toFixed(1)} km/h`;
      case 'Surfing':
        return `Acceptable wind conditions for water sports`;
      default:
        return 'Weather conditions are favorable';
    }
  };

  // Calculate suggested activities based on prediction
  useEffect(() => {
    if (prediction) {
      const suitable = [];
      
      Object.entries(activityConditions).forEach(([activity, conditions]) => {
        if (checkActivitySuitability(activity, conditions, prediction)) {
          suitable.push({
            name: activity,
            emoji: getActivityEmoji(activity),
            reason: getRecommendationReason(activity, prediction)
          });
        }
      });

      setSuggestedActivities(suitable);
    }
  }, [prediction]);

  const renderActivityCard = (activity) => (
    <View key={activity.name} style={styles.activityCard}>
      <Text style={styles.activityEmoji}>{activity.emoji}</Text>
      <Text style={styles.activityName}>{activity.name}</Text>
      <Text style={styles.activityReason}>{activity.reason}</Text>
    </View>
  );

  const renderWeatherSummary = () => (
    <View style={styles.weatherSummaryCard}>
      <Text style={styles.weatherSummaryTitle}>Current Conditions</Text>
      <View style={styles.weatherRow}>
        <Text style={styles.weatherLabel}>Temperature:</Text>
        <Text style={styles.weatherValue}>{prediction.temperature.toFixed(1)}°C</Text>
      </View>
      <View style={styles.weatherRow}>
        <Text style={styles.weatherLabel}>Feels like:</Text>
        <Text style={styles.weatherValue}>{prediction.apparent_temperature.toFixed(1)}°C</Text>
      </View>
      <View style={styles.weatherRow}>
        <Text style={styles.weatherLabel}>Wind Speed:</Text>
        <Text style={styles.weatherValue}>{prediction.wind_speed.toFixed(1)} km/h</Text>
      </View>
      <View style={styles.weatherRow}>
        <Text style={styles.weatherLabel}>Wind Gusts:</Text>
        <Text style={styles.weatherValue}>{prediction.wind_gust.toFixed(1)} km/h</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0B1426', '#1E3A5F', '#2D5AA0']} style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.appNameCard}>
          <Text style={styles.appName}>🌤️ WeatherMate</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Suggested Activities</Text>
        
        {prediction && renderWeatherSummary()}

        {suggestedActivities.length > 0 ? (
          <View style={styles.activitiesContainer}>
            <Text style={styles.sectionTitle}>Perfect for today:</Text>
            {suggestedActivities.map(renderActivityCard)}
          </View>
        ) : (
          <View style={styles.noActivitiesCard}>
            <Text style={styles.noActivitiesEmoji}>⚠️</Text>
            <Text style={styles.noActivitiesText}>
              Current weather conditions are not ideal for outdoor beach activities.
            </Text>
            <Text style={styles.noActivitiesSubtext}>
              Consider indoor activities or wait for better conditions.
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('WelcomeScreen')}
        >
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
    backgroundColor: '#1A2B4C',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  weatherSummaryCard: {
    backgroundColor: '#1A2B4C',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  weatherSummaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  weatherLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  weatherValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  activitiesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  activityCard: {
    backgroundColor: '#1A2B4C',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: width * 0.9,
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  activityEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  activityName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activityReason: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
  },
  noActivitiesCard: {
    backgroundColor: '#1A2B4C',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    marginBottom: 20,
    width: width * 0.9,
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  noActivitiesEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  noActivitiesText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noActivitiesSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#1E40AF',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});