import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ route, navigation }) {
    const userID = route.params;
    const HomeButton = ({ userID });
    const handleLogout = async () => {
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Benvingut a GoRuta</Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('CitySelector', userID)}
        >
          <Ionicons name="map-outline" size={30} color="#fff" />
          <Text style={styles.iconText}>Crear ruta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('HistoryScreen', userID)}
        >
          <Ionicons name="time-outline" size={30} color="#fff" />
          <Text style={styles.iconText}>Històric</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ProfileScreen', userID)}
        >
          <Ionicons name="person-outline" size={30} color="#fff" />
          <Text style={styles.iconText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Tancar sessió</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4E8',
    padding: 20,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D4576',
    textAlign: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    marginBottom: 80,
  },
  iconButton: {
    backgroundColor: '#1D4576',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  logoutButton: {
    alignSelf: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#1D4576',
    borderWidth: 1,
    marginBottom: 80,
  },
  logoutText: {
    color: '#1D4576',
    fontWeight: '600',
  },
});
