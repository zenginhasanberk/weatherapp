import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // to get route parameters
  const route = useRoute();

  useEffect(() => {
    (async () => {
      // make sure route parameters exist
      if (route.params?.latitude && route.params?.longitude) {
        setLocation({
          latitude: route.params.latitude,
          longitude: route.params.longitude,
            // default parameters for size of map window
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        // request permission and get location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({
            ...location.coords,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
      }
    })();
  }, [route.params]);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg || "Loading..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style = {styles.map}
        region = {location}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title="Your are here"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
