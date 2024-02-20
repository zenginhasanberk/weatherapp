import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

export default function WeatherScreen() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [coords, setCoords] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords)
      fetchWeatherData(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,snowfall,wind_speed_10m&timezone=America%2FNew_York`);
      const data = response.data;

      setCurrentWeather({
        time: data.current.time,
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        isDay: data.current.is_day,
        snowfall: data.current.snowfall,
        windSpeed: data.current.wind_speed_10m
      });
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  return (
    <View style={styles.container}>
    <ScrollView style={styles.scrollView}>
    {currentWeather ? (
        <View style={styles.weatherCard}>
            <Text style={styles.header}>Weather</Text>
            <Text style={styles.weatherText}>Time: {currentWeather.time}</Text>
            <Text style={styles.weatherText}>Temperature: {currentWeather.temperature}°C</Text>
            <Text style={styles.weatherText}>Feels Like: {currentWeather.apparentTemperature}°C</Text>
            <Text style={styles.weatherText}>Day/Night: {currentWeather.isDay ? 'Day' : 'Night'}</Text>
            <Text style={styles.weatherText}>Snowfall: {currentWeather.snowfall} mm</Text>
            <Text style={styles.weatherText}>Wind Speed: {currentWeather.windSpeed} m/s</Text>
        </View>
    ) : errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
    ) : (
        <Text style={styles.weatherText}>Loading weather data...</Text>
    )}

    {/* For debugging, prints current coords. Used to have weird NYC location error */}
    {/* <Text style={styles.weatherText}>Your coordinates</Text>
    <Text style={styles.weatherText}>{coords.latitude}, {coords.longitude}</Text> */}
    <Button
        title="Show My Location on Map"
        onPress={() => navigation.navigate('Map', {
            latitude: coords.latitude,
            longitude: coords.longitude,
        })}
      />
    </ScrollView>

    </View>
  );
}


// basic styling so far, works well 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAF6', 
    },
    scrollView: {
      marginHorizontal: 30, 
    },
    weatherCard: {
      backgroundColor: '#FFF', 
      borderRadius: 10,
      padding: 20,
      marginTop: 20,
      marginBottom: 20, 
      shadowColor: "#000", 
      shadowOffset: {
        width: 0,
        height: 2, 
      },
      shadowOpacity: 0.25, 
      shadowRadius: 5, 
    },
    header: {
      fontSize: 26, 
      fontWeight: 'bold', 
      marginBottom: 20, 
      textAlign: 'center', 
      color: '#333',
    },
    weatherText: {
      fontSize: 18,
      marginBottom: 10,
      color: '#555',
    },
  });
  
