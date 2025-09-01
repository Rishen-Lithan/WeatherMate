import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { 
  BoltIcon, 
  SunIcon, 
  MapPinIcon,
  ArrowRightIcon 
} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen () {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('StartingScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView>
        <LinearGradient
            colors={['#0F1419', '#1A237E', '#283593', '#3F51B5']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            
            {/* Animated Background Elements */}
            <View style={styles.backgroundElements}>
            <LinearGradient
                colors={['rgba(76, 175, 80, 0.3)', 'transparent']}
                style={[styles.blob, styles.blob1]}
            />
            <LinearGradient
                colors={['rgba(33, 150, 243, 0.4)', 'transparent']}
                style={[styles.blob, styles.blob2]}
            />
            <LinearGradient
                colors={['rgba(156, 39, 176, 0.2)', 'transparent']}
                style={[styles.blob, styles.blob3]}
            />
            </View>

            {/* Weather Pattern Overlay */}
            <View style={styles.weatherPattern}>
            <View style={[styles.raindrop, { top: '10%', left: '20%' }]} />
            <View style={[styles.raindrop, { top: '15%', right: '25%' }]} />
            <View style={[styles.raindrop, { top: '25%', left: '15%' }]} />
            <View style={[styles.raindrop, { top: '35%', right: '30%' }]} />
            </View>

            <Animated.View 
            style={[
                styles.content,
                {
                opacity: fadeAnim,
                transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                ]
                }
            ]}
            >
            
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                <LinearGradient
                    colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
                    style={styles.logoGradient}
                >
                    <BoltIcon size={50} color="#FFFFFF" />
                </LinearGradient>
                </View>
                
                <Text style={styles.appName}>WeatherMate</Text>
                <View style={styles.taglineContainer}>
                <Text style={styles.tagline}>Your Personal</Text>
                <LinearGradient
                    colors={['#FFD700', '#FFA726']}
                    style={styles.taglineHighlight}
                >
                    <Text style={styles.taglineHighlightText}>Weather Companion</Text>
                </LinearGradient>
                </View>
            </View>

            {/* Feature Cards */}
            <View style={styles.featureGrid}>
                <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                    <MapPinIcon size={24} color="#4ECDC4" />
                </View>
                <Text style={styles.featureTitle}>Precise Location</Text>
                <Text style={styles.featureDesc}>Hyper-local forecasts for your exact location</Text>
                </View>
                
                <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                    <SunIcon size={24} color="#FFD700" />
                </View>
                <Text style={styles.featureTitle}>Smart Predictions</Text>
                <Text style={styles.featureDesc}>AI-powered weather insights and recommendations</Text>
                </View>
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
                <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleGetStarted}
                activeOpacity={0.9}
                >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.primaryButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                    <ArrowRightIcon size={20} color="#FFFFFF" style={styles.buttonIcon} />
                </LinearGradient>
                </TouchableOpacity>
            </View>
            </Animated.View>

            {/* Bottom Wave Effect */}
            <View style={styles.waveContainer}>
            <LinearGradient
                colors={['transparent', 'rgba(15, 20, 25, 0.8)']}
                style={styles.wave}
            />
            </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    position: 'relative',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 1000,
  },
  blob1: {
    width: 300,
    height: 300,
    top: -150,
    right: -100,
  },
  blob2: {
    width: 250,
    height: 250,
    bottom: -125,
    left: -80,
  },
  blob3: {
    width: 200,
    height: 200,
    top: height * 0.4,
    right: -50,
  },
  weatherPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  raindrop: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: 'rgba(173, 216, 230, 0.6)',
    borderRadius: 2,
    transform: [{ rotate: '15deg' }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -1,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#B8D4F0',
    marginBottom: 8,
  },
  taglineHighlight: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  taglineHighlightText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 40,
    paddingHorizontal: 8,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: '#B8D4F0',
    textAlign: 'center',
    lineHeight: 16,
  },
  ctaSection: {
    alignItems: 'center',
  },
  primaryButton: {
    width: width * 0.85,
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#E6F3FF',
    fontWeight: '500',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  wave: {
    flex: 1,
  },
});