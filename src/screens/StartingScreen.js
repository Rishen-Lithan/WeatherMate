import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const { width } = Dimensions.get('window');

const OPEN_WEATHER_API_KEY = '0bd69a4e46c22e5bcfb6b389938ddba1';

export default function StartingScreen() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationData, setLocationData] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);

      // Ask for location permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setErrorMsg('Location permission denied');
          setLoading(false);
          return;
        }
      }

      // Get current location
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding: lat/lon -> city/country
            const locationResponse = await fetch(
              `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
            );
            const locationData = await locationResponse.json();
            setLocationData(locationData[0]);
            console.log('locationData : ', locationData[0]);

            if (locationData.length > 0) {
              const city = locationData[0].name || 'Unknown';
              const country = locationData[0].country || '';
              setLocation({ city, country });
            }

            // Weather data
            const weatherResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
            );
            const weatherData = await weatherResponse.json();

            if (weatherData?.main && weatherData?.weather?.length > 0) {
              setWeather({
                temp: Math.round(weatherData.main.temp),
                condition: weatherData.weather[0].main,
                icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
              });
            } else {
              setErrorMsg('Unable to fetch weather data');
            }
          } catch (error) {
            setErrorMsg('Error fetching data');
          }

          setLoading(false);
        },
        (error) => {
          console.log(error);
          setErrorMsg('Error getting location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 60000, maximumAge: 10000 }
      );
    })();
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#001F3F', '#003366', '#00509E']} style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
      </LinearGradient>
    );
  }

  if (errorMsg) {
    return (
      <LinearGradient colors={['#001F3F', '#003366', '#00509E']} style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#001F3F', '#003366', '#00509E']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.appNameCard, { opacity: fadeAnim }]}>
          <Text style={styles.appName}>🌤️ WeatherMate</Text>
        </Animated.View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
        <Text style={styles.locationText}>📍 {location?.city}, {location?.country}</Text>

        <View style={styles.weatherCard}>
          {weather?.icon && (
            <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
          )}
          <Text style={styles.tempText}>{weather?.temp}°C</Text>
          <Text style={styles.weatherText}>{weather?.condition}</Text>
        </View>

        <TouchableOpacity
          style={styles.forecastButton}
          onPress={() => navigation.navigate('PredictitonScreen', { locationData: locationData})}
        >
          <Text style={styles.forecastButtonText}>🔍 Search Location</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  errorText: {
    color: '#FFD700',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
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
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: width * 0.85,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  weatherIcon: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  tempText: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherText: {
    fontSize: 22,
    color: '#f5f5f5',
    marginTop: 8,
  },
  forecastButton: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  forecastButtonText: {
    color: '#001F3F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
