import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import WeatherScreen from './WeatherScreen'; 
import MapScreen from './MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Weather">
        <Stack.Screen name="Weather" component={WeatherScreen} options={{ title: 'Current Weather' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Your Location' }} />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAF6', 
    },
})
