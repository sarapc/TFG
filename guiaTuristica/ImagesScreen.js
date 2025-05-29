// ImagesScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import HomeButton from './HomeButton';

const BACKEND_URL = 'http://192.168.68.120:3000/api/photos';

export default function ImagesScreen() {
  const route = useRoute();
  const userID = route.params.userID;

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, [userID]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/${userID}`);
      if (!res.ok) throw new Error('No s\'han pogut obtenir les imatges');
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'No s\'ha pogut obrir l\'enllaç');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photourl }} style={styles.image} />
      <View style={styles.infoRow}>
        <Text style={styles.placeText}>📍 {item.place_name}</Text>
        <Text style={styles.dateText}>
          {new Date(item.takenat).toLocaleDateString()} {' '}
          {new Date(item.takenat).toLocaleTimeString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownload(item.photourl)}
      >
        <Text style={styles.downloadText}>Descarrega</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeButton userID={userID} />
      <Text style={styles.title}>Les meves fotos</Text>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : photos.length === 0 ? (
        <Text style={styles.noPhotos}>Encara no tens cap foto desada.</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4E8',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D4576',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  noPhotos: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1D4576',
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoRow: {
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  placeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D4576',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#333',
  },
  downloadButton: {
    backgroundColor: '#1D4576',
    paddingVertical: 10,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
  },
});
