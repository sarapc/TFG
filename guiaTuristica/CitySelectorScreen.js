import { useState, useEffect } from 'react';
import {  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import HomeButton from './HomeButton';

const BACKEND_URL = 'http://192.168.68.120:3000/api/cities';

const CitySelectorScreen = ({ route }) => {
  const userID = route.params;
  const [ciutats, setCiutats] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCiutats = async () => {
      try {
        const res = await fetch(BACKEND_URL);
        if (!res.ok) throw new Error('No s\'han pogut obtenir les ciutats');
        const data = await res.json();
        setCiutats(data);
        setSelectedCity(data[0]);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCiutats();
  }, []);

  const handleCitySelect = () => {
    if (selectedCity) {
      navigation.navigate('SwipeScreen', { cityId: selectedCity.id, userID: userID});
    }
  };

  const renderCityImage = () => {
    if (!selectedCity?.enllacimatge) return null;
    return (
      <Image
        source={{ uri: selectedCity.enllacimatge }}
        style={styles.cityImage}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1D4576" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Selecciona una localitat</Text>
      </View>

      <View style={styles.contentContainer}>
        <HomeButton userID= {userID} />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCity?.id}
            onValueChange={(itemValue) => {
              const ciutatSeleccionada = ciutats.find(c => c.id === itemValue);
              setSelectedCity(ciutatSeleccionada);
            }}
            style={styles.picker}
          >
            {ciutats.map(ciutat => (
              <Picker.Item key={ciutat.id} label={ciutat.nom} value={ciutat.id} />
            ))}
          </Picker>
        </View>

        {renderCityImage()}

        <TouchableOpacity style={styles.button} onPress={handleCitySelect}>
          <Text style={styles.buttonText}>Següent</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#DDE4E8',
    paddingBottom: 20,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 4,
    marginTop: 50,
    alignItems: 'center',
  },
  cityImage: {
    width: '80%',
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  pickerContainer: {
    width: '80%',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D4576',
    borderRadius: 10,
    paddingVertical: 15,
  },
  picker: {
    fontSize: 18,
    height: 50,
    width: '100%',
    color: '#FFFFFF',
    backgroundColor: '#1D4576',
  },
  button: {
    backgroundColor: '#1D4576',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 50,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CitySelectorScreen;