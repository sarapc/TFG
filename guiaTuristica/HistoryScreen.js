import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HomeButton from './HomeButton';

const BACKEND_URL = 'http://192.168.68.120:3000/api';

const HistoryScreen = ({ route }) => {
  const userID = route.params;
  const navigation = useNavigation();

  const [rutes, setRutes] = useState([]);
  const [recomanacions, setRecomanacions] = useState([]);
  const [loadingRutes, setLoadingRutes] = useState(true);
  const [loadingReco, setLoadingReco] = useState(true);

  useEffect(() => {
    const fetchRutes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/rutes/user/${userID}`);
        const data = await response.json();
        if (Array.isArray(data)) setRutes(data);
        else setRutes([]);
      } catch (error) {
        console.error('Error carregant rutes:', error);
        setRutes([]);
      } finally {
        setLoadingRutes(false);
      }
    };

    const fetchRecomanacions = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/recomanacions/${userID}`);
        const data = await response.json();
        if (Array.isArray(data)) setRecomanacions(data);
        else setRecomanacions([]);
      } catch (error) {
        console.error('Error carregant recomanacions:', error);
        setRecomanacions([]);
      } finally {
        setLoadingReco(false);
      }
    };

    fetchRutes();
    fetchRecomanacions();
  }, [userID]);

  const repetirRuta = async (ruta) => {
    try {
      if (!ruta.id) {
        alert('No es pot repetir aquesta ruta.');
        return;
      }
      const response = await fetch(`${BACKEND_URL}/rutes/${ruta.id}/llocs`);
      if (!response.ok) throw new Error('Error recuperant llocs de la ruta.');

      const llocs = await response.json();

      navigation.navigate('MapScreen', { places: llocs, userID });
    } catch (error) {
      console.error('Error al repetir ruta:', error);
      alert('No s\'ha pogut carregar la ruta.');
    }
  };

  return (
    <View style={styles.container}>
      <HomeButton userID={userID} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Històric de Rutes</Text>

        {loadingRutes ? (
          <Text style={styles.loading}>Carregant rutes...</Text>
        ) : rutes.length === 0 ? (
          <Text style={styles.noRecomanacions}>Encara no has fet cap ruta.</Text>
        ) : (
          rutes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.rutaContainer}
              onPress={() => repetirRuta(item)}
            >
              <View>
                <Text style={styles.nomRuta}>{item.nom}</Text>
                {item.puntuacio !== null && (
                  <Text style={styles.puntuacioText}>Puntuació: {item.puntuacio} ⭐</Text>
                )}
              </View>
              <Ionicons name="repeat" size={24} color="#1D4576" />
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.subtitle}>Recomanacions per a tu</Text>

        {loadingReco ? (
          <Text style={styles.loading}>Carregant recomanacions...</Text>
        ) : recomanacions.length === 0 ? (
          <Text style={styles.noRecomanacions}>Encara no disposes de cap recomanació</Text>
        ) : (
          recomanacions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recomanacioContainer}
              onPress={() => repetirRuta(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.nomRuta}>{item.nom}</Text>
                <Text style={{ fontStyle: 'italic', color: '#555' }}>{item.ciutat}</Text>
                {item.puntuacio > 0 && (
                  <Text style={styles.puntuacioText}>Puntuació: {item.puntuacio.toFixed(1)} ⭐</Text>
                )}
                {item.comentari_text && (
                  <Text style={styles.comentariText} numberOfLines={2} ellipsizeMode="tail">
                    "{item.comentari_text}"
                  </Text>
                )}
              </View>
              <Ionicons name="compass-outline" size={24} color="#1D4576" />
            </TouchableOpacity>
          )))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4E8',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D4576',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#1D4576',
    marginBottom: 10,
  },
  rutaContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#1D4576',
    borderWidth: 1,
  },
  recomanacioContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#61A4DE',
    borderWidth: 1,
  },
  nomRuta: {
    fontSize: 18,
    color: '#1D4576',
    fontWeight: '600',
  },
  puntuacioText: {
    fontSize: 14,
    color: '#555',
  },
  noRecomanacions: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  loading: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  comentariText: {
  fontSize: 14,
  color: '#444',
  fontStyle: 'italic',
  marginTop: 4,
},
});

export default HistoryScreen;
