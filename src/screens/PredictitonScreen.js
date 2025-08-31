import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import {
  CalendarIcon,
  MapPinIcon,
  ChevronDownIcon,
  CloudIcon,
  ArrowRightIcon,
} from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const data = [
  { label: 'Bentota', value: 0 },
  { label: 'Colombo', value: 1 },
  { label: 'Galle', value: 2 },
  { label: 'Hambantota', value: 3 },
  { label: 'Jaffna', value: 4 },
  { label: 'Kesbewa', value: 5 },
  { label: 'Mannar', value: 6 },
  { label: 'Matara', value: 7 },
  { label: 'Mount Lavinia', value: 8 },
  { label: 'Negombo', value: 9 },
  { label: 'Oruwala', value: 10 },
  { label: 'Trincomalee', value: 11 },
  { label: 'Weligama', value: 12 },
];

const formatISODate = (date) => {
  return date.toISOString().split("T")[0];
};

const formatReadableDate = (date) => {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const dates = [
  {
    label: `Today (${formatReadableDate(today)})`,
    value: formatISODate(today),
  },
  {
    label: `Tomorrow (${formatReadableDate(tomorrow)})`,
    value: formatISODate(tomorrow),
  },
];

export default function PredictionScreen() {
  const [dateValue, setDateValue] = useState(null);
  const [locationValue, setLocationValue] = useState(null);
  const [dateFocus, setDateFocus] = useState(false);
  const [locationFocus, setLocationFocus] = useState(false);

  const navigation = useNavigation();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetForecast = () => {
    console.log('Get Forecast:', { date: dateValue, location: locationValue });
    navigation.navigate('ActivityScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.backgroundGradient}
      >
        
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
          <Animated.View 
            style={[styles.content, { opacity: fadeAnim }]}
          >
            
            <View style={styles.header}>
              <Text style={styles.title}>Weather Forecast</Text>
              <Text style={styles.subtitle}>Select date and location</Text>
            </View>

            <View style={styles.form}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <CalendarIcon size={16} color="#4ECDC4" /> Date
                </Text>
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    style={[styles.dropdown, dateFocus && styles.dropdownFocused]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    containerStyle={styles.dropdownList}
                    itemContainerStyle={styles.dropdownItem}
                    itemTextStyle={styles.itemTextStyle}
                    data={dates}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Choose a date"
                    value={dateValue}
                    onFocus={() => setDateFocus(true)}
                    onBlur={() => setDateFocus(false)}
                    onChange={item => {
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <MapPinIcon size={16} color="#4ECDC4" /> Location
                </Text>
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    style={[styles.dropdown, locationFocus && styles.dropdownFocused]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    containerStyle={styles.dropdownList}
                    itemContainerStyle={styles.dropdownItem}
                    itemTextStyle={styles.itemTextStyle}
                    data={data}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Choose your city"
                    value={locationValue}
                    onFocus={() => setLocationFocus(true)}
                    onBlur={() => setLocationFocus(false)}
                    onChange={item => {
                      setLocationValue(item.value);
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

              <TouchableOpacity 
                style={[
                  styles.forecastButton,
                  { opacity: (dateValue !== null && locationValue !== null) ? 1 : 0.6 }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingIcon1: {
    position: 'absolute',
    top: height * 0.15,
    right: width * 0.1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    padding: 12,
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: height * 0.25,
    left: width * 0.08,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E6F3FF',
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dropdownContainer: {
    borderRadius: 16,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownFocused: {
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownList: {
    backgroundColor: '#1A237E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  dropdownItem: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemTextStyle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '500',
  },
  forecastButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: 0.5,
  },
});