import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import HomeButton from './HomeButton';

const { width, height } = Dimensions.get('window');

const BACKEND_URL = 'http://192.168.68.120:3000/api';

const MapScreen = ({ route, navigation }) => {
  const places = route.params.places;
  const userID = route.params.userID;

  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeSegments, setRouteSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateColor = (index, total) => {
    const hue = (index * (360 / total)) % 360;
    return `hsl(${hue}, 80%, 50%)`;
  };

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permís denegat', 'Permís de localització denegat');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userCoord = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoord);

      setRegion({
        ...userCoord,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      await getRoute(userCoord, places);
    };

    fetchLocation();
  }, []);

  const getRoute = async (userLocation, places) => {
    let allCoordinates = [userLocation];
    places.forEach(place => {
      allCoordinates.push({ latitude: place.latitude, longitude: place.longitude });
    });
    allCoordinates.push(userLocation);

    const segments = [];
    const totalSegments = allCoordinates.length - 1;

    try {
      for (let i = 0; i < totalSegments; i++) {
        const start = allCoordinates[i];
        const end = allCoordinates[i + 1];
        const route = await getRouteFromAPI(start, end);

        segments.push({
          coordinates: route,
          color: generateColor(i, totalSegments),
        });
      }

      setRouteSegments(segments);
      setLoading(false);
    } catch (error) {
      console.error("Error obtenint la ruta:", error);
      setLoading(false);
    }
  };

  const getRouteFromAPI = async (start, end) => {
    try {
      const startPoint = `${start.longitude},${start.latitude}`;
      const endPoint = `${end.longitude},${end.latitude}`;
      const url = `http://router.project-osrm.org/route/v1/driving/${startPoint};${endPoint}?overview=full&geometries=polyline`;

      const response = await axios.get(url);
      const encodedPolyline = response.data.routes[0].geometry;

      const decodedPoints = polyline.decode(encodedPolyline);
      const route = decodedPoints.map(point => ({
        latitude: point[0],
        longitude: point[1],
      }));

      return route;
    } catch (error) {
      console.error('Error obtenint la ruta entre dos punts:', error);
      return [];
    }
  };

  const handleTakeSelfie = async (place) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permís denegat', 'Permís per accedir a la càmera denegat.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const photo = result.assets[0];
      console.log(`📸 Selfie feta a ${place.name}:`, photo.uri);

      const formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      formData.append('userID', userID.toString());
      formData.append('placeID',   place.id.toString());

      try {
        const response = await fetch(`${BACKEND_URL}/photos/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert('Foto guardada', 'La foto s\'ha desat correctament!');
          console.log('Resposta servidor:', data);
        } else {
          Alert.alert('Error', 'Error desant la foto: ' + (data.error || ''));
          console.error('Error backend:', data);
        }
      } catch (error) {
        Alert.alert('Error', 'Error en la petició: ' + error.message);
        console.error('Error fetch:', error);
      }
    }
  };

  const handleFinishRoute = () => {
    navigation.navigate('SaveRouteScreen', {
      places: places,
      userID: userID,
    });
  };

  return (
    <View style={styles.container}>
      <HomeButton userID={userID} />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>La teva ruta</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
          >
            {userLocation && (
              <Marker coordinate={userLocation} title="Estàs aquí" pinColor="blue" />
            )}

            {places.map((place, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.name}
                description="Toca per fer una foto"
                onPress={() => handleTakeSelfie(place)}
              >
                <MaterialIcons name="photo-camera" size={30} color="#1D4576" />
              </Marker>
            ))}

            {routeSegments.map((segment, index) => (
              <Polyline
                key={index}
                coordinates={segment.coordinates}
                strokeColor={segment.color}
                strokeWidth={4}
              />
            ))}
          </MapView>

          <TouchableOpacity style={styles.saveButton} onPress={handleFinishRoute}>
            <Text style={styles.saveButtonText}>Finalitza i desa ruta</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4E8',
  },
  headerContainer: {
    backgroundColor: '#1D4576',
    padding: 15,
    marginTop: 40,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  map: {
    width: width,
    height: height - 180,
  },
  saveButton: {
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    bottom: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapScreen;
