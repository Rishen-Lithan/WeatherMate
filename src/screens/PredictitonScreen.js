import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import LinearGradient from "react-native-linear-gradient";
import {
  CalendarIcon,
  MapPinIcon,
  ChevronDownIcon,
  CloudIcon,
  ArrowRightIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// --- City dataset with lat/lon ---
const cities = [
  { label: "Bentota", value: 0, latitude: 6.4214, longitude: 79.997 },
  { label: "Colombo", value: 1, latitude: 6.9271, longitude: 79.8612 },
  { label: "Galle", value: 2, latitude: 6.0535, longitude: 80.221 },
  { label: "Hambantota", value: 3, latitude: 6.124, longitude: 81.1185 },
  { label: "Jaffna", value: 4, latitude: 9.6615, longitude: 80.0255 },
  { label: "Kesbewa", value: 5, latitude: 6.7979, longitude: 79.9584 },
  { label: "Mannar", value: 6, latitude: 8.98, longitude: 79.904 },
  { label: "Matara", value: 7, latitude: 5.9549, longitude: 80.555 },
  { label: "Mount Lavinia", value: 8, latitude: 6.839, longitude: 79.8651 },
  { label: "Negombo", value: 9, latitude: 7.2086, longitude: 79.8358 },
  { label: "Oruwala", value: 10, latitude: 6.7932, longitude: 80.012 },
  { label: "Trincomalee", value: 11, latitude: 8.5714, longitude: 81.2331 },
  { label: "Weligama", value: 12, latitude: 5.9667, longitude: 80.4167 },
];

// --- Helpers for date formatting ---
const formatISODate = (date) => date.toISOString().split("T")[0];
const formatReadableDate = (date) =>
  date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const today = new Date();
const dates = [
  { label: `Today (${formatReadableDate(today)})`, value: formatISODate(today) },
];

export default function PredictionScreen() {
  const [dateValue, setDateValue] = useState(null);
  const [locationValue, setLocationValue] = useState(null);
  const [dateFocus, setDateFocus] = useState(false);
  const [locationFocus, setLocationFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState({
    "apparent_temperature": 27.669170379638672,
    "temperature": 25.26622200012207,
    "wind_gust": 32.968841552734375,
    "wind_speed": 16.262678146362305
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  // Animate screen fade-in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // --- Transform Open-Meteo daily response into required format ---
  const transformWeatherData = (data, city) => {
    return data.daily.time.map((t, i) => ({
      time: t,
      temperature_2m_mean: data.daily.temperature_2m_mean[i],
      apparent_temperature_mean: data.daily.apparent_temperature_mean[i],
      windspeed_10m_max: data.daily.windspeed_10m_max[i],
      windgusts_10m_max: data.daily.windgusts_10m_max[i],
      shortwave_radiation_sum: data.daily.shortwave_radiation_sum[i],
      precipitation_sum: data.daily.precipitation_sum[i],
      winddirection_10m_dominant: data.daily.winddirection_10m_dominant[i],
      et0_fao_evapotranspiration: data.daily.et0_fao_evapotranspiration[i],
      longitude: city.longitude,
      elevation: data.elevation,
      city: city.value,
      weathercode: data.daily.weathercode[i],
    }));
  };

  // --- Fetch weather from Open-Meteo ---
  const handleGetForecast = async () => {
    if (!locationValue) return;
    const { latitude, longitude } = locationValue;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&past_days=3&forecast_days=1&daily=temperature_2m_mean,apparent_temperature_mean,windspeed_10m_max,windgusts_10m_max,shortwave_radiation_sum,precipitation_sum,winddirection_10m_dominant,et0_fao_evapotranspiration,weathercode&timezone=auto`;

    try {
      setLoading(true);
      const res = await fetch(url);
      const result = await res.json();

      const formatted = transformWeatherData(result, locationValue);

      // ✅ Assign to variable & log
      console.log("Weather Data (Past 4 days including today):", formatted);
      await handlePredict(formatted);
    } catch (err) {
      console.log("Error fetching weather:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (formatted) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/predict_whether', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formatted)
      });

      const responseJson = await response.json();
      if (!response.ok) {
        console.log('Response Error : ', responseJson);
        return;
      }

      // setPrediction(responseJson);
      setTimeout(() => {
        navigation.navigate('ActivityScreen', { prediction: prediction });
      }, 3000);
    } catch (error) {
      console.log('Error predicting weather : ', error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        navigation.navigate('ActivityScreen', { prediction: prediction });
      }, 3000);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#1e3c72", "#2a5298"]}
        style={styles.backgroundGradient}
      >
        {/* Decorative floating icons */}
        <View style={styles.floatingIcon1}>
          <CloudIcon size={24} color="rgba(255, 255, 255, 0.1)" />
        </View>
        <View style={styles.floatingIcon2}>
          <CloudIcon size={18} color="rgba(255, 255, 255, 0.08)" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.header}>
              <Text style={styles.title}>Weather Forecast</Text>
              <Text style={styles.subtitle}>Select date and location</Text>
            </View>

            <View style={styles.form}>
              {/* Date Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <CalendarIcon size={16} color="#4ECDC4" /> Date
                </Text>
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      dateFocus && styles.dropdownFocused,
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={dates}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Choose a date"
                    value={dateValue}
                    onFocus={() => setDateFocus(true)}
                    onBlur={() => setDateFocus(false)}
                    onChange={(item) => {
                      setDateValue(item.value);
                      setDateFocus(false);
                    }}
                    renderRightIcon={() => (
                      <ChevronDownIcon
                        size={20}
                        color={dateFocus ? "#4ECDC4" : "#94A3B8"}
                      />
                    )}
                  />
                </View>
              </View>

              {/* Location Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <MapPinIcon size={16} color="#4ECDC4" /> Location
                </Text>
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      locationFocus && styles.dropdownFocused,
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={cities}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Choose your city"
                    value={locationValue ? locationValue.value : null}
                    onFocus={() => setLocationFocus(true)}
                    onBlur={() => setLocationFocus(false)}
                    onChange={(item) => {
                      setLocationValue(item); // store whole object
                      setLocationFocus(false);
                    }}
                    renderRightIcon={() => (
                      <ChevronDownIcon
                        size={20}
                        color={locationFocus ? "#4ECDC4" : "#94A3B8"}
                      />
                    )}
                  />
                </View>
              </View>

              {/* Get Forecast Button */}
              <TouchableOpacity
                style={[
                  styles.forecastButton,
                  {
                    opacity:
                      dateValue !== null && locationValue !== null ? 1 : 0.6,
                  },
                ]}
                onPress={handleGetForecast}
                disabled={dateValue === null || locationValue === null}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Get Forecast</Text>
                <ArrowRightIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Fetching weather data...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundGradient: { flex: 1 },
  floatingIcon1: {
    position: "absolute",
    top: height * 0.15,
    right: width * 0.1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 30,
    padding: 12,
  },
  floatingIcon2: {
    position: "absolute",
    bottom: height * 0.25,
    left: width * 0.08,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    padding: 10,
  },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: { alignItems: "center", marginBottom: 60 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E6F3FF",
    textAlign: "center",
    opacity: 0.9,
  },
  form: { flex: 1 },
  inputGroup: { marginBottom: 32 },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dropdownContainer: { borderRadius: 16 },
  dropdown: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  dropdownFocused: {
    borderColor: "#4ECDC4",
    backgroundColor: "rgba(78, 205, 196, 0.1)",
  },
  placeholderStyle: { fontSize: 16, color: "#94A3B8", fontWeight: "500" },
  selectedTextStyle: { fontSize: 16, color: "#FFFFFF", fontWeight: "600" },
  forecastButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 8,
    letterSpacing: 0.5,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
