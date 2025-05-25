import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import SwipeCards from 'react-native-swipe-cards';
import HomeButton from './HomeButton';

const { width } = Dimensions.get('window');
const BACKEND_URL = 'http://192.168.68.120:3000/api/places';

const SwipeScreen = ({ route, navigation }) => {
  const cityId = route.params.cityId;
  const userID = route.params.userID;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/city/${cityId}`);
        if (!res.ok) throw new Error('No s’han pogut obtenir els llocs');
        const data = await res.json();
        setCards(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [cityId]);

  const handleRoute = () => {
    navigation.navigate('RouteOrderScreen', { places: selectedPlaces, userID: userID });
  };

  const handleYup = (place) => {
    console.log(`✅ Quieres visitar: ${place.nom}`);
    setSelectedPlaces((prev) => [...prev, place]);
  };

  const handleNope = (place) => {
    console.log(`❌ No te interesa: ${place.nom}`);
  };

  function PlaceCard({ nom, enllacimatge, descripcio, horari, boolmenjar, boolentrada, duradamitjana, enllacentrades }) {
    return (
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.scrollCard}>
          <Image source={{ uri: enllacimatge }} style={styles.image} />
          <Text style={styles.title}>{nom}</Text>
          <Text style={styles.description}>{descripcio}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#1D4576" />
            <Text style={styles.infoText}>Horari: {horari}</Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome5 name="utensils" size={18} color={boolmenjar ? "#1D4576" : "#999"} />
            <Text style={styles.infoText}>
              {boolmenjar ? 'Apte per menjar' : 'No apte per menjar'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoText, { color: boolentrada ? '#1D4576' : '#555' }]}>
              {boolentrada ? '💶 Entrada necessària' : 'Entrada gratuïta'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="walk-outline" size={18} color="#1D4576" />
            <Text style={styles.infoText}>Durada mitjana: {duradamitjana} min</Text>
          </View>

          {boolentrada && enllacentrades && (
            <TouchableOpacity
              onPress={() => Linking.openURL(enllacentrades)}
              style={styles.ticketButton}
            >
              <Text style={styles.ticketButtonText}>Comprar entrada</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1D4576" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeButton userID={userID} />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Explora la ciutat</Text>
      </View>

      <SwipeCards
        cards={cards}
        renderCard={(cardData) => <PlaceCard {...cardData} />}
        renderNoMoreCards={() => (
          <View style={styles.container2}>
            <Text style={styles.title}>No hi ha més llocs desats</Text>
            <TouchableOpacity style={styles.button} onPress={handleRoute}>
              <Text style={styles.buttonText}>Modifica la ruta</Text>
            </TouchableOpacity>
          </View>
        )}
        handleYup={handleYup}
        handleNope={handleNope}
        showYup
        showNope
        yupText="M'interessa"
        nopeText="No m'interessa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#DDE4E8',
  },
  container2: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#DDE4E8',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: -20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: width * 0.9,
    height: 550,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop: -60,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#61A4DE',
  },
  scrollCard: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    color: '#1D4576',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  ticketButton: {
    marginTop: 12,
    backgroundColor: '#1D4576',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  ticketButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SwipeScreen;
